---

description: "Task list for the NEXORU WhatsApp Follow-up Agent (Phase 1 — Test Number)"
---

# Tasks: NEXORU WhatsApp Follow-up Agent (Phase 1 — Test Number)

**Input**: Design documents from `/specs/001-whatsapp-followup-agent/` (plan.md, research.md, data-model.md, contracts/whatsapp-webhook.md, quickstart.md, spec.md)

**Organization**: Six delivery phases, each independently demonstrable against the Meta test number, per explicit request — not the generic Setup/Foundational/per-story template shape. Where a phase corresponds to a spec.md user story, tasks are labeled `[US1]`–`[US4]` for traceability; phases that are pure infrastructure or a manual runbook carry no story label, matching the template's own convention for Setup/Foundational/Polish phases.

**Tests**: Included in every phase that has application logic (1–5), per the constitution's requirement that the WhatsApp webhook, the confirmation/scheduling flow, and proposal generation carry test coverage — not deferred to a final phase. Phase 1 now includes two small pieces of application logic (phone masking, retention) alongside its schema work, so it has a Tests subsection too, unlike the original cut of this plan. Phase 6 (manual runbook) has no Vitest tasks — no code exists there to unit-test.

**Updated after `/speckit-analyze`**: this revision fixes every finding from that pass — two CRITICAL (phone masking had no task despite being designed; Claude token/cost logging had no task or field at all), one HIGH (prompt caching addressed with a sourced decision, not silence), two more HIGH coverage gaps (burst-debounce race condition untested; 90-day retention had no task and no Success Criterion), two MEDIUM coverage gaps (SC-001 timing untested; resuming an already-`CONFIRMED` conversation without re-asking for a reference was underspecified — Phase 3's reference-resolution logic actually had a latent bug here, not just a missing test), plus the smaller inconsistencies (a dangling `research.md` citation, two `composeReply` `kind` values contracts.md didn't document, an ambiguous test target, a stale doc reference). See the diff shown alongside this revision for exactly what changed.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1 (validate reference & confirm appointment), US2 (escalate), US3 (answer proposal questions), US4 (redirect without valid reference) — from spec.md
- File paths are exact, matching plan.md's Project Structure and contracts/whatsapp-webhook.md

---

## Phase 1: Base — new tables with RLS, Neon role bootstrap, preview environment, masking, retention

**Goal**: The schema this whole feature depends on exists, in both production (Supabase) and preview (Neon), with RLS on from the start; the two constitution-mandated cross-cutting pieces (phone masking, 90-day retention) exist before any webhook code is written, not bolted on later.

**Independent Test**: `npx prisma migrate deploy` succeeds against a fresh Neon branch (after the role bootstrap) and against production; a direct query confirms `relrowsecurity = true` on all four new tables in both. `mask-phone` and the retention route are verified by their own unit tests below. No WhatsApp traffic is involved yet.

