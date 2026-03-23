"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import CurrentProcessForm from "@/components/onboarding/CurrentProcessForm";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type CurrentProcessValues = {
  currentProcess: string;
  manualSteps: string;
  toolsUsed: string;
  painPoints: string;
};

export default function CurrentProcessPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<CurrentProcessValues>({
    currentProcess: "",
    manualSteps: "",
    toolsUsed: "",
    painPoints: "",
  });

  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  useEffect(() => {
    const token = getOnboardingSessionToken();

    if (!token) {
      router.push("/onboarding/start");
      return;
    }

    setSessionToken(token);

    fetch(`/api/onboarding/session/${token}`)
      .then((res) => res.json())
      .then((res) => {
        if (!res?.ok || !res?.data) {
          router.push("/onboarding/start");
          return;
        }

        const session = res.data;

        setInitialValues({
          currentProcess: session.currentProcess?.currentProcess || "",
          manualSteps: session.currentProcess?.manualSteps || "",
          toolsUsed: session.currentProcess?.toolsUsed || "",
          painPoints: session.currentProcess?.painPoints || "",
        });

        setSummary({
          businessName:
            session.businessProfile?.commercialName || "Pendiente",
          industry: session.businessProfile?.industry || "Pendiente",
          goal: session.primaryGoal?.primaryGoalLabel || "Pendiente",
          packageName: session.recommendedPackage?.name || "Pendiente",
        });
      })
      .catch(() => {
        router.push("/onboarding/start");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleSubmit = async (values: CurrentProcessValues) => {
    if (!sessionToken) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/onboarding/current-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          ...values,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error ||
            "No fue posible guardar el proceso actual. Intenta nuevamente."
        );
      }

      router.push("/onboarding/volume-operations");
    } catch (error) {
      console.error("CURRENT_PROCESS_ERROR:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el proceso actual. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell
        step={4}
        totalSteps={5}
        progress={60}
        summary={{
          businessName: "Cargando...",
          industry: "Cargando...",
          goal: "Cargando...",
          packageName: "Cargando...",
        }}
      >
        <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-48 rounded-full bg-[#EEF2FF]" />
            <div className="h-16 w-2/3 rounded-2xl bg-[#E5E7EB]" />
            <div className="h-8 w-4/5 rounded-xl bg-[#E5E7EB]" />
            <div className="h-40 w-full rounded-2xl bg-[#E5E7EB]" />
            <div className="h-40 w-full rounded-2xl bg-[#E5E7EB]" />
            <div className="h-40 w-full rounded-2xl bg-[#E5E7EB]" />
            <div className="h-40 w-full rounded-2xl bg-[#E5E7EB]" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      step={4}
      totalSteps={5}
      progress={60}
      summary={summary}
    >
      <CurrentProcessForm
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onBack={() => router.push("/onboarding/primary-goal")}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}