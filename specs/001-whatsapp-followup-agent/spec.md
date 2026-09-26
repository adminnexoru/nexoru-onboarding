# Feature Specification: NEXORU WhatsApp Follow-up Agent (Phase 1 — Test Number)

**Feature Branch**: `001-whatsapp-followup-agent`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "Redefinición de alcance sobre la spec 001. WhatsApp es canal de seguimiento para prospectos que vienen del wizard, NO un agente que califica — el wizard es quien califica y propone. Funciones: validar la referencia del wa.me y confirmar la cita (conservando el tono de los mensajes de docs/legacy/); responder dudas del prospecto sobre su propuesta usando los datos de su sesión; a quien escriba sin referencia válida, responder con el enlace al wizard; escalación según la pregunta 8 de docs/respuestas-preguntas-abiertas.md. Horario de atención humana: 10:00 a 15:00; fuera de horario, el agente informa cuándo será contactado. Criterio de éxito: reemplazar por completo ManyChat y Zapier (línea base 600 USD/mes). Fuera de alcance: cambios al wizard (specs 002 y 003), pagos, abe.nexoru.ai."

## Clarifications

### Session 2026-09-24

- Q: How long should NEXORU retain a prospect's conversation and classification data before it is deleted or archived? → A: 90 days after last activity.
- Q: How many consecutive failed attempts should the agent make on the same stuck point before escalating to Ulises as "unable to resolve"? → A: After 2 consecutive failed attempts.
- Q: When a prospect sends several messages in quick succession before the agent has replied, how should the agent handle it? → A: Wait a short pause, then reply once to the combined messages.

### Session 2026-09-25

- Q: Before confirming appointment or proposal details, should the agent verify that the WhatsApp number sending the message matches the phone number on file for that reference? → A: Yes, require an exact phone match; a mismatch is treated as a stuck point and escalated.
- Q: If the WhatsApp alert to Ulises fails to send, is the email to admin@nexoru.ai enough on its own, or must the system retry or escalate further? → A: Email is the reliable fallback — the escalation counts as handled once the email is confirmed sent, even if the WhatsApp alert fails.
- Q: When a prospect asks a general question about NEXORU's process (not specific to their own case) that isn't literally in their stored session data, should the agent answer it generically or escalate? → A: Escalate — the agent never answers beyond its own prospect's stored session data, including general/policy questions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Validate a reference and confirm the appointment (Priority: P1)

A prospect who already completed the onboarding wizard and booked a discovery call messages the NEXORU WhatsApp test number — typically by tapping the `wa.me` link the wizard gave them, which carries their meeting reference. The agent looks up that reference against NEXORU's own records and, when it resolves to a real booked appointment, confirms the details back to the prospect (date, time, reference, joining link), in the same warm, brief, emoji-forward tone used by the legacy ManyChat messages captured in `docs/legacy/`.

**Why this priority**: This is the direct replacement for what ManyChat's "Busca Agenda" and "Confirma Agenda" automations and their backing Zapier zap do today (see `docs/analisis-solucion-actual.md` and `docs/respuestas-preguntas-abiertas.md`, questions 1, 3, 9). It is the load-bearing function this whole feature exists to replace, and the one directly tied to the ManyChat/Zapier cost this migration is meant to eliminate.

**Independent Test**: Can be fully tested by messaging the test number with a valid meeting reference and confirming the agent replies with the correct appointment details in the expected tone, entirely from NEXORU's own backend — no call to ManyChat or Zapier involved.

**Acceptance Scenarios**:

1. **Given** a prospect sends a message containing a meeting reference that matches an existing booked appointment, **When** the agent processes it, **Then** the prospect receives a confirmation reply with the appointment's date, time, reference, and joining link, styled after the tone in `docs/legacy/` (e.g. friendly, brief, emoji use, addressing the prospect by name).
2. **Given** a prospect messages via the `wa.me` deep link carrying their reference, **When** the agent looks it up, **Then** the lookup and confirmation happen entirely within NEXORU's own systems, with no request made to ManyChat or Zapier.
3. **Given** a prospect's reference matches a cancelled or already-completed appointment, **When** the agent processes it, **Then** the agent tells the prospect the appointment's real status rather than confirming a session that is no longer upcoming.

---

### User Story 2 - Escalate to a human when needed (Priority: P2)

At any point in the conversation, if the prospect explicitly asks to speak with a person, or the agent cannot resolve what the prospect is asking after a couple of attempts, the conversation is escalated to Ulises: he is notified by WhatsApp (a Meta utility template to his personal number) and by email to `admin@nexoru.ai` with a summary of the prospect, the conversation is marked "atendida por humano," and the agent stops replying automatically to it. Ulises then replies from WhatsApp Business on that same number. If this happens outside NEXORU's human attention hours (10:00–15:00), the agent tells the prospect when to expect a reply instead of leaving them without any response.

