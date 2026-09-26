# Data Model: NEXORU WhatsApp Follow-up Agent

Three new tables, all additive to the existing schema — nothing on `OnboardingSession`, `OnboardingMeeting`, or `OnboardingPackageRecommendation` changes. Two entities from the spec (`Referenced Appointment`, `Referenced Proposal`) are explicitly **not** new tables — they are read-only joins into wizard-owned data, listed at the bottom.

Per the constitution's Principle V (and the `CLAUDE.md` rule it added), the migration that creates these tables MUST include `ALTER TABLE "<Name>" ENABLE ROW LEVEL SECURITY;` for each one, exactly like `20260925021002_enable_rls_public_schema` did for the existing schema.

## New tables

### WhatsAppConversation

One row per prospect phone number conversing with the agent. Maps to the spec's **Conversation** and part of **Prospect** entities.

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(cuid())` | |
| `phoneNumber` | `String @unique` | Digits-only, normalized the same way `wa.me` links already strip non-digits (`app/onboarding/schedule-confirmation/page.tsx`'s `cleanNumber` pattern). One conversation per sender number. |
| `meetingId` | `String?` | FK to `OnboardingMeeting.id`, set once a reference resolves **and** the phone matches (FR-005, FR-023). Null while `stage = AWAITING_REFERENCE`. |
| `stage` | `WhatsAppConversationStage` (enum) | `AWAITING_REFERENCE \| CONFIRMED \| ANSWERING_PROPOSAL \| ESCALATED` — matches the spec's Conversation entity stages exactly; no extra stage invented. |
| `bufferedText` | `String?` | Pending, not-yet-replied-to inbound text accumulated during the burst-debounce window (FR-018). Cleared after each reply. |
| `bufferVersion` | `Int @default(0)` | Incremented on every inbound message; the debounce mechanism (research.md, decision 5) uses this to detect whether a newer message superseded the one a given function invocation is waiting on. |
| `consecutiveFailedAttempts` | `Int @default(0)` | Backs the 2-attempt escalation threshold (FR-011, from the original spec clarification). Reset to 0 on any successful confirm/answer; escalates at 2. |
| `lastActivityAt` | `DateTime @updatedAt` | Drives FR-004 (resume without re-identifying) and the 90-day retention window (FR-022). |
| `createdAt` | `DateTime @default(now())` | |

Relations: `meeting OnboardingMeeting? @relation(fields: [meetingId], references: [id])` (no cascade — this is a read reference to wizard-owned data, not ownership; deleting a `WhatsAppConversation` must never delete the underlying `OnboardingMeeting`, and per spec Assumptions this feature never deletes/modifies it at all). `messages WhatsAppMessage[]`, `escalations WhatsAppEscalation[]`.

### WhatsAppMessage

Append-only log of every inbound/outbound message, one row per message. Backs FR-015 (duplicate detection), FR-017 (record enough to review), and doubles as the burst buffer's audit trail.

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(cuid())` | |
| `conversationId` | `String` | FK to `WhatsAppConversation.id`, `onDelete: Cascade`. |
| `direction` | `WhatsAppMessageDirection` (enum) | `INBOUND \| OUTBOUND`. |
| `whatsappMessageId` | `String @unique` | Meta's `message_id` — the idempotency key for inbound messages (Meta retries deliveries), per the plan's explicit requirement. Also stored for outbound sends for support/debugging. |
| `bodyText` | `String` | Message content. Subject to the same 90-day retention as the rest of conversation data (FR-022) — no separate policy needed. |
| `createdAt` | `DateTime @default(now())` | |

Relation: `conversation WhatsAppConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)`.

**Duplicate handling (FR-015)**: before processing any inbound webhook payload, `INSERT ... ON CONFLICT (whatsappMessageId) DO NOTHING` (or the Prisma-equivalent try/catch on the unique constraint) and check whether a row was actually inserted; if not, the message was already processed — acknowledge the webhook and do nothing else.

### WhatsAppEscalation

