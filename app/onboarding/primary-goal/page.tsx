"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PrimaryGoalSelector from "@/components/onboarding/PrimaryGoalSelector";
import PrimaryGoalPageSkeleton from "@/components/onboarding/PrimaryGoalPageSkeleton";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type GoalOption = {
  code: string;
  name: string;
  description: string | null;
};

type SessionResponse = {
  businessProfile: {
    commercialName?: string | null;
    industry?: string | null;
  } | null;
  primaryGoal: {
    primaryGoalCode: string;
    primaryGoalLabel: string;
  } | null;
  recommendedPackage: {
    name: string;
  } | null;
};

export default function PrimaryGoalPage() {
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState("");

  const [primaryGoals, setPrimaryGoals] = useState<GoalOption[]>([]);
  const [initialPrimaryGoalCode, setInitialPrimaryGoalCode] = useState("");
  const [initialRecommendedPackageName, setInitialRecommendedPackageName] =
    useState("");

  const [summary, setSummary] = useState({
    businessName: "Cargando...",
    industry: "Cargando...",
    goal: "Cargando...",
    packageName: "Cargando...",
  });

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      window.location.href = "/onboarding/start";
      return;
    }

    setSessionToken(token);

    const loadData = async () => {
      try {
        const [catalogRes, sessionRes] = await Promise.all([
          fetch("/api/catalog/onboarding-options", {
            cache: "no-store",
          }),
          fetch(`/api/onboarding/session/${token}`, {
            cache: "no-store",
          }),
        ]);

        const catalogJson = await catalogRes.json();
        const sessionJson = await sessionRes.json();

        if (!catalogRes.ok || !catalogJson?.ok) {
          throw new Error("No fue posible cargar catálogo");
        }

        if (!sessionRes.ok || !sessionJson?.ok) {
          throw new Error("No fue posible cargar sesión");
        }

        const sessionData = sessionJson.data as SessionResponse;

        setPrimaryGoals(catalogJson.data.primaryGoals || []);
        setInitialPrimaryGoalCode(
          sessionData.primaryGoal?.primaryGoalCode || ""
        );
        setInitialRecommendedPackageName(
          sessionData.recommendedPackage?.name || ""
        );

        setSummary({
          businessName:
            sessionData.businessProfile?.commercialName || "Pendiente",
          industry: sessionData.businessProfile?.industry || "Pendiente",
          goal: sessionData.primaryGoal?.primaryGoalLabel || "Pendiente",
          packageName: sessionData.recommendedPackage?.name || "Pendiente",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <AppShell
        step={3}
        totalSteps={5}
        progress={40}
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

  return (
    <AppShell step={3} totalSteps={5} progress={40} summary={summary}>
      <PrimaryGoalSelector
        sessionToken={sessionToken}
        primaryGoals={primaryGoals}
        initialPrimaryGoalCode={initialPrimaryGoalCode}
        initialRecommendedPackageName={initialRecommendedPackageName}
        onSummaryChange={(nextSummary) => {
          setSummary((prev) => ({
            ...prev,
            goal: nextSummary.goal || prev.goal,
            packageName: nextSummary.packageName || prev.packageName,
          }));
        }}
        onBack={() => {
          window.location.href = "/onboarding/business-profile";
        }}
      />
    </AppShell>
  );
}