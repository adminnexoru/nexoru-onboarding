---

description: "Task list for the NEXORU WhatsApp Follow-up Agent (Phase 1 — Test Number)"
---

# Tasks: NEXORU WhatsApp Follow-up Agent (Phase 1 — Test Number)

**Input**: Design documents from `/specs/001-whatsapp-followup-agent/` (plan.md, research.md, data-model.md, contracts/whatsapp-webhook.md, quickstart.md, spec.md)

**Organization**: Six delivery phases, each independently demonstrable against the Meta test number, per explicit request — not the generic Setup/Foundational/per-story template shape. Where a phase corresponds to a spec.md user story, tasks are labeled `[US1]`–`[US4]` for traceability; phases that are pure infrastructure or a manual runbook carry no story label, matching the template's own convention for Setup/Foundational/Polish phases.

**Tests**: Included in every phase that has application logic (2–5), per the constitution's requirement that the WhatsApp webhook, the confirmation/scheduling flow, and proposal generation carry test coverage — not deferred to a final phase. Phase 1 (pure schema/infra) and Phase 6 (manual runbook) have no Vitest tasks; there is no application logic in either to unit-test.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 (validate reference & confirm appointment), US2 (escalate), US3 (answer proposal questions), US4 (redirect without valid reference) — from spec.md
- File paths are exact, matching plan.md's Project Structure and contracts/whatsapp-webhook.md

---

## Phase 1: Base — new tables with RLS, Neon role bootstrap, preview environment

**Goal**: The schema this whole feature depends on exists, in both production (Supabase) and preview (Neon), with RLS on from the start — before any webhook code is written.

**Independent Test**: `npx prisma migrate deploy` succeeds against a fresh Neon branch (after the role bootstrap) and against production; a direct query confirms `relrowsecurity = true` on all three new tables in both. No WhatsApp traffic is involved yet — this phase is verified at the database level, exactly as already done once manually for this plan (research.md, decision 4).