One row per escalation event. Backs the spec's **Escalation** entity.

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(cuid())` | |
| `conversationId` | `String` | FK to `WhatsAppConversation.id`, `onDelete: Cascade`. |
| `reason` | `WhatsAppEscalationReason` (enum) | `HUMAN_REQUESTED \| UNABLE_TO_RESOLVE` — matches spec FR-010/FR-011 exactly. |
| `occurredDuringBusinessHours` | `Boolean` | Whether the escalation happened inside 10:00–15:00 America/Mexico_City (FR-014); drives whether the out-of-hours notice was sent to the prospect (SC-006). |
| `whatsappAlertSentAt` | `DateTime?` | Null if the Meta utility-template alert to Ulises failed, was never confirmed delivered, or was suppressed by `rateLimited` below. |
| `emailSentAt` | `DateTime?` | The reliable fallback (FR-012, per the clarification session) — this field, not `whatsappAlertSentAt`, is what SC-005 checks to consider the escalation "delivered." Also null when `rateLimited`. |
| `rateLimited` | `Boolean @default(false)` | True when this escalation was recorded (conversation still moved to `ESCALATED`, agent still goes silent) but the alert send was skipped because this phone number already triggered an alert within the last hour (research.md, decision 6). Distinguishes "we chose not to notify Ulises again" from "we tried and failed." |
| `createdAt` | `DateTime @default(now())` | |

Relation: `conversation WhatsAppConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)`.

**Effect on `WhatsAppConversation.stage`**: creating a `WhatsAppEscalation` row sets the parent conversation's `stage` to `ESCALATED` in the same transaction — there is intentionally no separate "is escalated" boolean to keep out of sync.

## Enums

```prisma
enum WhatsAppConversationStage {
  AWAITING_REFERENCE
  CONFIRMED
  ANSWERING_PROPOSAL
  ESCALATED
}

enum WhatsAppMessageDirection {
  INBOUND
  OUTBOUND
}

enum WhatsAppEscalationReason {
  HUMAN_REQUESTED
  UNABLE_TO_RESOLVE
}
```

## Read-only entities (not new tables)

### Referenced Appointment

Not a table — a query joining `WhatsAppConversation.meetingId` → the existing `OnboardingMeeting` row. The fields this feature reads from it: `meetingReference`, `status`, `scheduledAt`, `scheduledEndAt`, `timezone`, `googleMeetLink`, and critically **`contactWhatsappSnapshot`** — this is the phone number on file that FR-023's verification checks the inbound sender against; it already exists on `OnboardingMeeting` (populated by `app/api/onboarding/schedule/book/route.ts` from `session.businessProfile.whatsapp`) and needs no schema change.

### Referenced Proposal

Not a table — a query joining `OnboardingMeeting.sessionId` → `OnboardingSession.packageRecommendation` (the existing `OnboardingPackageRecommendation` row, from the idempotency fix earlier this session). The fields this feature reads for User Story 3: `packageName`, `packageDescription`, `setupPrice`, `monthlyPrice`, `rationale`. Never written to by this feature (FR-009's "without regenerating or altering the proposal").

## Privacy handling (Principle V)

`phoneNumber` and `contactWhatsappSnapshot` MUST be masked before appearing in any log line this feature writes (e.g. `***3456` — last 4 digits only), matching "los números de teléfono MUST enmascararse antes de registrarse." `bodyText` is stored in the database (needed for grounding and review, FR-017) but should not be echoed into application logs verbatim.

## Migration checklist (for the Phase 2 tasks that create this)

- [ ] `CREATE TYPE` for all three enums
- [ ] `CREATE TABLE` for `WhatsAppConversation`, `WhatsAppMessage`, `WhatsAppEscalation`
- [ ] Unique index on `WhatsAppConversation.phoneNumber` and `WhatsAppMessage.whatsappMessageId`
- [ ] `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` for all three (constitution Principle V — non-negotiable)
- [ ] No `ALTER` to any existing table
