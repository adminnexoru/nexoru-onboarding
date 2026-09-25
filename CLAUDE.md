# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Next.js (App Router) app for Nexoru: a marketing landing page plus a multi-step client onboarding wizard that qualifies a prospect, recommends a package, collects payment, and books a Google Calendar session. Data is persisted in Postgres via Prisma. There is no authentication — onboarding sessions are identified by an opaque `sessionToken` stored in the browser's `localStorage`.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # prisma generate && next build
npm run lint     # eslint
```

There is no test suite configured in this repo.

Database (Prisma, Postgres):

```bash
npx prisma migrate dev --name <name>   # create + apply a migration in dev
npx prisma migrate deploy              # apply migrations (prod)
npx prisma generate                    # regenerate client (also runs on postinstall)
npx prisma db seed                     # runs prisma/seed.ts (packages, addons, goal options, recommendation rules)
```

`prisma.config.ts` points migrations/seed at `prisma/schema.prisma` and reads `DATABASE_URL`. Seeding (`prisma/seed.ts`) wipes and rebuilds the catalog tables (`Package`, `Addon`, `PackageAddon`, `GoalOption`, `PackageRecommendationRule`, include/exclude items) — it is destructive to that data, never to onboarding session data.

## Environment variables

Required (see `.env`, not committed): `DATABASE_URL`, `DIRECT_URL` (Postgres, via `@prisma/adapter-pg`), `OPENAI_API_KEY` (+ optional `OPENAI_MODEL`, defaults to `gpt-5-mini`), `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`, `GOOGLE_OAUTH_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`, `GOOGLE_MEETING_DEFAULT_TIMEZONE`, `NEXT_PUBLIC_NEXORU_WHATSAPP_NUMBER`, `INTERNAL_API_KEY` (shared secret for the `update-meeting` webhook).

Optional: `NEXT_PUBLIC_APP_URL` — the canonical origin of the onboarding app (e.g. `https://app.nexoru.ai`). Used by `lib/config/urls.ts`'s `appUrl(path)` helper to build the marketing site's CTA links (`components/landing/Hero.tsx`, `FinalCTA.tsx`, `Navbar.tsx`) and by `app/page.tsx` to derive which `Host` header should redirect `/` to `/onboarding/start`. When unset, `appUrl()` falls back to a relative path and the host check falls back to `"app.nexoru.ai"` — both matching current production behavior with no configuration required.

## Architecture

### Onboarding session model, not user auth

There are no user accounts. `POST /api/onboarding/session` creates an `OnboardingSession` row and returns a random `sessionToken` (`lib/onboarding-session.ts`). The client stores it via `lib/onboarding-storage.ts` (`localStorage`, key `nexoru_onboarding_session_token`) and sends it in the body of every subsequent onboarding API call. Every onboarding page loads the token on mount, redirects to `/onboarding/start` if it's missing, and fetches `GET /api/onboarding/session/[token]` to hydrate its state — there is no server-side session/cookie handling.

A **separate `[token]` under `/api/onboarding/schedule/[token]`** reuses the same `sessionToken` value but is the read endpoint for the schedule-confirmation page (fetches the booked meeting + session summary).

### Fixed 10-step wizard

Steps are hardcoded per-page as `step`/`totalSteps`/`progress` props passed into `<AppShell>` (`components/layout/AppShell.tsx`), in this order:

1. `/onboarding/start`
2. `/onboarding/business-profile`
3. `/onboarding/primary-goal`
4. `/onboarding/current-process`
5. `/onboarding/volume-operations`
6. `/onboarding/package-recommendation`
7. `/onboarding/scope-confirmation`
8. `/onboarding/payment`
9. `/onboarding/executive-summary`
10. `/onboarding/schedule-session` → `/onboarding/schedule-confirmation`

Each step page is a client component (`"use client"`) that: reads the token, fetches current session state, renders a matching `*PageSkeleton` while loading, renders a form/card component from `components/onboarding/`, POSTs to its matching route under `app/api/onboarding/*`, then `router.push`es to the next step. `OnboardingSession.currentStep` and `.status` (enum `OnboardingStatus`) are updated server-side on each step's POST, so the DB is the source of truth for resumability even though routing is client-driven. `lib/constants/routes.ts` only defines a few of these paths — most pages hardcode the next route inline rather than going through it.

### API response contract

Newer routes (`lib/api/responses.ts`, `lib/api/errors.ts`) use a consistent envelope: `apiOk(data)` → `{ ok: true, data }`, `apiError(code, message, status, details?)` / `apiErrorFromUnknown(error)` → `{ ok: false, error: { code, message, details? } }`, with `ApiRouteError` as the typed exception and `ApiErrorCode` as the closed set of error codes. Some older routes (e.g. `app/api/onboarding/session/route.ts`) predate this and hand-roll `NextResponse.json({ ok, ... })` directly — follow the `apiOk`/`apiError` pattern for any new or touched route instead of the ad hoc style.

