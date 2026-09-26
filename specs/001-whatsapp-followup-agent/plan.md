# Implementation Plan: NEXORU WhatsApp Follow-up Agent (Phase 1 — Test Number)

**Branch**: `001-whatsapp-followup-agent` | **Date**: 2026-09-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-whatsapp-followup-agent/spec.md`

## Summary

Replace ManyChat + Zapier's "Busca Agenda"/"Confirma Agenda" flows with a self-hosted WhatsApp Cloud API webhook, added as a new route in the existing Next.js app. The agent validates the `NXR-SES-` meeting reference already embedded in the wizard's unchanged `wa.me` deep link, confirms the appointment (reusing the existing `OnboardingMeeting`/Google Calendar data), answers proposal questions strictly from the prospect's own stored `OnboardingPackageRecommendation`, redirects anyone without a valid, phone-matched reference to the wizard, and escalates to Ulises (WhatsApp utility template + email) outside what the agent can ground in stored data. A single Claude-based adapter (Haiku for both classification and reply composition) drives the conversational parts; reference/phone matching, business-hours logic, and escalation state are deterministic code, not model output.

## Technical Context

**Language/Version**: TypeScript (strict mode), Next.js 16 (App Router), Node.js runtime on Vercel — matches the existing repo exactly; no new runtime.

**Primary Dependencies**: Existing: `@prisma/client`/`@prisma/adapter-pg`, `googleapis`, `zod`, `pg`. New: none required — Claude is called via `fetch` against the Messages API (see research.md, "AI adapter transport"), matching this repo's existing raw-`fetch` pattern for OpenAI in `lib/services/package-recommendation.ts` rather than adding an SDK dependency. Meta webhook signature verification uses Node's built-in `crypto` (HMAC-SHA256), no new dependency.

**Storage**: Postgres via Prisma. Production: the existing Supabase project (`appnexoru`) — same database, new tables. Preview/test: a separate Neon Postgres branch per Vercel preview deployment (see research.md, decision 4) so webhook testing never touches production conversation data.

**Testing**: Vitest (existing, already configured — `lib/config/urls.test.ts`, `app/api/onboarding/package-recommendation/route.test.ts` are the established pattern). Per the constitution's Calidad y Flujo de Entrega section, the WhatsApp webhook, the confirmation/scheduling read path, and the escalation flow all require test coverage — non-negotiable for this feature.

**Target Platform**: Same Vercel deployment(s) as today (see research.md, decision 3, on consolidating the two Vercel projects). The webhook is one more Next.js API route (`app/api/whatsapp/webhook/route.ts`), not a new service.

**Project Type**: Web service (Next.js API route added to the existing single-repo app) — no new project, no new repo.

**Performance Goals**: First reply within 10s (spec SC-001), measured from the last message of a debounced burst (spec FR-018/FR-002). Meta expects a webhook to acknowledge quickly or it will retry the delivery — message_id-based idempotency (already required by the user's brief) covers that retry behavior regardless of processing time.

**Constraints**: No ManyChat/Zapier dependency for any part of this flow (Principle II, spec FR-020). Every new table's migration MUST enable RLS (Principle V, constitution v1.1.0). Single AI adapter, cheapest model per task (Principle IV). The wizard's `wa.me` link and `NXR-SES-YYMMDD-XXXX` reference format MUST NOT change (explicit input constraint — the link is generated today in `app/onboarding/schedule-confirmation/page.tsx` and the format in `lib/services/onboarding-meeting.ts`). WhatsApp is never the place that qualifies or proposes (Principle VI).

**Scale/Scope**: Phase 1, test-number only. Low volume (tens to low hundreds of conversations/month) — this bounds several decisions in research.md (burst-handling approach, rate-limit thresholds, cost estimates) toward the simplest option rather than one built for scale that doesn't exist yet.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — see bottom of this section.*

| Principle | Check | Result |
|---|---|---|
| I. Minimal Operational Cost | New paid surfaces: Claude API (usage-based, offsets the $600/mo baseline being eliminated — spec SC-003), Neon free tier (preview DB), Vercel Pro (pre-existing requirement for commercial use, not newly introduced by this feature). No unjustified new SaaS. | PASS — cost/benefit captured in research.md decisions 3, 4, 7 |
| II. Comunicación Directa, Sin Intermediarios | This feature *is* the direct-webhook replacement for ManyChat/Zapier; no intermediary introduced. | PASS |
| III. Supabase Como Única Fuente de Verdad | Production conversation/escalation data lives only in the existing Supabase project via Prisma. Neon is preview-only and never holds real prospect data — it is not a second source of truth, it's a disposable test fixture. | PASS |
| IV. Adaptador Único de IA | One `lib/ai/adapter.ts` module for every Claude call in this feature; model choice (Haiku) justified per-task in research.md. | PASS |
| V. Seguridad y Privacidad por Defecto | Meta signature validation (research.md), message_id idempotency, RLS enabled on every new table's migration (data-model.md), phone numbers masked in logs (data-model.md). | PASS — see explicit mitigations, no gaps deferred |
| VI. El Wizard Como Único Punto de Calificación y Propuesta | The entire feature is scoped around never qualifying/proposing (spec FR-008/FR-009); this is the principle the spec was rewritten to satisfy. | PASS |
| Calidad y Flujo de Entrega | TypeScript strict (already repo-wide), tests required for webhook/confirmation/escalation (planned in quickstart.md and tasks), feature branch + PR + preview (already this repo's workflow), simplest solution preferred (in-process debounce over a new queue service, `fetch` over a new SDK — both decided in research.md over the more complex alternative). | PASS |

**Post-Phase-1 re-check**: See "Constitution Re-check" at the end of this document, after data-model.md and contracts/ were drafted.

## Project Structure

### Documentation (this feature)

```text
specs/001-whatsapp-followup-agent/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── whatsapp-webhook.md
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

