-- Enable Row Level Security on every table in public, including
-- _prisma_migrations. Prisma connects as the `postgres` role, which has
-- BYPASSRLS = true, so this has zero effect on the application: its
-- queries never evaluate RLS regardless of how many policies exist (here,
-- zero). What changes is Supabase's auto-exposed REST/GraphQL Data API,
-- which authenticates as `anon` / `authenticated` (BYPASSRLS = false):
-- those roles currently hold full CRUD grants on every table below, and
-- go from full access to default-deny on every row once RLS is enabled
-- with no policies defined for them.

ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingBusinessProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingPrimaryGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingSecondaryNeed" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingCurrentProcess" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingVolumeOperations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Package" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PackageIncludedItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PackageExcludedItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Addon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PackageAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingSelectedAddon" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PackageRecommendationRule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingPackageRecommendation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ScopeConfirmation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GoalOption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OnboardingMeeting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Revoke the blanket CRUD grants Supabase applies by default to every
-- table/sequence/function in public for anon/authenticated. This is
-- belt-and-suspenders on top of RLS above: RLS with no policies already
-- default-denies every row, but this also removes the underlying table
-- privilege itself.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

-- Ensure any table/sequence/function created from now on by the
-- `postgres` role (i.e. every future Prisma migration) is born with no
-- privileges granted to anon/authenticated, instead of inheriting
-- Supabase's default public-schema grants.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON SEQUENCES FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated;
