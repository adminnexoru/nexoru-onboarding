"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PackageRecommendationCard from "@/components/onboarding/PackageRecommendationCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type SummaryState = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
};

type RecommendationState = {
  packageCode: string | null;
  packageName: string;
  packageDescription: string;
  setupPrice: string | null;
  monthlyPrice: string | null;
  rationale: string[];
  strategicAnalysis: string;
  notes: string;
};

type SessionResponse = {
  businessProfile: {
    commercialName?: string | null;
    industry?: string | null;
  } | null;
  primaryGoal: {
    primaryGoalLabel?: string | null;
  } | null;
};

export default function PackageRecommendationPage() {
  const router = useRouter();

  const [sessionToken, setSessionToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [summary, setSummary] = useState<SummaryState>({
    businessName: "Cargando...",
    industry: "Cargando...",
    goal: "Cargando...",
    packageName: "Cargando...",
  });

  const [recommendation, setRecommendation] = useState<RecommendationState>({
    packageCode: null,
    packageName: "Analizando...",
    packageDescription: "",
    setupPrice: null,
    monthlyPrice: null,
    rationale: [],
    strategicAnalysis: "Analizando contexto operativo...",
    notes: "",
  });

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    setSessionToken(token);

    const loadData = async () => {
      try {
        const [sessionRes, recommendationRes] = await Promise.all([
          fetch(`/api/onboarding/session/${token}`, {
            cache: "no-store",
          }),
          fetch(`/api/onboarding/package-recommendation?sessionToken=${token}`, {
            cache: "no-store",
          }),
        ]);

        const sessionJson = await sessionRes.json();
        const recommendationJson = await recommendationRes.json();

        if (!sessionRes.ok || !sessionJson?.ok) {
          throw new Error("No fue posible cargar sesión");
        }

        if (!recommendationRes.ok || !recommendationJson?.ok) {
          throw new Error("No fue posible generar recomendación");
        }

        const sessionData = sessionJson.data as SessionResponse;
        const recommendationData = recommendationJson.data as RecommendationState;

        setSummary({
          businessName:
            sessionData.businessProfile?.commercialName || "Pendiente",
          industry: sessionData.businessProfile?.industry || "Pendiente",
          goal: sessionData.primaryGoal?.primaryGoalLabel || "Pendiente",
          packageName: recommendationData.packageName || "Pendiente",
        });

        setRecommendation(recommendationData);
      } catch (error) {
        console.error("PACKAGE_RECOMMENDATION_PAGE_LOAD_ERROR:", error);
        router.push("/onboarding/start");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleContinue = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/onboarding/package-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error ||
            "No fue posible continuar con la recomendación. Intenta nuevamente."
        );
      }

      router.push("/onboarding/scope-confirmation");
    } catch (error) {
      console.error("PACKAGE_RECOMMENDATION_CONTINUE_ERROR:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible continuar con la recomendación. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell
        step={5}
        totalSteps={5}
        progress={90}
        summary={{
          businessName: "Cargando...",
          industry: "Cargando...",
          goal: "Cargando...",
          packageName: "Cargando...",
        }}
        isLoading
      >
        <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-12 shadow-sm">
          <div className="h-8 w-56 animate-pulse rounded-full bg-[#E5E7EB]" />
          <div className="mt-8 h-16 w-[70%] animate-pulse rounded-2xl bg-[#E5E7EB]" />
          <div className="mt-6 h-8 w-[85%] animate-pulse rounded-2xl bg-[#E5E7EB]" />
          <div className="mt-10 h-[520px] animate-pulse rounded-[28px] bg-[#F3F4F6]" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell step={5} totalSteps={5} progress={90} summary={summary}>
      <PackageRecommendationCard
        recommendation={recommendation}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onBack={() => router.push("/onboarding/volume-operations")}
        onContinue={handleContinue}
      />
    </AppShell>
  );
}