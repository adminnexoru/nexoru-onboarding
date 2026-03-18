import AppShell from "@/components/layout/AppShell";
import WelcomeCard from "@/components/onboarding/WelcomeCard";

export default function OnboardingStartPage() {
  return (
    <AppShell
      step={1}
      totalSteps={5}
      progress={10}
      summary={{
        businessName: "",
        industry: "",
        goal: "",
        packageName: "",
      }}
    >
      <WelcomeCard />
    </AppShell>
  );
}