"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PackageRecommendationCard from "@/components/onboarding/PackageRecommendationCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";
import PackageRecommendationPageSkeleton from "@/components/onboarding/PackageRecommendationPageSkeleton";

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
  recommendationSource: "openai" | "fallback";
};
type PackageRecommendationApiResponse = {
  packageCode: string | null;
  packageName: string;
  packageDescription: string;
  setupPrice: string | null;
  monthlyPrice: string | null;
  rationale: string[];
  strategicAnalysis: string;
  notes: string;
  recommendationSource: "openai" | "fallback";
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
  const [pageError, setPageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [summary, setSummary] = useState<SummaryState>({
    businessName: "",
    industry: "",
    goal: "",
    packageName: "",
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
    recommendationSource: "fallback",
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
        setPageError("");

        const [sessionRes, recommendationRes] = await Promise.all([
          fetch(`/api/onboarding/session/${token}`, {
            cache: "no-store",
          }),
          fetch(`/api/onboarding/package-recommendation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionToken: token,
            }),
            cache: "no-store",
          }),
        ]);

        const sessionJson = await sessionRes.json().catch(() => null);
        const recommendationJson = await recommendationRes.json().catch(() => null);

        if (sessionRes.status === 404) {
          router.push("/onboarding/start");
          return;
        }

        if (!sessionRes.ok || !sessionJson?.ok) {
          throw new Error(
            sessionJson?.error || "No fue posible cargar sesión"
          );
        }

        if (!recommendationRes.ok || !recommendationJson?.ok) {
        const errorMessage =
            typeof recommendationJson?.error === "string"
            ? recommendationJson.error
            : recommendationJson?.error?.message ||
                recommendationJson?.message ||
                "No fue posible generar recomendación";

        console.error("PACKAGE_RECOMMENDATION_API_ERROR_BODY:", recommendationJson);

        throw new Error(errorMessage);
        }

        const sessionData = sessionJson.data as SessionResponse;
        const recommendationData =
          recommendationJson.data as PackageRecommendationApiResponse;

        const businessName =
          sessionData.businessProfile?.commercialName || "Pendiente";
        const industry = sessionData.businessProfile?.industry || "Pendiente";
        const goal = sessionData.primaryGoal?.primaryGoalLabel || "Pendiente";

        setSummary({
          businessName,
          industry,
          goal,
          packageName: recommendationData.packageName || "Pendiente",
        });

        setRecommendation({
        packageCode: recommendationData.packageCode,
        packageName: recommendationData.packageName,
        packageDescription: recommendationData.packageDescription,
        setupPrice: recommendationData.setupPrice,
        monthlyPrice: recommendationData.monthlyPrice,
        rationale: recommendationData.rationale || [],
        strategicAnalysis: recommendationData.strategicAnalysis || "",
        notes: recommendationData.notes || "",
        recommendationSource: recommendationData.recommendationSource || "fallback",
        });
      } catch (error) {
        console.error("PACKAGE_RECOMMENDATION_PAGE_LOAD_ERROR:", error);
        setPageError(
          error instanceof Error
            ? error.message
            : "No fue posible cargar la recomendación."
        );
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

      const result = await response.json().catch(() => null);

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
      step={6}
      totalSteps={10}
      progress={50}
      summary={{
        businessName: "",
        industry: "",
        goal: "",
        packageName: "",
      }}
      isLoading
    >
      <PackageRecommendationPageSkeleton />
    </AppShell>
  );
}

  if (pageError) {
    return (
      <AppShell step={6} totalSteps={10} progress={50} summary={summary}>
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
              onClick={() => router.push("/onboarding/volume-operations")}
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
    <AppShell step={6} totalSteps={10} progress={50} summary={summary}>
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