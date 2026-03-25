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

type CatalogResponse = {
  primaryGoals?: GoalOption[];
};

export default function PrimaryGoalPage() {
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
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
        setPageError("");

        const [catalogRes, sessionRes] = await Promise.all([
          fetch("/api/catalog/onboarding-options", {
            cache: "no-store",
          }),
          fetch(`/api/onboarding/session/${token}`, {
            cache: "no-store",
          }),
        ]);

        const catalogJson = await catalogRes.json().catch(() => null);
        const sessionJson = await sessionRes.json().catch(() => null);

        if (sessionRes.status === 404) {
          window.location.href = "/onboarding/start";
          return;
        }

        if (!catalogRes.ok || !catalogJson?.ok) {
          throw new Error(
            catalogJson?.error || "No fue posible cargar catálogo"
          );
        }

        if (!sessionRes.ok || !sessionJson?.ok) {
          throw new Error(
            sessionJson?.error || "No fue posible cargar sesión"
          );
        }

        const catalogData = catalogJson.data as CatalogResponse;
        const sessionData = sessionJson.data as SessionResponse;

        setPrimaryGoals(catalogData.primaryGoals || []);
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
        console.error("PRIMARY_GOAL_PAGE_LOAD_ERROR:", error);
        setPageError(
          error instanceof Error
            ? error.message
            : "No fue posible cargar la sesión."
        );
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

  if (pageError) {
    return (
      <AppShell
        step={3}
        totalSteps={5}
        progress={40}
        summary={{
          businessName: summary.businessName,
          industry: summary.industry,
          goal: summary.goal,
          packageName: summary.packageName,
        }}
      >
        <div className="rounded-[32px] border border-[#FECACA] bg-white p-12 shadow-sm">
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-5 py-4 text-sm font-medium text-[#B91C1C]">
            {pageError}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#202430] px-6 text-sm font-semibold text-white"
            >
              Reintentar
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/onboarding/business-profile";
              }}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-sm font-semibold text-[#202430]"
            >
              Volver
            </button>
          </div>
        </div>
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