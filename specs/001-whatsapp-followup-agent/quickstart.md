# Quickstart: Validating the WhatsApp Follow-up Agent

This is a validation guide, not an implementation guide — it assumes the tasks from `tasks.md` (Phase 2, not yet generated) are built. Each scenario maps back to an acceptance scenario in `spec.md`.

## Prerequisites

- A Meta Cloud API test number configured, webhook URL pointed at this feature's preview deployment's `/api/whatsapp/webhook`, and the env vars from `contracts/whatsapp-webhook.md` set for that Vercel preview environment.
- A Neon preview database branch (research.md, decision 4) migrated: `npx prisma migrate deploy` run against it, including the new `WhatsAppConversation`/`WhatsAppMessage`/`WhatsAppEscalation` tables from `data-model.md`.
- At least one real `OnboardingSession` → `OnboardingMeeting` → `OnboardingPackageRecommendation` chain in that same database, created by actually completing the onboarding wizard against the preview deployment (so there's a real `meetingReference`, a real `contactWhatsappSnapshot`, and a real proposal to test against) — don't hand-insert fixture rows for this, since the point is to prove the whole reuse chain (wizard → wa.me link → this agent) works, not just this feature in isolation.
- A test WhatsApp account able to message the Meta test number, ideally by actually tapping the `wa.me` link the wizard's schedule-confirmation page generates (proves FR-005/contracts' reference-extraction regex matches what the wizard actually produces), plus a second WhatsApp account/number for the phone-mismatch scenario (US1 doesn't need this, but the FR-023 scenario below does).

## Scenario 1 — Reference validation and appointment confirmation (User Story 1, P1)

1. Complete the onboarding wizard through scheduling on the preview deployment; note the `meetingReference`.
2. From the WhatsApp account whose number matches `contactWhatsappSnapshot` on that meeting, message the test number via the wizard's `wa.me` link (or manually send the same pre-filled text: `Hola Nexoru, ya agendé mi sesión. Mi referencia es <reference>.`).
3. **Expected**: a reply within 10 seconds confirming date, time, reference, and joining link, in the tone from `docs/legacy/` — and zero requests made to any ManyChat/Zapier URL (there shouldn't be any such credentials configured in this environment at all, so this is naturally true, but confirm no such calls appear in logs).

## Scenario 2 — Phone mismatch (FR-023 clarification)

1. Using the same reference from Scenario 1, message the test number from a **different** WhatsApp number than the one on file.
2. **Expected**: no appointment or proposal details are sent back; the conversation is treated as a stuck point. Send it again (or a second unresolvable message) to cross the 2-attempt threshold and confirm escalation fires (Scenario 4).

## Scenario 3 — Proposal Q&A (User Story 3, P3)

1. From the verified number (Scenario 1), ask a question the proposal data actually answers, e.g. "¿qué incluye el paquete?" or "¿cuál es el precio?".
2. **Expected**: the reply reflects that session's actual `packageName`/`setupPrice`/`monthlyPrice`/`rationale` — cross-check against what's stored in `OnboardingPackageRecommendation` for that session, don't just eyeball plausibility.
3. Ask something ungroundable, e.g. "¿cómo funciona la facturación en general?" (a general-process question, per the clarification session).
4. **Expected**: this does **not** get a generic answer — it's treated as a stuck point (same escalation path as Scenario 4).

## Scenario 4 — Escalation (User Story 2, P2)

1. Trigger either an explicit human request ("quiero hablar con alguien") or accumulate 2 consecutive unresolved stuck points (e.g., two rounds of Scenario 3's ungroundable question).
2. **Expected**: Ulises's WhatsApp receives the utility-template alert, `admin@nexoru.ai` receives the summary email, the conversation's `stage` becomes `ESCALATED` in the database, and further messages from that prospect get no automated reply.
3. Repeat during a window outside 10:00–15:00 (or temporarily adjust the system clock/business-hours check in a non-production way for the test) — **expected**: the prospect additionally receives a message stating when they'll be contacted.
4. Simulate the WhatsApp alert failing (e.g., an invalid `WHATSAPP_ESCALATION_TEMPLATE_NAME` in this preview environment only) — **expected**: as long as the email send succeeds, the escalation still counts as delivered (conversation still moves to `ESCALATED`, prospect still gets silence going forward).

## Scenario 5 — No valid reference (User Story 4, P4)

1. Message the test number from a brand-new number with no reference in the text at all, and separately with a reference that doesn't match anything (`NXR-SES-999999-ZZZZ`).
2. **Expected**: both get the wizard link back, never a qualifying question and never an attempt to keep troubleshooting the reference conversationally.

## Scenario 6 — Duplicate delivery and unsupported message type

1. Manually resend the exact same webhook payload (same `messages[].id`) that Scenario 1 already processed (simulating a Meta retry) — **expected**: no second reply is sent.
2. Send an image or voice note from the verified number — **expected**: a reply explaining the format isn't supported, not silence.

## Scenario 7 — Burst messages

1. Send 2–3 short messages in quick succession (within ~2 seconds of each other) from the verified number, together forming one coherent request (e.g., "Hola" / "quiero confirmar mi cita" / "mi referencia es <reference>").
2. **Expected**: exactly one reply, addressing the combined content — not one reply per message.

## Automated coverage (per Calidad y Flujo de Entrega — not optional)

The scenarios above are for manual/preview validation. Per the constitution, the webhook handler, the confirmation/scheduling read path, and the escalation flow additionally need Vitest coverage (mocking the Meta payload, Prisma, and the AI adapter — following the pattern already established in `app/api/onboarding/package-recommendation/route.test.ts`), covering at minimum: signature rejection, idempotent duplicate handling, the phone-match/mismatch branch, the escalation email-fallback branch, and the burst-debounce version-check logic.
