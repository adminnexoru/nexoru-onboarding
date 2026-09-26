# Phase 0 Research: NEXORU WhatsApp Follow-up Agent

Each section resolves one open decision from the plan input. Where a fact depends on Meta/Vercel/Anthropic pricing or policy that can change, that dependency is called out explicitly rather than stated as settled — implementation should re-verify it against the current published terms before the cutover, not trust this document as a permanent source.

## 1. Cutover of +52 55 8648 8746 from ManyChat to the Meta app

**Decision**: Cutover is a Phase 2 activity, not built by this plan — but the sequence to follow when it happens is:

1. Finish all Phase 1 validation against the Meta **test number** (already provisioned per the spec) until the agent has handled real-shaped conversations (reference validation, confirmation, proposal Q&A, escalation, business-hours notice) with no unresolved defects.
2. In Meta Business Suite / WhatsApp Manager, disconnect the production number `+52 55 8648 8746` from ManyChat's app connection (this requires ManyChat's cooperation or Business Manager admin access to revoke ManyChat's system-user permission on that phone number) and register it under NEXORU's own app instead. A phone number can only be registered to one Cloud API app at a time, so this is a hard cutover moment, not a gradual one.
3. Schedule the cutover inside the 10:00–15:00 human attention window (spec FR-014) so Ulises can supervise and respond manually if the registration change causes a few minutes of message delay (Meta's own docs note registration changes can briefly interrupt delivery).
4. Immediately after cutover, send a manual test message to the production number and confirm the new webhook receives it before considering the cutover complete.
5. **Rollback plan**: do not cancel the ManyChat subscription before or during cutover (see decision 8). If the new webhook misbehaves, re-registering the number back to ManyChat's connection reverses the cutover; keep the ManyChat flow definitions untouched (not deleted) and `docs/legacy/` as a reference of exactly what they did.

**Rationale**: The spec is explicitly Phase 1 / test-number-only (FR-019); documenting the cutover procedure now, without executing it, satisfies "todo se valida con el número de prueba" while leaving a concrete runbook for later.

**Alternatives considered**: A "soft" parallel run (both ManyChat and the new webhook receiving the same number simultaneously) — rejected, because Meta does not support two Cloud API/BSP connections receiving the same number's messages at once; the underlying WhatsApp Business Platform routes each number to exactly one webhook target.

## 2. Coexistence eligibility (WhatsApp Business app + Cloud API, same number)

**Decision**: Assume Meta's "Coexistence" feature (WhatsApp Business app linked to the Cloud API on the same number, so Ulises keeps using the WhatsApp Business app for manual replies while the Cloud API serves the automated agent) is the target model — but **treat its eligibility as unverified** until confirmed directly in Meta Business Suite for this specific number and WABA at cutover time. Coexistence has historically had rollout/region/account-tier gating that isn't fully controllable from documentation alone.

**Action required before cutover** (not before this plan): in Meta Business Suite, check whether the production WABA is offered the "Business app + Cloud API coexistence" option; if not offered, the fallback is that Ulises's manual replies happen from a *different* channel (e.g., a WhatsApp Business app on a different number, or purely through this app's own admin surface) rather than the same number — which would change spec Assumption "Ulises answers from WhatsApp Business on that same number" and should trigger a spec amendment at that point, not a silent workaround.

**Rationale**: This is a real Meta account-configuration fact, not something resolvable by reading code or writing more spec — it needs to be checked against the live Meta dashboard for this specific number.

**Alternatives considered**: Route Ulises's manual replies through a second, dedicated number — rejected as the default because it would require prospects to potentially see a different number reply than the one they messaged, a worse experience than what ManyChat already provides today (single number, per `docs/legacy/`). Kept as the documented fallback, not the plan.

## 3. Hosting: consolidate the two Vercel projects, stay on Pro

**Decision**: Stay on Vercel (Pro tier, required for commercial use), and **consolidate `nexoru-landing` and `nexoru-onboarding` into a single Vercel project** with both `nexoru.ai` and `app.nexoru.ai` attached as domains on it.

**Rationale**: Both Vercel projects already build from this exact same GitHub repository — confirmed by every PR in this session triggering both `Vercel – nexoru-landing` and `Vercel – nexoru-onboarding` checks off the same commit. `app/page.tsx` already does its own host-based routing (`resolveAppHost()`) to decide whether to render the marketing page or redirect to `/onboarding/start` — that logic only makes sense if one deployment is meant to serve both domains. Running it as two separate Vercel projects today means paying for and managing two projects' worth of build minutes, environment variables, and deployment history for code that is byte-for-byte identical. Consolidating is a **domain reassignment in the Vercel dashboard**, not a code or architecture change — low effort, and it directly reduces cost (half the projects, half the redundant builds) rather than requiring a cost/benefit tradeoff against a new dependency.