- [ ] T001 Add `WhatsAppConversationStage` (`AWAITING_REFERENCE | CONFIRMED | ANSWERING_PROPOSAL | ESCALATED`), `WhatsAppMessageDirection` (`INBOUND | OUTBOUND`), `WhatsAppEscalationReason` (`HUMAN_REQUESTED | UNABLE_TO_RESOLVE`), and `WhatsAppAiCallKind` (`CLASSIFY_INTENT | COMPOSE_REPLY`) enums, and the `WhatsAppConversation`, `WhatsAppMessage`, `WhatsAppEscalation`, `WhatsAppAiCall` models, to `prisma/schema.prisma` — field-for-field per data-model.md: `WhatsAppConversation.phoneNumber String @unique`, `meetingId String?` (optional FK to `OnboardingMeeting.id`, **no cascade**), `stage WhatsAppConversationStage`, `bufferedText String?`, `bufferVersion Int @default(0)`, `consecutiveFailedAttempts Int @default(0)`, `lastActivityAt DateTime @updatedAt`, `createdAt DateTime @default(now())`; `WhatsAppMessage.conversationId String` (FK `onDelete: Cascade`), `direction WhatsAppMessageDirection`, `whatsappMessageId String @unique`, `bodyText String`, `createdAt`; `WhatsAppEscalation.conversationId String` (FK `onDelete: Cascade`), `reason WhatsAppEscalationReason`, `occurredDuringBusinessHours Boolean`, `whatsappAlertSentAt DateTime?`, `emailSentAt DateTime?`, `rateLimited Boolean @default(false)`, `createdAt`; `WhatsAppAiCall.conversationId String?` (optional FK, **no cascade** — data-model.md's Retention scope section explains why), `kind WhatsAppAiCallKind`, `model String`, `inputTokens Int`, `outputTokens Int`, `estimatedCostUsd Decimal @db.Decimal(10, 6)`, `createdAt`.
- [ ] T002 Generate the migration `prisma/migrations/<timestamp>_add_whatsapp_conversation/migration.sql` from T001's schema changes (`npx prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script` against a local shadow DB, per the pattern already used for the two most recent migrations in this repo), then hand-append `ALTER TABLE "WhatsAppConversation" ENABLE ROW LEVEL SECURITY;`, `ALTER TABLE "WhatsAppMessage" ENABLE ROW LEVEL SECURITY;`, `ALTER TABLE "WhatsAppEscalation" ENABLE ROW LEVEL SECURITY;`, `ALTER TABLE "WhatsAppAiCall" ENABLE ROW LEVEL SECURITY;` — non-negotiable per constitution Principle V and the `CLAUDE.md` rule it added, applying to all four tables including `WhatsAppAiCall` even though it holds no personal data (the rule is per-table).
- [ ] T003 [P] Create `prisma/bootstrap-non-supabase-roles.sql` with the idempotent role-bootstrap block from research.md decision 4 (conditionally `CREATE ROLE postgres|anon|authenticated|service_role NOLOGIN` only if each doesn't already exist).
- [ ] T004 [P] Add a short note to `CLAUDE.md`'s "Database (Prisma, Postgres)" commands section: `prisma/bootstrap-non-supabase-roles.sql` MUST run once against any new non-Supabase database (e.g. a fresh Neon branch) before `prisma migrate deploy` — not needed against the existing Supabase project, which already has these roles.
- [ ] T005 Provision a Neon Postgres project and connect it via the Vercel Marketplace integration with branch-per-preview enabled (research.md, decision 4) — manual/dashboard step, not code.
- [ ] T006 Configure the Vercel project's Preview-environment `DATABASE_URL`/`DIRECT_URL` to point at the Neon integration's connection strings, scoped to Preview only — Production keeps pointing at the existing Supabase project, following the same environment-scoping pattern already used for `NEXT_PUBLIC_APP_URL`.
- [ ] T007 Run T003's bootstrap script against a fresh Neon preview branch, then `npx prisma migrate deploy`, and confirm via `prisma migrate status` ("Database schema is up to date!") and a direct query that all tables — including the four new ones — have `relrowsecurity = true`.
- [ ] T008 [P] Add the new environment variables from contracts/whatsapp-webhook.md to `.env.example`: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ESCALATION_TEMPLATE_NAME`, `ULISES_WHATSAPP_NUMBER`, `ANTHROPIC_API_KEY`, `WHATSAPP_ESCALATION_TOKEN_SECRET`, `CRON_SECRET` — each with a one-line comment matching the "Purpose" column in that contract's table.

### Tests for Phase 1 ⚠️

> Write these first; confirm they fail before implementing T011–T013.

- [ ] T009 [P] Test in `lib/whatsapp/mask-phone.test.ts`: a full phone number is masked to show only its last 4 digits (e.g. `5215512345678` → `***5678`); a too-short input is masked entirely rather than throwing.
- [ ] T010 [P] Test in `app/api/whatsapp/retention/route.test.ts`: a request without a matching `CRON_SECRET` bearer token is rejected (`401`); a `WhatsAppConversation` with `lastActivityAt` >90 days old is deleted along with its `WhatsAppMessage`/`WhatsAppEscalation` rows (mock the cascade or assert the single delete call, matching this repo's Prisma-mocking pattern); a conversation <90 days old is untouched; **no call is ever made to any `OnboardingSession`-related Prisma model** (assert the mock); a `WhatsAppAiCall` row tied to a deleted conversation is **not** deleted (data-model.md's Retention scope section).

### Implementation for Phase 1

- [ ] T011 [P] Implement `lib/whatsapp/mask-phone.ts`: `maskPhone(phone: string): string`, showing only the last 4 characters, matching data-model.md's Privacy handling section (FR-024).
- [ ] T012 Add a Cron entry to `vercel.json` for `app/api/whatsapp/retention/route.ts` (e.g. daily), per constitution Principle III — automation MUST be in-repo code managed under Spec Kit, not a third-party scheduler.
- [ ] T013 Implement `app/api/whatsapp/retention/route.ts` per contracts/whatsapp-webhook.md's Retention cron contract: verify the `Authorization: Bearer ${CRON_SECRET}` header; delete every `WhatsAppConversation` with `lastActivityAt` older than 90 days (FR-022) — scoped to exactly `WhatsAppConversation`/`WhatsAppMessage`/`WhatsAppEscalation` via cascade, never touching any wizard table and never touching `WhatsAppAiCall`.

**Checkpoint**: Schema, RLS, both database environments, phone masking, and the retention job all exist and are verified. No webhook code yet.

---

## Phase 2: Webhook — verification, signature, idempotency, immediate 200

**Goal**: The Meta Cloud API webhook exists, passes Meta's own verification handshake, rejects unsigned/mis-signed requests, never double-processes a retried delivery, never leaks a raw phone number into logs, correctly resolves bursts to exactly one reply even under concurrent invocations, and acknowledges every valid request immediately — before this phase adds any conversational behavior.

**Independent Test**: Against the Meta test number: (a) the webhook URL verifies successfully when configured in Meta's dashboard (GET handshake); (b) sending a message with a tampered signature is rejected with `401` and never reaches the database; (c) resending the identical webhook payload (same `messages[].id`) does not create a second `WhatsAppMessage` row; (d) sending an image/voice note/document gets the "unsupported format" reply (FR-016) — the one concrete reply this phase can produce on its own, since reference/proposal logic doesn't exist until Phases 3–4; (e) sending a plain text message gets an immediate `200` with no visible reply yet (expected — Phase 3 adds the reply); (f) sending three messages within ~2 seconds of each other produces exactly one debounce-triggered pass, never two.

### Tests for Phase 2 ⚠️

> Write these first; confirm they fail before implementing the handler.

- [ ] T014 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: GET request with matching `hub.verify_token` echoes `hub.challenge` with `200`; mismatched token returns `403`.
- [ ] T015 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: POST with a missing/invalid `X-Hub-Signature-256` returns `401` and makes no Prisma calls (mock `@/lib/prisma` and assert it was never invoked).
- [ ] T016 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: POST twice with the same `messages[].id` — assert exactly one `WhatsAppMessage` row is created (mock Prisma's unique-constraint conflict on the second call, matching the pattern in `app/api/onboarding/package-recommendation/route.test.ts`).
- [ ] T017 [P] Test in `lib/whatsapp/signature.test.ts`: a known body + secret produces the expected HMAC-SHA256 hex digest; a wrong secret fails verification.
- [ ] T018 [P] Test in `app/api/whatsapp/webhook/route.test.ts`: a non-text message type (e.g. `image`) results in a call to `sendTextMessage` with the "unsupported format" copy, and never calls the AI adapter.
- [ ] T019 [P] Test in `lib/services/whatsapp-conversation.test.ts` (the burst-debounce claim, in isolation from the HTTP layer): given two overlapping "claim the buffer" calls for the same conversation where the second increments `bufferVersion` after the first has already read it, assert the first call's post-wait re-read detects the mismatch and exits without producing a reply, while the second (matching the current version) proceeds — this is research.md's own "correctness-critical part," so it gets a dedicated concurrency test, not just an implementation task.
- [ ] T020 [P] Test in `app/api/whatsapp/webhook/route.test.ts` (fake timers): the POST handler's response is sent before the debounce wait elapses (assert the response resolves while `after()`'s callback is still pending), and — advancing fake timers — the full debounce-to-reply path completes well inside the 10-second budget (SC-001), giving this SLA an actual assertion instead of only an implementation.

### Implementation for Phase 2

- [ ] T021 [P] Implement `lib/whatsapp/signature.ts`: `verifySignature(rawBody: string, signatureHeader: string, appSecret: string): boolean`, HMAC-SHA256 via `node:crypto`, comparing against the `sha256=<hex>` header format.
- [ ] T022 [P] Implement `lib/whatsapp/client.ts`: `sendTextMessage(to: string, body: string)` and `sendTemplateMessage(to: string, templateName: string, params: string[])`, both POSTing to `https://graph.facebook.com/v<version>/${WHATSAPP_PHONE_NUMBER_ID}/messages` with `Authorization: Bearer ${WHATSAPP_ACCESS_TOKEN}` (stub `sendTemplateMessage`'s actual use for Phase 5; the function itself belongs here since it's shared client code).
- [ ] T023 Implement `app/api/whatsapp/webhook/route.ts` GET handler per contracts/whatsapp-webhook.md: compare `hub.verify_token` to `process.env.WHATSAPP_VERIFY_TOKEN`, respond with `hub.challenge` (`200`, `text/plain`) or `403`.
- [ ] T024 Implement `app/api/whatsapp/webhook/route.ts` POST handler, steps 1–5 from contracts/whatsapp-webhook.md: verify signature (T021) before parsing the body for anything else (`401` on failure); for each `messages[]` entry, idempotency-insert on `whatsappMessageId` (skip if it already exists); for non-text types, compose and send the unsupported-format reply immediately; for text types, append to `WhatsAppConversation.bufferedText` and increment `bufferVersion` (creating the conversation row if it doesn't exist yet, `stage: AWAITING_REFERENCE`); respond `200`. Any log statement touching `messages[].from` or `phoneNumber` MUST pass it through `lib/whatsapp/mask-phone.ts` (T011) first — never log a raw phone number (FR-024).
- [ ] T025 Add the `after()` (`next/server`) debounce hook from research.md decision 5 to the POST handler: after responding, atomically claim the buffer (an `UPDATE ... WHERE bufferVersion = $current RETURNING *`-style claim, not read-then-write — this is what T019 tests), wait ~2–3s, re-read `bufferVersion`; if it advanced, exit without sending anything; otherwise proceed to Phase 3/4's reply logic (stubbed as a no-op passthrough in this phase, since that logic doesn't exist until the next phases — just log the resolved buffered text, phone-masked, for now so Phase 3 has an integration point to replace).
- [ ] T026 Wire `lib/whatsapp/client.ts`'s `sendTextMessage` into the unsupported-format branch of T024 with the copy from spec FR-016 ("no puedo procesar ese tipo de mensaje..." — Mexican Spanish, matching the tone in `docs/legacy/`). This is fixed copy, not a Claude call — contracts.md is explicit that unsupported-format replies never reach the AI adapter.

**Checkpoint**: The webhook is live, secure, idempotent, masking-safe, debounce-safe under concurrency, and fast-acking on the test number. Text messages are received and buffered but not yet answered — Phase 3 adds that.

---

## Phase 3: Reference confirmation — replaces "Busca Agenda" / "Confirma Agenda" (US1, US4)

**Goal**: A prospect messaging with a valid, phone-matched reference gets their appointment confirmed in the established tone; anyone without one gets redirected to the wizard — but only when they've never resolved a reference before. A prospect who already has a `CONFIRMED` conversation and sends a follow-up message without repeating their reference must **not** be redirected to the wizard again (FR-004) — this phase's reference-resolution step is stage-aware, not just pattern-matched, and gets a test proving it.

**Independent Test**: quickstart.md Scenarios 1, 2, 5 — a real wizard-booked reference gets a correct confirmation reply; a mismatched phone number gets neither confirmation nor proposal details; a missing/unmatched reference gets the wizard link, never a qualifying question — *except* when the conversation is already past `AWAITING_REFERENCE`, in which case a message with no reference falls through to Phase 4's intent classification instead of the wizard link.

### Tests for Phase 3 (US1, US4) ⚠️

- [ ] T027 [P] [US1] Test in `lib/whatsapp/reference.test.ts`: extracts `NXR-SES-260924-A1B2`-shaped references from realistic message text (including the exact wizard-generated copy "Hola Nexoru, ya agendé mi sesión. Mi referencia es NXR-SES-260924-A1B2."), and returns `null` for text with no matching pattern.
- [ ] T028 [P] [US1] Test in `lib/whatsapp/reference.test.ts`: phone-match comparison normalizes both sides to digits-only before comparing (matching the existing `wa.me` link's `cleanNumber` convention) and correctly flags a mismatch.
- [ ] T029 [P] [US1] Test in `lib/services/whatsapp-conversation.test.ts`: a message with a reference matching a `SCHEDULED` `OnboardingMeeting` and a matching phone number produces a confirmation reply containing the date, time, reference, and joining link, and asserts a `WhatsAppAiCall` row is inserted with `kind: "COMPOSE_REPLY"` (mock the Claude `fetch` call and the Prisma create) — `composeReply` itself has no other dedicated test task, so its FR-025 logging is verified here, mirroring how T040 verifies it for `classifyIntent`.
- [ ] T030 [P] [US1] Test: a reference matching a `CANCELLED`/`COMPLETED` meeting produces a status reply, not a confirmation as if it were upcoming (spec Acceptance Scenario US1.3).
- [ ] T031 [P] [US4] Test: a message with no reference, and separately one with a reference matching nothing, both produce the wizard-link reply — **only when the conversation's `stage` is still `AWAITING_REFERENCE`**.
- [ ] T032 [P] [US1] Test: a phone mismatch increments `consecutiveFailedAttempts` and sends neither a confirmation nor any appointment/proposal detail (FR-023) — the reply, if any, must not leak data.
- [ ] T033 [P] [US1] Test (FR-004/SC-004 — previously untested): a `WhatsAppConversation` already at `stage: CONFIRMED` receives a new message containing **no** reference — assert it is routed to intent classification (Phase 4), not the wizard-redirect reply, i.e. `extractReference`/wizard-redirect logic only runs for `AWAITING_REFERENCE` conversations.

### Implementation for Phase 3 (US1, US4)

- [ ] T034 [P] [US1] Implement `lib/whatsapp/reference.ts`: `extractReference(text: string): string | null` (regex `NXR-SES-\d{6}-[A-Z0-9]{4}`, matching `lib/services/onboarding-meeting.ts`'s generated format exactly) and `phoneMatches(inbound: string, onFile: string): boolean` (digits-only normalization on both sides).
- [ ] T035 [US1] Implement `lib/services/whatsapp-conversation.ts`'s reference-resolution step, **gated on `stage`**: only when `stage === "AWAITING_REFERENCE"`, call `extractReference` on the buffered text; if found, look up `OnboardingMeeting` by `meetingReference` (include `contactWhatsappSnapshot`, `status`, `scheduledAt`, `scheduledEndAt`, `timezone`, `googleMeetLink`) and call `phoneMatches` — on mismatch, increment `consecutiveFailedAttempts` and produce no confirmation/proposal reply; if no reference is found, route to the wizard-redirect reply (US4, T037). For any other `stage`, **skip this entire block** and fall through to Phase 4's intent-classification path (T044) instead — this is the fix for T033's test and for FR-004.
- [ ] T036 [US1] On a resolved, phone-matched reference: set `WhatsAppConversation.meetingId` and `stage: CONFIRMED`, then call `lib/ai/adapter.ts`'s `composeReply({ kind: session.status === "SCHEDULED" ? "appointment_confirmation" : "appointment_status", fields: { date, time, reference, joinLink } })` and send it via `sendTextMessage` (T022).
- [ ] T037 [US4] Implement the wizard-redirect branch: `composeReply({ kind: "wizard_redirect", fields: { wizardUrl: appUrl("/onboarding/start") } })` (reusing `lib/config/urls.ts`'s `appUrl`, already in this repo) and send via `sendTextMessage` — never falls through to any qualifying question.
- [ ] T038 [US1] Implement `lib/ai/adapter.ts`'s `composeReply` function: single Claude (Haiku) call via `fetch` to the Messages API (no SDK — matching `lib/services/package-recommendation.ts`'s existing pattern), receiving only the `kind` + `fields` already fetched from the database (contracts/whatsapp-webhook.md) — never given raw DB access or asked to look anything up. Do **not** set `cache_control` on this call (research.md decision 9: these prompts run well under Haiku 4.5's 4,096-token minimum cacheable size, so caching would silently no-op). After the response returns, insert one `WhatsAppAiCall` row (`kind: "COMPOSE_REPLY"`, `model`, `inputTokens`/`outputTokens` from the response's `usage`, `estimatedCostUsd` computed from those against the model's published per-token rate) — this is the only place `composeReply` needs to be implemented; Phase 4 reuses it as-is.
- [ ] T039 Replace Phase 2's T025 stub with a call into T035's reference-resolution flow, so the `after()` debounce callback now produces a real reply instead of just logging.

**Checkpoint**: The core cost-driving replacement (US1 + US4) is live and independently demonstrable end-to-end on the test number, using a real wizard-booked reference — including correctly *not* re-redirecting an already-confirmed prospect to the wizard.

---

## Phase 4: Claude-powered proposal Q&A (US3)

**Goal**: A prospect with a confirmed reference can ask about their own proposal and get an answer grounded strictly in their stored session data — never a generic or invented answer.

**Independent Test**: quickstart.md Scenario 3 — a question the proposal data answers gets a correct, data-grounded reply; a general/ungroundable question does not get a generic answer (it becomes a stuck point, wired to escalation in Phase 5).

### Tests for Phase 4 (US3) ⚠️

- [ ] T040 [P] [US3] Test in `lib/ai/adapter.test.ts`: `classifyIntent` returns `"ask_about_proposal"` for a proposal-related question and `"unclear"` for an off-topic/general one (mock the Claude `fetch` call); assert a `WhatsAppAiCall` row is inserted with `kind: "CLASSIFY_INTENT"` regardless of the classification result.
- [ ] T041 [P] [US3] Test in `lib/services/whatsapp-conversation.test.ts`: a proposal question from a `CONFIRMED` conversation with an existing `OnboardingPackageRecommendation` produces a reply built only from that record's `packageName`/`setupPrice`/`monthlyPrice`/`rationale` fields (assert the composed fields passed to `composeReply` match the DB row exactly).
- [ ] T042 [P] [US3] Test: a question that isn't grounded in stored data (including a general/policy question, per the clarification session) does **not** call `composeReply` with a generic answer — it increments `consecutiveFailedAttempts` instead (FR-009, FR-011).

### Implementation for Phase 4 (US3)

- [ ] T043 [US3] Implement `lib/ai/adapter.ts`'s `classifyIntent({ messageText }): Promise<"ask_about_proposal" | "request_human" | "unclear">` — single Claude (Haiku) call, schema-constrained enum output, only invoked once a conversation is past `AWAITING_REFERENCE` (contracts/whatsapp-webhook.md). No `cache_control` (same research.md decision 9 reasoning as T038 — this prompt is even shorter). After the response returns, insert a `WhatsAppAiCall` row (`kind: "CLASSIFY_INTENT"`) exactly like T038 does for `composeReply`.
- [ ] T044 [US3] Extend `lib/services/whatsapp-conversation.ts`: for a `CONFIRMED`/`ANSWERING_PROPOSAL` conversation's message that isn't itself a new reference (per T035's stage gate), call `classifyIntent`; on `ask_about_proposal`, join `OnboardingMeeting.sessionId → OnboardingSession.packageRecommendation` (the existing `OnboardingPackageRecommendation` row — read-only, per data-model.md's "Referenced Proposal") and call `composeReply({ kind: "proposal_answer", fields: {...} })`; set `stage: ANSWERING_PROPOSAL`.
- [ ] T045 [US3] On `classifyIntent` returning `"unclear"` for a proposal-context message (i.e., not groundable): increment `consecutiveFailedAttempts`, send no reply claiming an answer (this feeds Phase 5's escalation threshold — no escalation logic exists yet in this phase, just the counter).

**Checkpoint**: US1, US3, US4 all independently demonstrable. Escalation (US2) is the only story left before the full spec is covered.

---

## Phase 5: Escalation, rate-limited alerts, and the Plan B reply page (US2)

**Goal**: Explicit human requests and accumulated stuck points (from Phases 3–4's counters) escalate reliably to Ulises without spamming him, with a business-hours-aware prospect notice, and — regardless of Meta coexistence eligibility — a way for Ulises to actually reply.

**Independent Test**: quickstart.md Scenario 4 — explicit "quiero hablar con alguien" and the 2-attempt threshold both escalate; Ulises gets the WhatsApp alert + email; a second escalation for the same number within an hour is recorded but doesn't re-alert; outside 10:00–15:00 the prospect gets a "when to expect a reply" notice; the reply page lets Ulises send a message through the same number.

> **Two constraints that apply specifically to this phase, not caught anywhere else in the plan — call them out explicitly in the relevant tasks below, don't leave them implicit:**
> 1. **WhatsApp's 24-hour customer-service window** applies to *every* business-initiated free-form text in this feature, including Ulises's replies sent through the Plan B page (T064) — if the prospect's last inbound message is more than 24h old, Meta will reject a free-form `sendTextMessage` and only a pre-approved template can reach them. The reply page MUST check this and tell Ulises, not just let the send silently fail.
> 2. **The Plan B reply page's signed link has its own, separate expiry** (48 hours from generation, chosen to comfortably outlast the 24h WhatsApp window without being open-ended) — an expired or tampered token must show a clear error, not a broken page.

### Tests for Phase 5 (US2) ⚠️

- [ ] T046 [P] [US2] Test in `lib/whatsapp/business-hours.test.ts`: returns `true` for times inside 10:00–15:00 `America/Mexico_City` and `false` outside, across a DST-adjacent date if applicable.
- [ ] T047 [P] [US2] Test in `lib/services/whatsapp-conversation.test.ts`: an explicit "quiero hablar con alguien"-classified message escalates immediately regardless of `consecutiveFailedAttempts`.
- [ ] T048 [P] [US2] Test: `consecutiveFailedAttempts` reaching 2 escalates (FR-011), and resets to 0 on any successful confirm/answer before then.
- [ ] T049 [P] [US2] Test: escalating creates a `WhatsAppEscalation` row, sets `WhatsAppConversation.stage = ESCALATED`, and a subsequent inbound message from that same number produces **no** automated reply at all.
- [ ] T050 [P] [US2] Test: when `WHATSAPP_ESCALATION_TEMPLATE_NAME` send fails (mocked failure), `emailSentAt` is still set and the escalation still counts as delivered (SC-005) — `whatsappAlertSentAt` stays null.
- [ ] T051 [P] [US2] Test: a second escalation trigger for the same phone number within 1 hour of the first sets `rateLimited: true` and does not call `sendTemplateMessage` or the email sender again, while still creating the `WhatsAppEscalation` row and keeping `stage: ESCALATED`.
- [ ] T052 [P] [US2] Test: an escalation outside 10:00–15:00 sends the prospect an additional "when you'll be contacted" message; one inside the window does not (spec Acceptance Scenarios US2.3/US2.4).
- [ ] T053 [P] [US2] Test in `lib/whatsapp/escalation-token.test.ts` (pure function test — **not** a page-rendering test; this repo's `vitest.config.ts` runs `environment: "node"` with no jsdom/React-rendering setup, so token verification is tested at the function level, not through `page.tsx`): a validly-signed, non-expired (≤48h) token verifies and returns its `conversationId`; an expired (>48h) or tampered token returns `null`.
- [ ] T054 [P] [US2] Test: submitting a reply on the Plan B page when the prospect's last inbound message is >24h old is blocked with an explicit "outside the 24-hour window, this can't be sent as a free-form message" error, and `sendTextMessage` is never called in that case.

### Implementation for Phase 5 (US2)

- [ ] T055 [P] [US2] Implement `lib/whatsapp/business-hours.ts`: `isWithinBusinessHours(date: Date): boolean` against 10:00–15:00 in `America/Mexico_City` (matching `GOOGLE_MEETING_DEFAULT_TIMEZONE`'s existing timezone convention in this repo).
- [ ] T056 [US2] Implement the escalation trigger in `lib/services/whatsapp-conversation.ts`: on an explicit human request (from `classifyIntent`) or `consecutiveFailedAttempts >= 2`, create a `WhatsAppEscalation` row (`reason`, `occurredDuringBusinessHours` via T055) in the same transaction that sets `WhatsAppConversation.stage = ESCALATED`.
- [ ] T057 [US2] Before sending alerts, query `WhatsAppEscalation` for that conversation's phone number for any row with `createdAt > now() - interval '1 hour'`; if found, set the new row's `rateLimited: true` and skip T058–T059; otherwise proceed to send.
- [ ] T058 [US2] Send the escalation alert: `sendTemplateMessage(ULISES_WHATSAPP_NUMBER, WHATSAPP_ESCALATION_TEMPLATE_NAME, [prospect summary fields])` (T022) — set `whatsappAlertSentAt` only on confirmed success; a failure here must not block T059.
- [ ] T059 [US2] Send the escalation email to `admin@nexoru.ai` with the prospect/conversation summary — set `emailSentAt` on confirmed send; this is the field SC-005 checks, independent of T058's outcome.
- [ ] T060 [US2] If `!occurredDuringBusinessHours` (T055), send the prospect a reply stating when they'll be contacted (next 10:00 `America/Mexico_City`) via `composeReply({ kind: "escalation_out_of_hours", fields: { nextWindowStart } })` (T038 — logs its own `WhatsAppAiCall` row, same as every other `composeReply` call) + `sendTextMessage`.
- [ ] T061 [P] [US2] Implement the signed-token helper `lib/whatsapp/escalation-token.ts`: `signEscalationToken(conversationId): string` (HMAC over `conversationId` + a 48-hour expiry timestamp, keyed by `WHATSAPP_ESCALATION_TOKEN_SECRET`) and `verifyEscalationToken(token): { conversationId: string } | null` (returns `null` on bad signature *or* expiry — both are just "invalid," not distinguished to the caller).
- [ ] T062 [US2] Include the signed link (`/whatsapp/escalations/[conversationId]/reply?token=...`) in T059's escalation email body.
- [ ] T063 [US2] Implement `app/whatsapp/escalations/[conversationId]/reply/page.tsx`: verify the token (T061) server-side, show recent `WhatsAppMessage` rows for context, and a form to send a reply.
- [ ] T064 [US2] Implement the reply page's submit handler: check whether the conversation's most recent **inbound** `WhatsAppMessage.createdAt` is within the last 24 hours; if not, block the send and show the 24-hour-window error explicitly (do not attempt `sendTextMessage`); if within the window, call `sendTextMessage(conversation.phoneNumber, body)` and insert a `WhatsAppMessage` row (`direction: OUTBOUND`) — this never changes `stage` away from `ESCALATED` and never re-enables automated replies.

**Checkpoint**: All four user stories (US1–US4) are independently demonstrable on the test number, end to end, matching the full spec.

---

## Phase 6: Cutover & retirement runbook (manual, approval-gated — nothing here executes automatically)

**Not a code phase.** Every item below is a checklist step from research.md decisions 1 and 8, to be carried out manually against the **production** number and the ManyChat/Zapier subscriptions once Phases 1–5 have proven themselves on the test number. Per explicit instruction: **each step requires your explicit go-ahead before it is carried out — nothing in this phase is ever executed as a side effect of finishing Phase 5, and no step here should be automated into a script that runs unattended.**

- [ ] T065 **[APPROVAL REQUIRED]** Confirm Phases 1–5 have run against the Meta test number for an agreed burn-in period with no unresolved defects.
- [ ] T066 **[APPROVAL REQUIRED]** In Meta Business Suite, check whether the production WABA is offered Business-app + Cloud-API coexistence (research.md, decision 2) — determines whether the Phase 5 reply page remains the primary path post-cutover or becomes a fallback.
- [ ] T067 **[APPROVAL REQUIRED]** Agree the cutover date/time, inside the 10:00–15:00 window with Ulises available.
- [ ] T068 **[APPROVAL REQUIRED]** Disconnect `+52 55 8648 8746` from ManyChat's app connection in Meta Business Suite.
- [ ] T069 **[APPROVAL REQUIRED]** Register the production number under NEXORU's own Meta app; update `WHATSAPP_PHONE_NUMBER_ID` (and related secrets) in the Production Vercel environment.
- [ ] T070 **[APPROVAL REQUIRED]** Send a manual test message to the production number and confirm the new webhook handles it correctly before declaring the cutover complete.
- [ ] T071 **[APPROVAL REQUIRED]** Begin the post-cutover burn-in period (2–4 weeks), monitoring 100% of real production traffic on the new webhook.
- [ ] T072 **[APPROVAL REQUIRED]** After burn-in with no unresolved incidents, pause (do not delete) the Zapier zap.
- [ ] T073 **[APPROVAL REQUIRED]** After a short monitoring period post-pause with no missed confirmations, downgrade/cancel the Zapier plan (timed to the renewal date where possible).
- [ ] T074 **[APPROVAL REQUIRED]** Export/archive the ManyChat flow structure and Zapier zap steps for institutional memory (beyond the `docs/legacy/` screenshots already captured).
- [ ] T075 **[APPROVAL REQUIRED]** Cancel the ManyChat subscription (timed to the renewal date where possible).
- [ ] T076 **[APPROVAL REQUIRED]** Final sign-off: document that reverting past this point requires a fresh cutover back to ManyChat, not an instant rollback.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Base)**: No dependencies — start immediately.
- **Phase 2 (Webhook)**: Depends on Phase 1 (needs the `WhatsAppConversation`/`WhatsAppMessage` tables to buffer/dedupe against, and `mask-phone` for its own logging). Blocks Phases 3–5.
- **Phase 3 (US1/US4)**: Depends on Phase 2 (needs the webhook's buffering/debounce plumbing to hang its reply logic off of).
- **Phase 4 (US3)**: Depends on Phase 3 (a conversation must already be `CONFIRMED` before proposal Q&A makes sense, and reuses Phase 3's `composeReply` implementation as-is) — not independent of Phase 3 the way US1/US2/US3/US4 are independent of each other in the spec, because this phase grouping is by delivery slice, not pure story isolation.
- **Phase 5 (US2)**: Depends on Phases 3 and 4 (escalates on their `consecutiveFailedAttempts` counters and on the explicit-human-request classification introduced in Phase 4's `classifyIntent`).
- **Phase 6 (Runbook)**: Depends on Phase 5 being complete and burned in — and every step within it gates on your explicit approval, not on the previous step's mere completion.

### Parallel Opportunities

- Within Phase 1: T003, T004, T008 are independent of the schema/Neon work; T009–T010 (tests) are parallel to each other; T011 is parallel to T012–T013.
- Within Phase 2: all test tasks (T014–T020) are parallel to each other; T021–T022 (implementation) are parallel to each other.
- Within Phase 3: T027–T033 (tests) are parallel; T034 is parallel to nothing else in that phase (T035–T039 depend on it).
- Within Phase 4: T040–T042 (tests) are parallel.
- Within Phase 5: T046–T054 (tests) are largely parallel (different files); T061 is parallel to T055–T060.
- Phase 6 tasks are strictly sequential (each is a real-world action gating the next) — no parallelism, by design.

---

## Implementation Strategy

### MVP

Phases 1–3 constitute the smallest deployable, demonstrable increment: the schema (including masking and retention) exists, the webhook is secure, idempotent, and debounce-safe, and a real prospect can get their appointment confirmed by referencing a wizard-booked meeting — the single highest-value replacement for ManyChat/Zapier's cost. Stop and validate against the test number here before continuing.

### Incremental Delivery

1. Phase 1 → verify at the database level (no WhatsApp traffic yet); confirm masking and retention independently via their unit tests.
2. Phase 2 → verify signature/idempotency/unsupported-format/debounce-under-concurrency behavior on the test number.
3. Phase 3 → **MVP** — verify full reference-confirmation flow end to end, including that an already-`CONFIRMED` prospect is never re-redirected to the wizard.
4. Phase 4 → verify proposal Q&A on top of an already-confirmed conversation, and that every Claude call is logging its cost.
5. Phase 5 → verify escalation, rate-limiting, and the reply page — this is the last phase needed for the spec to be fully satisfied on the test number.
6. Phase 6 → only after 1–5 have proven themselves, and only ever one manually-approved step at a time.