Request/response payload shapes shared between API routes and the frontend are defined once as Zod schemas in `lib/contracts/onboarding.ts` (`serialized*Schema` for DB-shaped entities, `*RequestSchema`/`*ResponseSchema` per endpoint, with inferred TS types). `lib/validators/onboarding.ts` holds the input-validation schemas actually used inside route handlers (`safeParse` on the request body). When changing a step's payload, update both the request schema used for validation and the contract type so client and server stay in sync.

### Package recommendation

`lib/services/package-recommendation.ts` builds a deterministic fallback recommendation (rationale bullets + narrative "strategic analysis") from the session's business profile, goal, current process, and volume data, then tries to enhance it via an OpenAI Responses API call (`gpt-5-mini` by default) with a strict JSON schema. If `OPENAI_API_KEY` is missing, the call fails, or the response doesn't parse/validate, it silently falls back to the deterministic copy — `recommendationSource` in the response (`"openai"` | `"fallback"`) tells you which happened. Package selection itself (which `Package` row is "recommended") is driven by `PackageRecommendationRule` rows matched against goal + volume thresholds, not by the AI call.

### Google Calendar booking

`lib/google/calendar.ts` uses a single service-style Google account authenticated via a long-lived OAuth refresh token (`GOOGLE_OAUTH_REFRESH_TOKEN`) — not per-user OAuth. `app/api/google/oauth/start` and `.../callback` are the one-time flow used to mint that refresh token, not something end users go through. `POST /api/onboarding/schedule/book` checks for scheduling conflicts against **all** `OnboardingMeeting` rows (not just the current session's), creates a Google Calendar event with Meet conferencing, then persists an `OnboardingMeeting`. `lib/services/onboarding-meeting.ts` generates the human-readable `meetingReference` (`NXR-SES-YYMMDD-XXXX`) and the fixed onboarding timezone.

### ManyChat integration

`POST /api/update-meeting` is a webhook-style internal endpoint (auth via `x-nexoru-internal-key` header matched against `INTERNAL_API_KEY`) that lets an external system (ManyChat) attach a `manychatSubscriberId` to an `OnboardingMeeting` by its `meetingReference`. It intentionally does not use the `apiOk`/`apiError` envelope from `lib/api/responses.ts`.

### Prisma/DB notes

- Client is instantiated once in `lib/prisma.ts` using `@prisma/adapter-pg` over a `pg.Pool`, cached on `globalThis` in non-production to survive HMR.
- Money fields are `Decimal` in Postgres and come back as strings through the app layer (see the `z.string().nullable()` price fields in `lib/contracts/onboarding.ts`) — format with `Intl.NumberFormat` (see `formatRecommendationMoney`) rather than treating them as numbers.
- The onboarding domain is modeled as one `OnboardingSession` with a set of 1:1 child tables per wizard step (`OnboardingBusinessProfile`, `OnboardingPrimaryGoal`, `OnboardingCurrentProcess`, `OnboardingVolumeOperations`, `ScopeConfirmation`) plus 1:many tables (`OnboardingSecondaryNeed`, `OnboardingSelectedAddon`, `PaymentAttempt`) and a 1:1 `OnboardingMeeting`. All cascade-delete from `OnboardingSession`.
- Prisma connects to Supabase as the `postgres` role (`BYPASSRLS = true`), so Row Level Security has no effect on the app itself — it exists to lock down Supabase's auto-exposed REST/GraphQL Data API (`anon`/`authenticated` roles, which do not bypass RLS). Every table in `public` has RLS enabled with no policies (see migration `20260925021002_enable_rls_public_schema`), and default privileges are revoked so new tables are born with no grants to `anon`/`authenticated`. **Every migration that creates a table MUST include `ALTER TABLE "<Name>" ENABLE ROW LEVEL SECURITY;` for it.**
- Every table is created by a Prisma migration; never from the Supabase Table Editor. Tables created that way bypass the `postgres`-role default-privilege revocation above and would be born exposed to `anon`/`authenticated`.

### Frontend structure

- `components/landing/*` — marketing page sections used by `app/page.tsx`.
- `components/layout/*` — shared chrome: `AppShell` (wizard frame with progress bar + sidebar summary), `Header`, `ProgressBar`, `SidebarSummary`.
- `components/onboarding/*` — one `*Form`/`*Card` component plus a matching `*PageSkeleton` loading component per wizard step.
- Styling is Tailwind CSS v4 (`app/globals.css`) plus a dedicated `app/onboarding-ui.css` for wizard-specific styles, both imported from both `app/layout.tsx` and `app/onboarding/layout.tsx` (the onboarding section has its own nested root-style layout with its own `<html>`/`<body>` and metadata, separate from the marketing site's).