**Why this priority**: Escalation is the safety net that makes it acceptable to hand any of the other functions to an automated agent at all — it must exist before this feature can safely take live traffic, even on a test number.

**Independent Test**: Can be fully tested by sending a message that explicitly asks for a human at any point, and separately by simulating a request the agent cannot resolve, then confirming in both cases that Ulises receives both the WhatsApp alert and the email, the conversation is marked handled-by-human, and the agent goes silent on it — once during the 10:00–15:00 window and once outside it, to confirm the out-of-hours notice.

**Acceptance Scenarios**:

1. **Given** an active conversation, **When** the prospect explicitly asks to speak with a person, **Then** Ulises receives a WhatsApp utility-template message to his personal number and an email to `admin@nexoru.ai` summarizing the prospect, the conversation is marked "atendida por humano," and the agent sends no further automated replies to it.
2. **Given** an active conversation, **When** the agent fails to make progress on the same stuck point after 2 consecutive attempts, **Then** the same escalation in Scenario 1 occurs.
3. **Given** an escalation happens between 10:00 and 15:00, **When** the prospect is waiting for a reply, **Then** no additional out-of-hours notice is needed (Ulises is expected to be reachable in this window).
4. **Given** an escalation happens outside the 10:00–15:00 window, **When** the agent hands off, **Then** the agent tells the prospect when they can expect to be contacted (the next start of the 10:00–15:00 window).
5. **Given** a conversation has been escalated, **When** the prospect sends additional messages, **Then** the agent does not respond automatically to them.
6. **Given** the WhatsApp alert to Ulises fails to send, **When** the email to `admin@nexoru.ai` is confirmed sent, **Then** the escalation is still considered delivered and the conversation still stops receiving automated replies.

---

### User Story 3 - Answer questions about the prospect's own proposal (Priority: P3)