**Cost/effort vs. a free alternative**: A free-tier host (e.g., Cloudflare Pages, Netlify free, Railway free) was considered and rejected for this migration specifically because it would mean re-platforming a working Next.js App Router app with Server Components, Prisma, and long-running webhook handling — real engineering effort — to save money that consolidating the existing Vercel setup already saves without touching any code. This is squarely the "no se agregan capas de abstracción... sin necesidad demostrada" clause in Calidad y Flujo de Entrega: there is no demonstrated need to leave Vercel.

**Note**: Vercel Pro's exact price should be re-verified at purchase time (subscription pricing pages change); it should not gate this decision since the project already appears to require Pro today for commercial use regardless of this feature.

## 4. Preview/test database: Neon free tier

**Decision**: Provision a **Neon Postgres** project connected via the Vercel Marketplace integration, using Neon's branch-per-preview capability so every Vercel preview deployment (including PRs for this feature) gets its own disposable database branch instead of touching the production Supabase project or one of Supabase's limited free-project slots.

**Rationale**: Supabase's free tier caps the number of free projects per organization, and the production project (`appnexoru`) already occupies one — spinning up a second Supabase project for previews would either cost money or compete for that limited free slot. Neon's free tier is generous enough for a low-traffic preview database and its Vercel-native integration automatically provisions/tears down a branch per preview deployment, which is a better fit than manually managing one shared "staging" database (shared staging DBs get stale/dirty across concurrent PRs). Neon has no Supabase-style auto-exposed `anon`/`authenticated` REST API, so RLS isn't load-bearing there the way it is on Supabase — but the migration history still needs to *apply* cleanly there, which required fixing a real problem (below), not just assuming it.

**Verified problem — migrations do NOT apply harmlessly on a clean, non-Supabase Postgres.** Tested directly: spun up a disposable local Postgres cluster with no prior setup and ran `prisma migrate deploy` for all 10 existing migrations against it. Migration 10 (`20260925021002_enable_rls_public_schema`) failed with `ERROR: role "anon" does not exist` — and after creating just `anon`/`authenticated`/`service_role`, it failed a second time with `ERROR: role "postgres" does not exist`, because the same migration also runs `ALTER DEFAULT PRIVILEGES FOR ROLE postgres ...`. Neither role name is anything special to vanilla Postgres — they only exist on Supabase because Supabase's platform bootstraps them; a fresh Neon branch never had that bootstrap run, so both statements reference roles that simply aren't there.

