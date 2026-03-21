import AppShell from "@/components/layout/AppShell";
import PrimaryGoalPageSkeleton from "@/components/onboarding/PrimaryGoalPageSkeleton";

export default function OnboardingLoading() {
  return (
    <AppShell
      step={1}
      totalSteps={5}
      progress={10}
      summary={{
        businessName: "Cargando...",
        industry: "Cargando...",
        goal: "Cargando...",
        packageName: "Cargando...",
      }}
      isLoading
    >
      <PrimaryGoalPageSkeleton />
    </AppShell>
  );
}