A prospect with a valid, resolved reference asks the agent something about the solution proposal the wizard already gave them (e.g. what's included, the price, what happens next). The agent answers using that prospect's own session data, without regenerating, re-evaluating, or altering the proposal itself.

**Why this priority**: This is a value-add on top of the core reference-confirmation flow (P1) — it depends on a resolved session/reference already existing, and its absence wouldn't block launch, but it materially reduces how often a question ends up escalated to Ulises unnecessarily.

**Independent Test**: Can be fully tested by messaging from a phone number linked to an existing session with a completed proposal, asking a question about that proposal, and confirming the answer reflects that session's actual stored data (package, price, scope) rather than generic or fabricated content.

**Acceptance Scenarios**:

1. **Given** a prospect with a resolved reference asks about their proposal, **When** the agent answers, **Then** the answer is grounded in that prospect's own stored session data (package name, price, scope) and does not contradict it.
2. **Given** a prospect asks something that isn't answerable from their stored session data — whether it's about their own case or a general question about NEXORU's process — **When** the agent cannot ground an answer in that data, **Then** it treats this as a stuck point subject to the same escalation threshold as User Story 2, rather than guessing or answering generically.

---

### User Story 4 - Redirect prospects without a valid reference to the wizard (Priority: P4)

Someone messages the WhatsApp test number without a valid meeting reference — a new prospect, a mistyped reference, or someone who never went through the wizard. Instead of attempting to qualify or converse with them itself, the agent replies with a link to the onboarding wizard.

**Why this priority**: This keeps the agent from silently doing the wizard's job (qualification) and instead funnels the person to the system responsible for it; it is simple and low-risk, so it is the last priority to implement even though it must exist before launch to avoid the agent going silent on anyone without a reference.

**Independent Test**: Can be fully tested by messaging the test number with no reference at all, or with one that matches nothing, and confirming the reply is a link to the wizard rather than an attempt at qualification or conversation.

**Acceptance Scenarios**:

1. **Given** a message contains no meeting reference, **When** the agent processes it, **Then** the reply is a link to the onboarding wizard, not a qualifying question.
2. **Given** a message contains a reference that does not match any existing appointment, **When** the agent processes it, **Then** the reply is the same wizard-link redirect, not an attempt to keep troubleshooting the reference conversationally.

---

### Edge Cases

- What happens when WhatsApp redelivers the same inbound message (e.g., due to a network retry)? The agent MUST recognize it as a duplicate and must not process it or reply to it a second time.
- What happens when a prospect sends an unsupported message type (image, voice note, video, document, sticker, location)? The agent MUST reply explaining that it cannot process that type of message and what the prospect should send instead, rather than staying silent.
- What happens when a prospect returns to a stale, already-resolved conversation days later? The agent MUST resume using the previously resolved reference/session rather than asking the prospect to identify themselves again.
- What happens when a prospect who was already escalated tries to re-engage the agent directly? The agent MUST remain silent in that conversation until a human resumes it or hands it back.
- What happens when a prospect sends several messages in a quick burst before the agent replies? The agent MUST wait a short pause and reply once to the combined messages instead of sending a separate reply to each one.
- What happens when the same reference is messaged from a phone number other than the one on file? Per FR-023, the agent MUST treat this as a stuck point (escalation-worthy) rather than confirming appointment or proposal details to an unverified sender.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST receive and respond to messages sent by prospects to the NEXORU WhatsApp test number.
- **FR-002**: The system MUST send an initial response to each new inbound prospect message within 10 seconds under normal operating conditions, measured from the last message of a burst when the prospect sends several messages in quick succession (see FR-018).
- **FR-003**: The agent MUST conduct the entire conversation in Mexican Spanish, in the same warm, brief, emoji-forward tone documented in `docs/legacy/`.
- **FR-004**: The system MUST retain each prospect's conversation context so that a prospect who returns hours or days later can continue without re-identifying themselves.
- **FR-005**: The system MUST validate an inbound meeting reference against NEXORU's own records (not ManyChat's or Zapier's) to determine whether it corresponds to a real, currently booked appointment.
- **FR-006**: When a reference resolves to a booked appointment for a verified sender (see FR-023), the system MUST confirm the appointment's date, time, reference, and joining link back to the prospect.
- **FR-007**: When a reference resolves to an appointment that is cancelled, completed, or otherwise not upcoming, the system MUST tell the prospect its actual status rather than confirming it as if it were still scheduled.
- **FR-008**: When a message contains no meeting reference, or one that does not match any existing appointment, the system MUST reply with a link to the onboarding wizard instead of attempting to qualify or converse with the sender.
- **FR-009**: For a verified sender (see FR-023) with a resolved reference, the system MUST be able to answer questions about that prospect's own solution proposal using their stored session data, without regenerating or altering the proposal, and MUST NOT answer any question — including a general question about NEXORU's process — that isn't grounded in that stored data.
- **FR-010**: The system MUST escalate a conversation to Ulises whenever the prospect explicitly asks to speak with a human.
- **FR-011**: The system MUST escalate a conversation to Ulises whenever the agent fails to make progress on the same stuck point after 2 consecutive attempts (including being unable to ground an answer in the prospect's session data, per FR-009).
- **FR-012**: On escalation, the system MUST attempt to notify Ulises via both a WhatsApp message (Meta utility template) to his personal number and an email to `admin@nexoru.ai`, both summarizing the prospect and the conversation. The email is the reliable fallback: the escalation MUST be considered delivered once the email is confirmed sent, even if the WhatsApp alert fails (e.g., template undelivered).
- **FR-013**: On escalation, the system MUST mark the conversation as "atendida por humano" and MUST stop sending automated replies to it until a human resumes it or explicitly hands it back to the agent.
- **FR-014**: When an escalation occurs outside NEXORU's human attention hours (10:00–15:00), the system MUST tell the prospect when they can expect to be contacted, instead of leaving them without any response.
- **FR-015**: The system MUST detect duplicate inbound messages (e.g., retried deliveries of the same message) and MUST process and respond to each unique message only once.
- **FR-016**: When a prospect sends a message in a format the agent does not support, the system MUST reply explaining that the format is not supported and what the prospect should send instead.
- **FR-017**: The system MUST record, for every prospect conversation, enough information (resolved reference, questions answered, escalation status) for the NEXORU team to review the interaction afterward.
- **FR-018**: When a prospect sends multiple messages in quick succession before the agent has replied, the system MUST wait a short pause and reply once to the combined messages rather than replying separately to each one.
- **FR-019**: The system MUST operate solely against the WhatsApp test number designated for this phase and MUST NOT alter behavior on, or otherwise affect, the current production NEXORU WhatsApp number (+52 55 8648 8746).
- **FR-020**: The system MUST NOT depend on ManyChat or Zapier for any part of reference validation, appointment confirmation, proposal Q&A, or escalation.
- **FR-021**: The system MUST handle prospect personal data (e.g., phone number, name) in stored records and logs in a way that protects prospect privacy and avoids unnecessary exposure of that data.
- **FR-022**: The system MUST retain a prospect's conversation and interaction data for 90 days after the conversation's last activity, after which it MUST be deleted or archived out of the active dataset. This retention/deletion rule applies only to this feature's own conversation records; it MUST NOT delete or otherwise touch any wizard-owned data (`OnboardingSession` and its related tables) — this feature only ever reads that data, per FR-009's and the Assumptions' existing read-only constraint.
- **FR-023**: The system MUST verify that an inbound message's sender phone number matches the phone number on file for the resolved reference before confirming appointment details (FR-006) or answering proposal questions (FR-009); a mismatch MUST be treated as a stuck point subject to the escalation threshold in FR-011.
- **FR-024**: The system MUST mask prospect phone numbers before they appear in any application log line this feature writes (constitution Principle V), independent of how they're stored in the database itself.
- **FR-025**: The system MUST record token usage and an estimated cost for every AI adapter call this feature makes, in a way that can be summed by calendar month (constitution Principle IV) — this is what SC-003's cost comparison against the $600/month baseline is measured from.

### Key Entities

- **Prospect**: A person messaging NEXORU via WhatsApp, already known to the system through the wizard. Key attributes: contact identifier (phone number), name, the meeting reference their conversation resolves to (if any), escalation status.
- **Conversation**: The ongoing exchange of messages between a prospect and the agent. Key attributes: message history, last activity time, current stage (awaiting a valid reference, confirmed, answering proposal questions, escalated), the resolved reference it's linked to (if any).
- **Referenced Appointment**: The existing booked appointment (owned and created by the wizard, not by this feature) that a validated reference resolves to, including the phone number the wizard recorded for it. This agent reads and confirms the appointment, and checks the inbound sender against that recorded phone number (FR-023); it does not create, reschedule, or cancel the appointment.
- **Referenced Proposal**: The existing solution proposal (owned and created by the wizard, not by this feature) tied to a prospect's session, used to ground answers in User Story 3. This agent reads it; it does not regenerate or alter it.
- **Escalation**: A record of a conversation being handed off to Ulises. Key attributes: reason (explicit human request vs. agent unable to resolve), timestamp, whether it occurred inside or outside human attention hours, associated conversation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of inbound prospect messages receive a first agent response within 10 seconds.
- **SC-002**: 100% of reference validations and appointment confirmations on the WhatsApp test number are handled by NEXORU's own systems, with zero calls to ManyChat or Zapier.
- **SC-003**: NEXORU's combined ManyChat + Zapier spend for this flow drops from the current ~$600 USD/month baseline (see `docs/respuestas-preguntas-abiertas.md`, question 6) to $0/month once this feature fully replaces them, measured against this feature's own AI cost as recorded per FR-025 (summed by month) plus any remaining Meta messaging fees.
- **SC-004**: A prospect who pauses mid-conversation and returns up to 7 days later can continue without re-identifying themselves, verified in at least 95% of test cases.
- **SC-005**: 100% of conversations where a prospect asks for a human, or where the agent cannot resolve the request, result in a confirmed email to `admin@nexoru.ai` (with the WhatsApp alert attempted alongside it) and automated replies stopping in that conversation.
- **SC-006**: 100% of escalations that occur outside the 10:00–15:00 window include a message to the prospect stating when they'll be contacted.
- **SC-007**: 0% of duplicate inbound messages result in a duplicate agent reply.
- **SC-008**: 100% of unsupported message types receive an explanatory reply rather than no response.
- **SC-009**: 100% of messages without a valid reference receive the wizard link rather than a qualifying question.
- **SC-010**: 0% of appointment or proposal details are confirmed to a sender whose phone number doesn't match the one on file for that reference.
- **SC-011**: 100% of this feature's own conversation records older than 90 days since last activity are deleted or archived, and 0% of wizard-owned data is ever touched by that process.

## Assumptions

- Human attention hours (10:00–15:00) are in NEXORU's operating timezone, `America/Mexico_City`, consistent with `GOOGLE_MEETING_DEFAULT_TIMEZONE` used elsewhere in this codebase.
- "Ulises" is the sole human escalation point for this phase. His WhatsApp Business number is the same personal number that receives the Meta utility-template escalation alert (coexistence between the automated agent and his manual replies on one number); per `docs/respuestas-preguntas-abiertas.md` question 8, this number's eligibility for that coexistence with Meta still needs to be confirmed during planning.
- Once a conversation is escalated, it remains paused until a human manually resumes or hands it back — there is no automatic timeout that reactivates the agent.
- The $600 USD/month figure (question 6) is a combined monthly baseline across OpenAI, ManyChat, and Zapier, not a per-conversation cost; it is used here purely as the line to measure this migration's savings against.
- The wizard (not this feature) owns qualification, proposal generation, scheduling, and payment; this feature only reads that data (reference, session, proposal) to confirm and answer questions. Any change to how the wizard qualifies, proposes, schedules, or hands off the `wa.me` reference to WhatsApp is out of scope here and belongs to specs 002 and 003.
- Payments are entirely out of scope for this feature; the agent never discusses, collects, or references payment status beyond what the wizard has already communicated.
- `abe.nexoru.ai` is a separate, unrelated product and is out of scope entirely.
- This phase runs exclusively against the WhatsApp test number provided by Meta; no changes are made to the production number.
