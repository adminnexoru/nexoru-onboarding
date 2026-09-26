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
composeReply(input: {
  kind: "appointment_confirmation" | "appointment_status" | "proposal_answer" | "wizard_redirect" | "unsupported_format";
  fields: Record<string, string>; // e.g. { date, time, reference, joinLink } or { packageName, price, scope }
}): Promise<string> // Mexican Spanish, tone matching docs/legacy/
```

Both calls use the Haiku-class model (research.md, decision 6/7) and route through Anthropic's Messages API via `fetch` (no SDK dependency, matching this repo's existing OpenAI-via-`fetch` convention).

## Outbound sends (`lib/whatsapp/client.ts`)

Two Cloud API calls this feature makes, both authenticated with `WHATSAPP_ACCESS_TOKEN` against `https://graph.facebook.com/v<version>/<WHATSAPP_PHONE_NUMBER_ID>/messages`:

- `sendTextMessage(to, body)` — every reply to a prospect.
- `sendTemplateMessage(to, templateName, params)` — the escalation alert to Ulises's personal number, since a business-initiated message outside the 24h customer service window requires a pre-approved Meta utility template (per the plan's explicit requirement and `docs/respuestas-preguntas-abiertas.md` question 8).

## New environment variables

| Variable | Purpose |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` | Cloud API auth for outbound sends |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta's numeric ID for the test number (Phase 1) |
| `WHATSAPP_VERIFY_TOKEN` | Shared secret for the GET handshake |
| `WHATSAPP_APP_SECRET` | HMAC key for `X-Hub-Signature-256` verification |
| `WHATSAPP_ESCALATION_TEMPLATE_NAME` | Name of the pre-approved Meta utility template used for Ulises's alert |
| `ULISES_WHATSAPP_NUMBER` | Ulises's personal number, escalation alert recipient |
| `ANTHROPIC_API_KEY` | Single Claude adapter auth |

All follow this repo's existing convention (`CLAUDE.md`'s Environment variables section) — required for the webhook to function, absent from `.env.example` only insofar as every other required var already is (i.e., they get added there too, following the pattern already established when `NEXT_PUBLIC_APP_URL` was documented).