No new project. New files land inside the existing single Next.js app:

```text
app/api/whatsapp/
├── webhook/
│   └── route.ts              # GET (Meta verification handshake) + POST (inbound messages)
└── — (no other new API routes; outbound sends happen from within the webhook handler)

app/whatsapp/escalations/[conversationId]/reply/
└── page.tsx                   # Plan B for coexistence (research.md, decision 2): Ulises's
                                # signed-link manual reply page, same send path as the agent

lib/whatsapp/
├── client.ts                  # Cloud API send-message calls (text messages, template messages)
├── signature.ts                # X-Hub-Signature-256 verification (node:crypto)
├── reference.ts                 # Deterministic NXR-SES-... extraction + phone normalization/match (FR-023)
└── business-hours.ts            # 10:00–15:00 America/Mexico_City window check (FR-014)

lib/ai/
└── adapter.ts                  # Single Claude adapter: classify intent, compose reply — both Haiku

lib/services/
└── whatsapp-conversation.ts    # Conversation/escalation state machine, burst-debounce claim logic

prisma/migrations/
└── <timestamp>_add_whatsapp_conversation/
    └── migration.sql            # New tables + RLS (see data-model.md)
```

**Structure Decision**: Single project (this repo), matching every prior feature in this codebase. No `backend/`/`frontend/` split, no new package — the WhatsApp webhook is one more API route alongside `app/api/onboarding/*` and `app/api/update-meeting/*`, using the same Prisma client, the same Google Calendar helper, and the same deployment.

## Constitution Re-check (post-design)

Re-evaluated after `data-model.md` and `contracts/whatsapp-webhook.md` were drafted:

- **V. Seguridad y Privacidad por Defecto**: `data-model.md` masks phone numbers in the `WhatsAppConversation` model's designed logging convention (last 4 digits only) and every new table's migration includes `ENABLE ROW LEVEL SECURITY`, matching the pattern already established in `20260925021002_enable_rls_public_schema`. No gap found.
- **IV. Adaptador Único de IA**: `contracts/whatsapp-webhook.md` confirms both Claude calls (intent classification, reply composition) route through the single `lib/ai/adapter.ts`; no other model call is introduced anywhere in the design.
- **VI.**: `data-model.md`'s `ReferencedProposal`/`ReferencedAppointment` read models are explicitly read-only projections of existing wizard-owned tables (`OnboardingPackageRecommendation`, `OnboardingMeeting`) — no new write path to either exists in this design.

No new violations. Complexity Tracking table below remains empty.

## Complexity Tracking

*No Constitution Check violations — table intentionally empty.*
