# Contract: WhatsApp Cloud API Webhook

Route: `app/api/whatsapp/webhook/route.ts`. This is the only externally-facing surface this feature adds — everything else (AI adapter, outbound send helper) is internal to the app.

## GET — Meta verification handshake

Meta calls this once when the webhook URL is configured in the app dashboard.

**Query params** (sent by Meta): `hub.mode=subscribe`, `hub.verify_token=<value you set in Meta's dashboard>`, `hub.challenge=<random string>`.

**Contract**: if `hub.verify_token` equals `process.env.WHATSAPP_VERIFY_TOKEN`, respond `200` with the raw `hub.challenge` value as the body (`text/plain`). Otherwise respond `403`. No database access, no signature check (there's no body to sign on a GET).

## POST — inbound message delivery

Meta POSTs here for every inbound message and every message-status update. Only `messages` entries matter for this feature; status updates (`statuses` array) are acknowledged (`200`) and otherwise ignored.

### Required headers

| Header | Contract |
|---|---|
| `X-Hub-Signature-256` | `sha256=<hex hmac>` of the raw request body, keyed with `WHATSAPP_APP_SECRET` (Meta app secret, not the access token). Reject with `401` if missing or mismatched — verification MUST happen before the body is parsed as JSON for any further use, per constitution Principle V ("Todo webhook MUST validar la firma de Meta antes de procesar el payload"). |

### Body shape (Meta's standard Cloud API webhook payload — abbreviated to the fields this feature reads)

```json
{
  "entry": [{
    "changes": [{
      "value": {
        "metadata": { "phone_number_id": "..." },
        "contacts": [{ "wa_id": "5215512345678" }],
        "messages": [{
          "id": "wamid.HBg...",
          "from": "5215512345678",
          "timestamp": "1732550400",
          "type": "text",
          "text": { "body": "Hola Nexoru, ya agendé mi sesión. Mi referencia es NXR-SES-260924-A1B2." }
        }]
      }
    }]
  }]
}
```

### Processing contract

1. Verify signature (above). On failure: `401`, no further processing.
2. For each `messages[]` entry: idempotency check on `messages[].id` against `WhatsAppMessage.whatsappMessageId` (data-model.md) — if it already exists, skip this message (Meta retry) but still return `200` overall.
3. Non-text message types (`image`, `audio`, `video`, `document`, `sticker`, `location`, etc.): record the same as a text message would be, so the "unsupported format" reply (FR-016) is composed and sent through the same post-response path below — never silently dropped, but never sent to the AI adapter either.
4. Text messages: append to the sender's `WhatsAppConversation.bufferedText`, bump `bufferVersion` (all fast, synchronous DB work).
5. **Respond to Meta with `200` now** — signature verification, idempotency, and buffering are the only work done before responding. Nothing in steps 6–7 blocks this response.
6. **After** the response is sent, via `after()` from `next/server` (research.md, decision 5): wait ~2–3 seconds, re-read `bufferVersion`; if it advanced, exit without sending anything (a later invocation owns the reply). Otherwise read the combined `bufferedText`, run the deterministic pre-processing below, invoke the AI adapter as needed, send the reply via `lib/whatsapp/client.ts`, and clear the buffer.
7. Vercel's function duration limit (300s default, Fluid Compute, per research.md decision 5) comfortably covers steps 6's wait plus the Claude call and outbound send — no risk of the `after()` work being cut off at this feature's message sizes.

### Deterministic pre-processing (never delegated to the model)

- **Reference extraction**: regex match `NXR-SES-\d{6}-[A-Z0-9]{4}` (the exact format `lib/services/onboarding-meeting.ts` generates) against the combined buffered text.
- **Phone match (FR-023)**: if a reference matches an `OnboardingMeeting.meetingReference`, compare the webhook's `messages[].from` (digits-only) against that meeting's `contactWhatsappSnapshot` (digits-only, same normalization as the existing `wa.me` link code). Mismatch → treat as a stuck point (`consecutiveFailedAttempts += 1`, escalate at the FR-011 threshold), never confirm.
- **Business hours check (FR-014)**: pure function on `new Date()` against 10:00–15:00 `America/Mexico_City` — no model call.

### Where the AI adapter is invoked

Only after the deterministic steps above. Two calls, both through `lib/ai/adapter.ts` (constitution Principle IV — single adapter):

```ts
// 1. Intent classification (only when a reference/session is already resolved and the
//    message isn't a straightforward reference-confirmation match)
classifyIntent(input: { messageText: string }): Promise<
  "ask_about_proposal" | "request_human" | "unclear"
>

// 2. Reply composition — receives ONLY fields already fetched from the database.
//    The model never receives raw DB query access or instructions to "look something up."
//    Note: "unsupported_format" is NOT a valid kind here — per step 3 above, that reply is
//    fixed copy sent directly via sendTextMessage, never composed by the model.
composeReply(input: {
  kind: "appointment_confirmation" | "appointment_status" | "proposal_answer" | "wizard_redirect" | "escalation_out_of_hours";
  fields: Record<string, string>; // e.g. { date, time, reference, joinLink } or { packageName, price, scope }
}): Promise<string> // Mexican Spanish, tone matching docs/legacy/
```

Both calls use the Haiku-class model (research.md, decisions 6/7/9) and route through Anthropic's Messages API via `fetch` (no SDK dependency, matching this repo's existing OpenAI-via-`fetch` convention). Neither call enables prompt caching — checked against Anthropic's current published minimums (Haiku 4.5: 4,096 tokens) and both calls' prompts fall well under that, so caching would silently no-op; see research.md decision 9 for the sourced reasoning. Every call to either function inserts one `WhatsAppAiCall` row (`kind`, `model`, `inputTokens`, `outputTokens`, `estimatedCostUsd` computed from the response's actual usage) — this is what SC-003's monthly cost comparison against the $600 baseline is computed from (research.md decision 9, spec FR-025), and it is **not** subject to the 90-day conversation-retention rule (FR-022) since it holds no prospect personal data.

Phone numbers passed into either call's `fields` (none currently are — both only receive appointment/proposal/link data, never a phone number) and any phone number logged anywhere in this webhook's processing (e.g. `messages[].from`) MUST go through `lib/whatsapp/mask-phone.ts` before appearing in a log line (constitution Principle V, spec FR-024) — the raw number is fine in the database (`WhatsAppConversation.phoneNumber`), never fine in `console.log`/error output.

## Outbound sends (`lib/whatsapp/client.ts`)

Two Cloud API calls this feature makes, both authenticated with `WHATSAPP_ACCESS_TOKEN` against `https://graph.facebook.com/v<version>/<WHATSAPP_PHONE_NUMBER_ID>/messages`:

- `sendTextMessage(to, body)` — every reply to a prospect, including Ulises's manual replies via the escalation reply page below.
- `sendTemplateMessage(to, templateName, params)` — the escalation alert to Ulises's personal number, since a business-initiated message outside the 24h customer service window requires a pre-approved Meta utility template (per the plan's explicit requirement and `docs/respuestas-preguntas-abiertas.md` question 8). Called at most once per hour per prospect phone number (research.md, decision 6) — the conversation is always moved to `ESCALATED` regardless, only the repeat notification is skipped (`WhatsAppEscalation.rateLimited`, data-model.md).