- [ ] T001 Add `WhatsAppConversationStage` (`AWAITING_REFERENCE | CONFIRMED | ANSWERING_PROPOSAL | ESCALATED`), `WhatsAppMessageDirection` (`INBOUND | OUTBOUND`), and `WhatsAppEscalationReason` (`HUMAN_REQUESTED | UNABLE_TO_RESOLVE`) enums, and the `WhatsAppConversation`, `WhatsAppMessage`, `WhatsAppEscalation` models, to `prisma/schema.prisma` — field-for-field per data-model.md: `WhatsAppConversation.phoneNumber String @unique`, `meetingId String?` (optional FK to `OnboardingMeeting.id`, **no cascade**), `stage WhatsAppConversationStage`, `bufferedText String?`, `bufferVersion Int @default(0)`, `consecutiveFailedAttempts Int @default(0)`, `lastActivityAt DateTime @updatedAt`, `createdAt DateTime @default(now())`; `WhatsAppMessage.conversationId String` (FK `onDelete: Cascade`), `direction WhatsAppMessageDirection`, `whatsappMessageId String @unique`, `bodyText String`, `createdAt`; `WhatsAppEscalation.conversationId String` (FK `onDelete: Cascade`), `reason WhatsAppEscalationReason`, `occurredDuringBusinessHours Boolean`, `whatsappAlertSentAt DateTime?`, `emailSentAt DateTime?`, `rateLimited Boolean @default(false)`, `createdAt`.
- [ ] T002 Generate the migration `prisma/migrations/<timestamp>_add_whatsapp_conversation/migration.sql` from T001's schema changes (`npx prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script` against a local shadow DB, per the pattern already used for the two most recent migrations in this repo), then hand-append `ALTER TABLE "WhatsAppConversation" ENABLE ROW LEVEL SECURITY;`, `ALTER TABLE "WhatsAppMessage" ENABLE ROW LEVEL SECURITY;`, `ALTER TABLE "WhatsAppEscalation" ENABLE ROW LEVEL SECURITY;` — non-negotiable per constitution Principle V and the `CLAUDE.md` rule it added.
- [ ] T003 [P] Create `prisma/bootstrap-non-supabase-roles.sql` with the idempotent role-bootstrap block from research.md decision 4 (conditionally `CREATE ROLE postgres|anon|authenticated|service_role NOLOGIN` only if each doesn't already exist).
- [ ] T004 [P] Add a short note to `CLAUDE.md`'s "Database (Prisma, Postgres)" commands section: `prisma/bootstrap-non-supabase-roles.sql` MUST run once against any new non-Supabase database (e.g. a fresh Neon branch) before `prisma migrate deploy` — not needed against the existing Supabase project, which already has these roles.
- [ ] T005 Provision a Neon Postgres project and connect it via the Vercel Marketplace integration with branch-per-preview enabled (research.md, decision 4) — manual/dashboard step, not code.
- [ ] T006 Configure the Vercel project's Preview-environment `DATABASE_URL`/`DIRECT_URL` to point at the Neon integration's connection strings, scoped to Preview only — Production keeps pointing at the existing Supabase project, following the same environment-scoping pattern already used for `NEXT_PUBLIC_APP_URL`.
- [ ] T007 Run T003's bootstrap script against a fresh Neon preview branch, then `npx prisma migrate deploy`, and confirm via `prisma migrate status` ("Database schema is up to date!") and a direct query that all tables — including the three new ones — have `relrowsecurity = true`.
- [ ] T008 [P] Add the new environment variables from contracts/whatsapp-webhook.md to `.env.example`: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ESCALATION_TEMPLATE_NAME`, `ULISES_WHATSAPP_NUMBER`, `ANTHROPIC_API_KEY`, `WHATSAPP_ESCALATION_TOKEN_SECRET` — each with a one-line comment matching the "Purpose" column in that contract's table.

**Checkpoint**: Schema, RLS, and both database environments exist and are verified. No webhook code yet.

---

## Phase 2: Webhook — verification, signature, idempotency, immediate 200

**Goal**: The Meta Cloud API webhook exists, passes Meta's own verification handshake, rejects unsigned/mis-signed requests, never double-processes a retried delivery, and acknowledges every valid request immediately — before this phase adds any conversational behavior.

**Independent Test**: Against the Meta test number: (a) the webhook URL verifies successfully when configured in Meta's dashboard (GET handshake); (b) sending a message with a tampered signature is rejected with `401` and never reaches the database; (c) resending the identical webhook payload (same `messages[].id`) does not create a second `WhatsAppMessage` row; (d) sending an image/voice note/document gets the "unsupported format" reply (FR-016) — the one concrete reply this phase can produce on its own, since reference/proposal logic doesn't exist until Phases 3–4; (e) sending a plain text message gets an immediate `200` with no visible reply yet (expected — Phase 3 adds the reply).

### Tests for Phase 2 ⚠️

> Write these first; confirm they fail before implementing the handler.

- [ ] T009 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: GET request with matching `hub.verify_token` echoes `hub.challenge` with `200`; mismatched token returns `403`.
- [ ] T010 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: POST with a missing/invalid `X-Hub-Signature-256` returns `401` and makes no Prisma calls (mock `@/lib/prisma` and assert it was never invoked).
- [ ] T011 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: POST twice with the same `messages[].id` — assert exactly one `WhatsAppMessage` row is created (mock Prisma's unique-constraint conflict on the second call, matching the pattern in `app/api/onboarding/package-recommendation/route.test.ts`).
- [ ] T012 [P] Test in `lib/whatsapp/signature.test.ts`: a known body + secret produces the expected HMAC-SHA256 hex digest; a wrong secret fails verification.
- [ ] T013 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: a non-text message type (e.g. `image`) results in a call to `sendTextMessage` with the "unsupported format" copy, and never calls the AI adapter.

### Implementation for Phase 2

- [ ] T014 [P] Implement `lib/whatsapp/signature.ts`: `verifySignature(rawBody: string, signatureHeader: string, appSecret: string): boolean`, HMAC-SHA256 via `node:crypto`, comparing against the `sha256=<hex>` header format.
- [ ] T015 [P] Implement `lib/whatsapp/client.ts`: `sendTextMessage(to: string, body: string)` and `sendTemplateMessage(to: string, templateName: string, params: string[])`, both POSTing to `https://graph.facebook.com/v<version>/${WHATSAPP_PHONE_NUMBER_ID}/messages` with `Authorization: Bearer ${WHATSAPP_ACCESS_TOKEN}` (stub `sendTemplateMessage`'s actual use for Phase 5; the function itself belongs here since it's shared client code).
- [ ] T016 Implement `app/api/whatsapp/webhook/route.ts` GET handler per contracts/whatsapp-webhook.md: compare `hub.verify_token` to `process.env.WHATSAPP_VERIFY_TOKEN`, respond with `hub.challenge` (`200`, `text/plain`) or `403`.
- [ ] T017 Implement `app/api/whatsapp/webhook/route.ts` POST handler, steps 1–5 from contracts/whatsapp-webhook.md: verify signature (T014) before parsing the body for anything else (`401` on failure); for each `messages[]` entry, idempotency-insert on `whatsappMessageId` (skip if it already exists); for non-text types, compose and send the unsupported-format reply immediately; for text types, append to `WhatsAppConversation.bufferedText` and increment `bufferVersion` (creating the conversation row if it doesn't exist yet, `stage: AWAITING_REFERENCE`); respond `200`.
- [ ] T018 Add the `after()` (`next/server`) debounce hook from research.md decision 5 to the POST handler: after responding, wait ~2–3s, re-read `bufferVersion`; if unchanged, proceed to Phase 3/4's reply logic (stubbed as a no-op passthrough in this phase, since that logic doesn't exist until the next phases — just log the resolved buffered text for now so Phase 3 has a integration point to replace).
- [ ] T019 Wire `lib/whatsapp/client.ts`'s `sendTextMessage` into the unsupported-format branch of T017 with the copy from spec FR-016 ("no puedo procesar ese tipo de mensaje..." — Mexican Spanish, matching the tone in `docs/legacy/`).

**Checkpoint**: The webhook is live, secure, idempotent, and fast-acking on the test number. Text messages are received and buffered but not yet answered — Phase 3 adds that.

---

## Phase 3: Reference confirmation — replaces "Busca Agenda" / "Confirma Agenda" (US1, US4)

**Goal**: A prospect messaging with a valid, phone-matched reference gets their appointment confirmed in the established tone; anyone without one gets redirected to the wizard — the direct replacement for the two ManyChat automations audited in `docs/analisis-solucion-actual.md`.

**Independent Test**: quickstart.md Scenarios 1, 2, 5 — a real wizard-booked reference gets a correct confirmation reply; a mismatched phone number gets neither confirmation nor proposal details; a missing/unmatched reference gets the wizard link, never a qualifying question.

### Tests for Phase 3 (US1, US4) ⚠️

- [ ] T020 [P] [US1] Test in `lib/whatsapp/reference.test.ts`: extracts `NXR-SES-260924-A1B2`-shaped references from realistic message text (including the exact wizard-generated copy "Hola Nexoru, ya agendé mi sesión. Mi referencia es NXR-SES-260924-A1B2."), and returns `null` for text with no matching pattern.
- [ ] T021 [P] [US1] Test in `lib/whatsapp/reference.test.ts`: phone-match comparison normalizes both sides to digits-only before comparing (matching the existing `wa.me` link's `cleanNumber` convention) and correctly flags a mismatch.
- [ ] T022 [P] [US1] Test in `app/api/whatsapp/webhook/route.test.ts` (or a dedicated `lib/services/whatsapp-conversation.test.ts`): a message with a reference matching a `SCHEDULED` `OnboardingMeeting` and a matching phone number produces a confirmation reply containing the date, time, reference, and joining link.
- [ ] T023 [P] [US1] Test: a reference matching a `CANCELLED`/`COMPLETED` meeting produces a status reply, not a confirmation as if it were upcoming (spec Acceptance Scenario US1.3).
- [ ] T024 [P] [US4] Test: a message with no reference, and separately one with a reference matching nothing, both produce the wizard-link reply — never a qualifying question.
- [ ] T025 [P] [US1] Test: a phone mismatch increments `consecutiveFailedAttempts` and sends neither a confirmation nor any appointment/proposal detail (FR-023) — the reply, if any, must not leak data.

### Implementation for Phase 3 (US1, US4)

- [ ] T026 [P] [US1] Implement `lib/whatsapp/reference.ts`: `extractReference(text: string): string | null` (regex `NXR-SES-\d{6}-[A-Z0-9]{4}`, matching `lib/services/onboarding-meeting.ts`'s generated format exactly) and `phoneMatches(inbound: string, onFile: string): boolean` (digits-only normalization on both sides).
- [ ] T027 [US1] Implement `lib/services/whatsapp-conversation.ts`'s reference-resolution step: given the buffered text, call `extractReference`; if found, look up `OnboardingMeeting` by `meetingReference` (include `contactWhatsappSnapshot`, `status`, `scheduledAt`, `scheduledEndAt`, `timezone`, `googleMeetLink`); if the reference doesn't resolve, route to the wizard-redirect reply (US4, T029); if it resolves, call `phoneMatches` against the inbound sender — on mismatch, increment `consecutiveFailedAttempts` and produce no confirmation/proposal reply (this becomes an escalation trigger once the threshold is reached, wired in Phase 5).
- [ ] T028 [US1] On a resolved, phone-matched reference: set `WhatsAppConversation.meetingId` and `stage: CONFIRMED`, then call `lib/ai/adapter.ts`'s `composeReply({ kind: session.status === "SCHEDULED" ? "appointment_confirmation" : "appointment_status", fields: { date, time, reference, joinLink } })` and send it via `sendTextMessage` (T015).
- [ ] T029 [US4] Implement the wizard-redirect branch: `composeReply({ kind: "wizard_redirect", fields: { wizardUrl: appUrl("/onboarding/start") } })` (reusing `lib/config/urls.ts`'s `appUrl`, already in this repo) and send via `sendTextMessage` — never falls through to any qualifying question.
- [ ] T030 [US1] Implement `lib/ai/adapter.ts`'s `composeReply` function: single Claude (Haiku) call via `fetch` to the Messages API (no SDK — matching `lib/services/package-recommendation.ts`'s existing pattern), receiving only the `kind` + `fields` already fetched from the database (contracts/whatsapp-webhook.md) — never given raw DB access or asked to look anything up.
- [ ] T031 Replace Phase 2's T018 stub with a call into T027's reference-resolution flow, so the `after()` debounce callback now produces a real reply instead of just logging.

**Checkpoint**: The core cost-driving replacement (US1 + US4) is live and independently demonstrable end-to-end on the test number, using a real wizard-booked reference.

---

## Phase 4: Claude-powered proposal Q&A (US3)

**Goal**: A prospect with a confirmed reference can ask about their own proposal and get an answer grounded strictly in their stored session data — never a generic or invented answer.

**Independent Test**: quickstart.md Scenario 3 — a question the proposal data answers gets a correct, data-grounded reply; a general/ungroundable question does not get a generic answer (it becomes a stuck point, wired to escalation in Phase 5).

### Tests for Phase 4 (US3) ⚠️

- [ ] T032 [P] [US3] Test in `lib/ai/adapter.test.ts`: `classifyIntent` returns `"ask_about_proposal"` for a proposal-related question and `"unclear"` for an off-topic/general one (mock the Claude `fetch` call).
- [ ] T033 [P] [US3] Test in `lib/services/whatsapp-conversation.test.ts`: a proposal question from a `CONFIRMED` conversation with an existing `OnboardingPackageRecommendation` produces a reply built only from that record's `packageName`/`setupPrice`/`monthlyPrice`/`rationale` fields (assert the composed fields passed to `composeReply` match the DB row exactly).
- [ ] T034 [P] [US3] Test: a question that isn't grounded in stored data (including a general/policy question, per the clarification session) does **not** call `composeReply` with a generic answer — it increments `consecutiveFailedAttempts` instead (FR-009, FR-011).

### Implementation for Phase 4 (US3)

- [ ] T035 [US3] Implement `lib/ai/adapter.ts`'s `classifyIntent({ messageText }): Promise<"ask_about_proposal" | "request_human" | "unclear">` — single Claude (Haiku) call, schema-constrained enum output, only invoked once a conversation is past `AWAITING_REFERENCE` (contracts/whatsapp-webhook.md).
- [ ] T036 [US3] Extend `lib/services/whatsapp-conversation.ts`: for a `CONFIRMED`/`ANSWERING_PROPOSAL` conversation's message that isn't itself a new reference, call `classifyIntent`; on `ask_about_proposal`, join `OnboardingMeeting.sessionId → OnboardingSession.packageRecommendation` (the existing `OnboardingPackageRecommendation` row — read-only, per data-model.md's "Referenced Proposal") and call `composeReply({ kind: "proposal_answer", fields: {...} })`; set `stage: ANSWERING_PROPOSAL`.
- [ ] T037 [US3] On `classifyIntent` returning `"unclear"` for a proposal-context message (i.e., not groundable): increment `consecutiveFailedAttempts`, send no reply claiming an answer (this feeds Phase 5's escalation threshold — no escalation logic exists yet in this phase, just the counter).

**Checkpoint**: US1, US3, US4 all independently demonstrable. Escalation (US2) is the only story left before the full spec is covered.

---

## Phase 5: Escalation, rate-limited alerts, and the Plan B reply page (US2)

**Goal**: Explicit human requests and accumulated stuck points (from Phases 3–4's counters) escalate reliably to Ulises without spamming him, with a business-hours-aware prospect notice, and — regardless of Meta coexistence eligibility — a way for Ulises to actually reply.

**Independent Test**: quickstart.md Scenario 4 — explicit "quiero hablar con alguien" and the 2-attempt threshold both escalate; Ulises gets the WhatsApp alert + email; a second escalation for the same number within an hour is recorded but doesn't re-alert; outside 10:00–15:00 the prospect gets a "when to expect a reply" notice; the reply page lets Ulises send a message through the same number.

> **Two constraints that apply specifically to this phase, not caught anywhere else in the plan — call them out explicitly in the relevant tasks below, don't leave them implicit:**
> 1. **WhatsApp's 24-hour customer-service window** applies to *every* business-initiated free-form text in this feature, including Ulises's replies sent through the Plan B page (T048) — if the prospect's last inbound message is more than 24h old, Meta will reject a free-form `sendTextMessage` and only a pre-approved template can reach them. The reply page MUST check this and tell Ulises, not just let the send silently fail.
> 2. **The Plan B reply page's signed link has its own, separate expiry** (48 hours from generation, chosen to comfortably outlast the 24h WhatsApp window without being open-ended) — an expired or tampered token must show a clear error, not a broken page.

### Tests for Phase 5 (US2) ⚠️

- [ ] T038 [P] [US2] Test in `lib/whatsapp/business-hours.test.ts`: returns `true` for times inside 10:00–15:00 `America/Mexico_City` and `false` outside, across a DST-adjacent date if applicable.
- [ ] T039 [P] [US2] Test in `lib/services/whatsapp-conversation.test.ts`: an explicit "quiero hablar con alguien"-classified message escalates immediately regardless of `consecutiveFailedAttempts`.
- [ ] T040 [P] [US2] Test: `consecutiveFailedAttempts` reaching 2 escalates (FR-011), and resets to 0 on any successful confirm/answer before then.
- [ ] T041 [P] [US2] Test: escalating creates a `WhatsAppEscalation` row, sets `WhatsAppConversation.stage = ESCALATED`, and a subsequent inbound message from that same number produces **no** automated reply at all.
- [ ] T042 [P] [US2] Test: when `WHATSAPP_ESCALATION_TEMPLATE_NAME` send fails (mocked failure), `emailSentAt` is still set and the escalation still counts as delivered (SC-005) — `whatsappAlertSentAt` stays null.
- [ ] T043 [P] [US2] Test: a second escalation trigger for the same phone number within 1 hour of the first sets `rateLimited: true` and does not call `sendTemplateMessage` or the email sender again, while still creating the `WhatsAppEscalation` row and keeping `stage: ESCALATED`.
- [ ] T044 [P] [US2] Test: an escalation outside 10:00–15:00 sends the prospect an additional "when you'll be contacted" message; one inside the window does not (spec Acceptance Scenarios US2.3/US2.4).
- [ ] T045 [P] [US2] Test in `app/whatsapp/escalations/[conversationId]/reply/page.test.ts` (or the token helper's own test file): a validly-signed, non-expired token grants access; an expired (>48h) or tampered token is rejected with a clear error, not a crash.
- [ ] T046 [P] [US2] Test: submitting a reply on the Plan B page when the prospect's last inbound message is >24h old is blocked with an explicit "outside the 24-hour window, this can't be sent as a free-form message" error, and `sendTextMessage` is never called in that case.

### Implementation for Phase 5 (US2)

- [ ] T047 [P] [US2] Implement `lib/whatsapp/business-hours.ts`: `isWithinBusinessHours(date: Date): boolean` against 10:00–15:00 in `America/Mexico_City` (matching `GOOGLE_MEETING_DEFAULT_TIMEZONE`'s existing timezone convention in this repo).
- [ ] T048 [US2] Implement the escalation trigger in `lib/services/whatsapp-conversation.ts`: on an explicit human request (from `classifyIntent`) or `consecutiveFailedAttempts >= 2`, create a `WhatsAppEscalation` row (`reason`, `occurredDuringBusinessHours` via T047) in the same transaction that sets `WhatsAppConversation.stage = ESCALATED`.
- [ ] T049 [US2] Before sending alerts, query `WhatsAppEscalation` for that conversation's phone number for any row with `createdAt > now() - interval '1 hour'`; if found, set the new row's `rateLimited: true` and skip T050–T051; otherwise proceed to send.
- [ ] T050 [US2] Send the escalation alert: `sendTemplateMessage(ULISES_WHATSAPP_NUMBER, WHATSAPP_ESCALATION_TEMPLATE_NAME, [prospect summary fields])` (T015) — set `whatsappAlertSentAt` only on confirmed success; a failure here must not block T051.
- [ ] T051 [US2] Send the escalation email to `admin@nexoru.ai` with the prospect/conversation summary — set `emailSentAt` on confirmed send; this is the field SC-005 checks, independent of T050's outcome.
- [ ] T052 [US2] If `!occurredDuringBusinessHours` (T047), send the prospect a reply stating when they'll be contacted (next 10:00 `America/Mexico_City`) via `composeReply({ kind: "escalation_out_of_hours", fields: { nextWindowStart } })` + `sendTextMessage`.
- [ ] T053 [P] [US2] Implement the signed-token helper (e.g. `lib/whatsapp/escalation-token.ts`): `signEscalationToken(conversationId): string` (HMAC over `conversationId` + a 48-hour expiry timestamp, keyed by `WHATSAPP_ESCALATION_TOKEN_SECRET`) and `verifyEscalationToken(token): { conversationId: string } | null` (returns `null` on bad signature *or* expiry — both are just "invalid", not distinguished to the caller).
- [ ] T054 [US2] Include the signed link (`/whatsapp/escalations/[conversationId]/reply?token=...`) in T051's escalation email body.
- [ ] T055 [US2] Implement `app/whatsapp/escalations/[conversationId]/reply/page.tsx`: verify the token (T053) server-side, show recent `WhatsAppMessage` rows for context, and a form to send a reply.
- [ ] T056 [US2] Implement the reply page's submit handler: check whether the conversation's most recent **inbound** `WhatsAppMessage.createdAt` is within the last 24 hours; if not, block the send and show the 24-hour-window error explicitly (do not attempt `sendTextMessage`); if within the window, call `sendTextMessage(conversation.phoneNumber, body)` and insert a `WhatsAppMessage` row (`direction: OUTBOUND`) — this never changes `stage` away from `ESCALATED` and never re-enables automated replies.

**Checkpoint**: All four user stories (US1–US4) are independently demonstrable on the test number, end to end, matching the full spec.

---

## Phase 6: Cutover & retirement runbook (manual, approval-gated — nothing here executes automatically)

**Not a code phase.** Every item below is a checklist step from research.md decisions 1 and 8, to be carried out manually against the **production** number and the ManyChat/Zapier subscriptions once Phases 1–5 have proven themselves on the test number. Per explicit instruction: **each step requires your explicit go-ahead before it is carried out — nothing in this phase is ever executed as a side effect of finishing Phase 5, and no step here should be automated into a script that runs unattended.**

- [ ] T057 **[APPROVAL REQUIRED]** Confirm Phases 1–5 have run against the Meta test number for an agreed burn-in period with no unresolved defects.
- [ ] T058 **[APPROVAL REQUIRED]** In Meta Business Suite, check whether the production WABA is offered Business-app + Cloud-API coexistence (research.md, decision 2) — determines whether the Phase 5 reply page remains the primary path post-cutover or becomes a fallback.
- [ ] T059 **[APPROVAL REQUIRED]** Agree the cutover date/time, inside the 10:00–15:00 window with Ulises available.
- [ ] T060 **[APPROVAL REQUIRED]** Disconnect `+52 55 8648 8746` from ManyChat's app connection in Meta Business Suite.
- [ ] T061 **[APPROVAL REQUIRED]** Register the production number under NEXORU's own Meta app; update `WHATSAPP_PHONE_NUMBER_ID` (and related secrets) in the Production Vercel environment.
- [ ] T062 **[APPROVAL REQUIRED]** Send a manual test message to the production number and confirm the new webhook handles it correctly before declaring the cutover complete.
- [ ] T063 **[APPROVAL REQUIRED]** Begin the post-cutover burn-in period (2–4 weeks), monitoring 100% of real production traffic on the new webhook.
- [ ] T064 **[APPROVAL REQUIRED]** After burn-in with no unresolved incidents, pause (do not delete) the Zapier zap.
- [ ] T065 **[APPROVAL REQUIRED]** After a short monitoring period post-pause with no missed confirmations, downgrade/cancel the Zapier plan (timed to the renewal date where possible).
- [ ] T066 **[APPROVAL REQUIRED]** Export/archive the ManyChat flow structure and Zapier zap steps for institutional memory (beyond the `docs/legacy/` screenshots already captured).
- [ ] T067 **[APPROVAL REQUIRED]** Cancel the ManyChat subscription (timed to the renewal date where possible).
- [ ] T068 **[APPROVAL REQUIRED]** Final sign-off: document that reverting past this point requires a fresh cutover back to ManyChat, not an instant rollback.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Base)**: No dependencies — start immediately.
- **Phase 2 (Webhook)**: Depends on Phase 1 (needs the `WhatsAppConversation`/`WhatsAppMessage` tables to buffer/dedupe against). Blocks Phases 3–5.
- **Phase 3 (US1/US4)**: Depends on Phase 2 (needs the webhook's buffering/debounce plumbing to hang its reply logic off of).
- **Phase 4 (US3)**: Depends on Phase 3 (a conversation must already be `CONFIRMED` before proposal Q&A makes sense) — not independent of Phase 3 the way US1/US2/US3/US4 are independent of each other in the spec, because this phase grouping is by delivery slice, not pure story isolation.
- **Phase 5 (US2)**: Depends on Phases 3 and 4 (escalates on their `consecutiveFailedAttempts` counters and on the explicit-human-request classification introduced in Phase 4's `classifyIntent`).
- **Phase 6 (Runbook)**: Depends on Phase 5 being complete and burned in — and every step within it gates on your explicit approval, not on the previous step's mere completion.

### Parallel Opportunities

- Within Phase 1: T003, T004, T008 are independent of each other and of T001–T002/T005–T007.
- Within Phase 2: all test tasks (T009–T013) are parallel to each other; T014–T015 (implementation) are parallel to each other.
- Within Phase 3: T020–T025 (tests) are parallel; T026 is parallel to nothing else in that phase (T027–T031 depend on it).
- Within Phase 4: T032–T034 (tests) are parallel.
- Within Phase 5: T038–T046 (tests) are largely parallel (different files); T053 is parallel to T047–T052.
- Phase 6 tasks are strictly sequential (each is a real-world action gating the next) — no parallelism, by design.

---

## Implementation Strategy

### MVP

Phases 1–3 constitute the smallest deployable, demonstrable increment: the schema exists, the webhook is secure and idempotent, and a real prospect can get their appointment confirmed by referencing a wizard-booked meeting — the single highest-value replacement for ManyChat/Zapier's cost. Stop and validate against the test number here before continuing.

### Incremental Delivery

1. Phase 1 → verify at the database level (no WhatsApp traffic yet).
2. Phase 2 → verify signature/idempotency/unsupported-format behavior on the test number.
3. Phase 3 → **MVP** — verify full reference-confirmation flow end to end.
4. Phase 4 → verify proposal Q&A on top of an already-confirmed conversation.
5. Phase 5 → verify escalation, rate-limiting, and the reply page — this is the last phase needed for the spec to be fully satisfied on the test number.
6. Phase 6 → only after 1–5 have proven themselves, and only ever one manually-approved step at a time.