**Decision on the fix**: create the missing roles (`postgres`, `anon`, `authenticated`, `service_role`) as inert, `NOLOGIN`, no-privilege placeholders **when preparing a non-Supabase database**, via a small idempotent bootstrap script run once before `prisma migrate deploy` — not by editing the already-applied migration file. Editing that file's SQL after the fact was considered and rejected: Prisma records a checksum of each migration file when it's applied, and `20260925021002_enable_rls_public_schema` is already applied on production (Supabase, via PR #4) — changing its content would create a checksum mismatch that breaks `prisma migrate deploy`/`status` on production until manually reconciled with `prisma migrate resolve`, a production-affecting operation this decision has no reason to force. Creating the roles up front sidesteps that entirely: once they exist, the migration's `REVOKE`/`ALTER DEFAULT PRIVILEGES` statements against them become harmless no-ops (there was never anything granted to revoke on a fresh Neon branch anyway), and no migration file changes.

The bootstrap script (idempotent — safe to run against a database that already has some or all of these roles, e.g. if Neon's own template ever includes a `postgres` role):

```sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
END
$$;
```

**Verified fix**: re-ran the same test — reset the clean database, applied this bootstrap script, then ran `prisma migrate deploy` for all 10 migrations. All 10 applied successfully, `prisma migrate status` reported "Database schema is up to date!", and a direct query confirmed 20/20 tables have `relrowsecurity = true`, matching production exactly. Also confirmed the bootstrap script is idempotent (ran it twice back-to-back with no error) so it's safe to include as a standard step for every fresh Neon branch, not just the first one.

**Task-list implication (for `/speckit-tasks`, not built here)**: this bootstrap script should ship as a checked-in file (e.g. `prisma/bootstrap-non-supabase-roles.sql`) and be documented as a required one-time step per new Neon branch/database — either run manually or wired into whatever provisions the branch — before `prisma migrate deploy` runs against it. It is **not** needed against the production Supabase database, which already has these roles.

**Alternatives considered**: Editing the already-applied migration to wrap its `anon`/`authenticated`/`postgres` references in existence checks — rejected for the checksum/production-drift reason above; a second Supabase project for previews — rejected due to the free-project ceiling; a shared long-lived staging Postgres — rejected because concurrent preview branches would corrupt each other's WhatsApp conversation test data, defeating the purpose of testing in isolation.

## 5. Burst-message grouping in serverless

**Decision**: The webhook handler acknowledges Meta with `200` **immediately**, before any debounce wait — it never makes Meta's delivery wait on the pause. The "wait a short pause, then reply once" behavior (spec FR-018) runs *after* that response, inside the same invocation, using Next.js's [`after()`](https://nextjs.org/docs/app/api-reference/functions/after) API (`import { after } from "next/server"`), coordinated through a row in Postgres — no external queue/scheduler service.

Mechanism: on each inbound message, the handler (a) does the fast, required-before-replying work — signature check, idempotency check on `messages[].id`, upsert the `WhatsAppConversation` buffer with an incremented `bufferVersion` and the message appended — then (b) returns `200` to Meta, and (c) registers an `after()` callback that sleeps ~2–3 seconds, re-reads the row, and only proceeds to compose+send the combined reply if `bufferVersion` hasn't advanced past what it read (i.e., no newer message arrived during the wait — if one did, a *later* invocation's `after()` callback is the one responsible, and this one exits silently).

**Why `after()` specifically, not a bare `setTimeout`/sleep before responding**: without it, the function would hold Meta's HTTP request open for the full debounce window on every single message, which is unnecessary latency on Meta's side and works against the point of acknowledging quickly; `after()` is the supported, documented way in Next.js to run code once the response has already been sent, on the same Node.js runtime this app already uses (no Edge runtime requirement, no separate worker).

**Vercel Pro function duration limit — confirmed**: Vercel's function execution timeout defaults to **300 seconds** on all current plans (Fluid Compute), a large increase from the older 60–90s limits. A 2–3 second `after()` wait is a trivial fraction of that budget, with ample headroom even for a slower Claude call afterward. This should still be spot-checked against Vercel's current published limits at implementation time, since platform limits can change, but at 300s there's no meaningful risk of the debounce+reply work exceeding it at this feature's expected message sizes.

**Rationale**: Zero new infrastructure — no queue, no cron, no third-party scheduler — matching the "simplest solution" clause in Calidad y Flujo de Entrega and avoiding a new paid dependency under Minimal Operational Cost, while still returning `200` to Meta promptly instead of holding its request open. The correctness-critical part is the atomic version check (a single `UPDATE ... RETURNING` or equivalent, not read-then-write) so two concurrent invocations can't both decide they're "the latest."

**Alternatives considered**: Upstash QStash (or a similar delayed-delivery queue) scheduling a callback at T+3s — a clean, well-tested pattern, but rejected for Phase 1 because it adds a new external paid service (even if its free tier would cover this volume) for something achievable with `after()` plus the database already in use. Revisit if Phase 1 testing shows the in-process approach causing reliability issues at higher volume. A bare pre-response sleep (no `after()`) — rejected because it needlessly delays Meta's own acknowledgment on every message instead of only delaying the reply.

## 6. Prompt injection defense and per-number usage limits

**Decision**:

- **Reference and phone-number extraction/matching (FR-023) happen in deterministic code, never via the model.** The `NXR-SES-YYMMDD-XXXX` pattern is fixed and regex-matchable; extracting it and checking it against `OnboardingMeeting.contactWhatsappSnapshot` is plain code, not something an LLM is asked to parse or judge — this removes an entire class of injection risk (a prospect can't talk the model into "confirming" a reference that doesn't regex-match or a phone that doesn't match the stored one, because the model is never in that decision path).
- **Claude's role is scoped to two narrow, schema-constrained calls**: (1) classify the inbound message's intent into a fixed enum (`confirm_reference`, `ask_about_proposal`, `request_human`, `unsupported`, `unclear`) and (2) compose the natural-language reply text *strictly from fields the caller already fetched from the database* (appointment date/time/reference/link, or proposal package/price/scope) — never asked to invent, look up, or decide on data it wasn't handed. Grounding in FR-009 is enforced this way: the composition prompt receives only the literal DB fields to phrase, so there's nothing to "answer generically" from.
- **The system prompt treats the prospect's message as untrusted user content** (standard prompt hygiene: instructions live in the system role and are never re-derived from user text), but this is a secondary layer — the primary defense is architectural (deterministic extraction + schema-constrained, data-scoped model calls), consistent with the general principle that prompt wording alone is not a reliable security boundary.
- **Per-number rate limit**: cap inbound messages processed per phone number at a fixed threshold (recommend starting at 20/hour, tunable) via a simple `COUNT(*)` query over recent inbound messages for that number — no Redis/Upstash rate limiter needed at this volume (Minimal Operational Cost). Exceeding the limit is treated as a stuck point and escalated (consistent with FR-011's existing escalation semantics) rather than silently dropped, so a real prospect is never simply ignored.

**Rationale**: Ties directly to spec FR-009's grounding requirement and to Principle V. Keeping the model out of the extraction/decision path for anything security- or data-access-relevant means a successful prompt injection can, at worst, produce an oddly-worded reply — it cannot make the agent confirm someone else's appointment or leak someone else's proposal, because those decisions never touch the model.

**Alternatives considered**: A general-purpose "prompt injection classifier" pre-filter — rejected as unnecessary given the architectural approach above already removes the attack surface those classifiers exist to catch; adding one would be exactly the kind of unjustified extra layer Calidad y Flujo de Entrega warns against.

## 7. Estimated monthly cost of the new stack vs. the $600 baseline

**Decision**: Expect the new stack's *incremental* cost (excluding Vercel Pro, which is a pre-existing/parallel requirement, not net-new spend caused by this feature) to land well under $50/month at Phase 1's expected volume, against the ~$600/month baseline (`docs/respuestas-preguntas-abiertas.md`, question 6) that this feature is meant to eliminate entirely once fully cut over (spec SC-003).

**Assumptions behind that estimate** (all flagged for re-verification, not treated as fixed):

- Volume: tens to low hundreds of WhatsApp conversations/month during the test-number phase (matches spec Scale/Scope).
- Claude usage: Haiku-class model for both intent classification and reply composition (constitution Principle IV), roughly 2–4 short calls per conversation (a few hundred to ~1–1.5k input tokens, ~100–300 output tokens each, since prompts are short and grounded in already-fetched DB fields, not long documents). At this volume and call size, raw model cost is a small fraction of the baseline being replaced — a precise figure requires checking Anthropic's current published Haiku pricing at implementation time, since it can change.
- Meta Cloud API fees: **Meta announced a change to how WhatsApp messages are billed effective October 1, 2026** (visible directly in `docs/legacy/Captura desde 2026-09-24 15-58-32.png`'s in-app banner) — since that date has already passed or is imminent relative to this plan, the actual per-message/per-template cost for the utility-template escalation alerts to Ulises MUST be checked against Meta's current published rate card before finalizing a cost projection, not assumed from pre-October pricing.
- Neon: $0 (free tier, decision 4).
- Vercel Pro: treated as already-decided overhead (decision 3), not attributed to this feature's incremental cost.

**Rationale**: Even with generous padding on every assumption above, the combined new spend is a small fraction of $600/month — the dominant source of estimate uncertainty is Meta's Oct-2026 billing change, which should be re-checked, not the Claude or Neon costs.

**Alternatives considered**: None — this is a cost estimate, not a build decision.

## 8. ManyChat/Zapier retirement plan

**Decision**: Do not cancel either subscription until all of the following are true:

1. The production number cutover (decision 1) is complete and the new webhook has handled 100% of real traffic for a defined burn-in period (recommend 2–4 weeks) with no unresolved incidents.
2. No appointment or reference created under the old ManyChat/Zapier flow is still "in flight" (since the reference format is unchanged and shared, this is really just "let existing conversations naturally finish," not a data-migration concern).
3. Ulises confirms he has fully switched to relying on the new escalation path (WhatsApp utility template + email) and no longer needs ManyChat's own notification behavior.

**Retirement sequence** (once the above hold): pause (don't delete) the Zapier zap first and monitor for a short period; only after that period shows no missed confirmations, downgrade/cancel the Zapier plan; then cancel the ManyChat subscription. Export/archive the ManyChat flow structure and the Zapier zap's step list before final cancellation — `docs/legacy/` already captures this, but a fuller export (e.g., ManyChat's own flow-export feature, if available) is worth doing at that point for institutional memory. Time the cancellation to the subscription's renewal date where possible to avoid losing already-paid time.

**Rationale**: Pausing before cancelling keeps a same-day rollback available without re-subscribing; a fixed burn-in period prevents declaring victory before the new flow has proven itself under real traffic.

**Alternatives considered**: Cancelling immediately at cutover — rejected as too risky given this is a customer-facing scheduling confirmation flow; a broken confirmation could mean a prospect misses their discovery call.