## Internal escalation reply page (Plan B if coexistence isn't eligible — research.md, decision 2)

Route: `app/whatsapp/escalations/[conversationId]/reply/page.tsx` (a page, not an API route — Ulises opens it directly from a link in the escalation email).

- **Access**: a signed token in the URL query string (HMAC of `conversationId` + a 48-hour expiry, keyed by a new `WHATSAPP_ESCALATION_TOKEN_SECRET`) — 48 hours comfortably outlasts the 24-hour WhatsApp customer-service window this same page's submit handler checks (see below), without being open-ended. Same shared-secret pattern this repo already uses for `INTERNAL_API_KEY` on `/api/update-meeting` — no login system, since this app has none (`CLAUDE.md`).
- **Reads**: that conversation's recent `WhatsAppMessage` rows, for context.
- **Writes**: on submit, calls `sendTextMessage` for that conversation's `phoneNumber` and inserts a `WhatsAppMessage` row (`direction: OUTBOUND`) — reuses the exact same send path and data model the agent itself uses, so there is no second notion of "how a message gets sent."
- **Does not**: change `WhatsAppConversation.stage` away from `ESCALATED`, or re-enable automated replies — this is a manual channel for the human who already owns the conversation, not a hand-back mechanism (hand-back is a separate, deliberate action per spec Assumptions).

## Retention cron (`app/api/whatsapp/retention/route.ts`)

Route: a Vercel Cron target (configured in `vercel.json`, e.g. daily), per constitution Principle III ("Toda automatización... MUST implementarse en código propio... gestionado bajo Spec Kit") — not a third-party scheduler.

**Contract**: on trigger, delete (or archive, per implementation choice) every `WhatsAppConversation` row whose `lastActivityAt` is more than 90 days old, along with its cascaded `WhatsAppMessage`/`WhatsAppEscalation` rows (FR-022). Scope is exact and MUST NOT be broadened:

- **In scope**: `WhatsAppConversation`, `WhatsAppMessage`, `WhatsAppEscalation` only.
- **Out of scope, always**: every wizard-owned table (`OnboardingSession` and everything under it) — this feature never writes to or deletes from those, per its read-only relationship to wizard data (spec Assumptions).
- **Out of scope, deliberately**: `WhatsAppAiCall` — holds no prospect personal data, retained indefinitely for the ongoing SC-003 cost comparison (research.md decision 9).

## New environment variables

| Variable | Purpose |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` | Cloud API auth for outbound sends |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta's numeric ID for the test number (Phase 1) |
| `WHATSAPP_VERIFY_TOKEN` | Shared secret for the GET handshake |
| `WHATSAPP_APP_SECRET` | HMAC key for `X-Hub-Signature-256` verification |
| `WHATSAPP_ESCALATION_TEMPLATE_NAME` | Name of the pre-approved Meta utility template used for Ulises's alert |
| `WHATSAPP_ESCALATION_TOKEN_SECRET` | HMAC key signing the escalation reply page's access token (Plan B, decision 2) |
| `ULISES_WHATSAPP_NUMBER` | Ulises's personal number, escalation alert recipient |
| `ANTHROPIC_API_KEY` | Single Claude adapter auth |
| `CRON_SECRET` | Vercel's standard cron-auth convention — the retention route rejects any request whose `Authorization: Bearer` doesn't match this |

All follow this repo's existing convention (`CLAUDE.md`'s Environment variables section) — required for the webhook to function, absent from `.env.example` only insofar as every other required var already is (i.e., they get added there too, following the pattern already established when `NEXT_PUBLIC_APP_URL` was documented).
