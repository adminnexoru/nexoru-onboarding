"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import VolumeOperationsForm from "@/components/onboarding/VolumeOperationsForm";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type VolumeOperationsValues = {
  monthlyConversations: number | null;
  monthlyTickets: number | null;
  monthlyBookings: number | null;
  averageTicketValue: number | null;
  teamSizeOperating: number;
  peakDemandNotes: string;
};

type InitialFormValues = {
  monthlyConversations: string;
  monthlyTickets: string;
  monthlyBookings: string;
  averageTicketValue: string;
  teamSizeOperating: string;
  peakDemandNotes: string;
};

export default function VolumeOperationsPage() {
  const router = useRouter();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  const [initialValues, setInitialValues] = useState<InitialFormValues>({
    monthlyConversations: "",
    monthlyTickets: "",
    monthlyBookings: "",
    averageTicketValue: "",
    teamSizeOperating: "",
    peakDemandNotes: "",
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

        setSummary({
          businessName:
            session.businessProfile?.commercialName || "Pendiente",
          industry: session.businessProfile?.industry || "Pendiente",
          goal: session.primaryGoal?.primaryGoalLabel || "Pendiente",
          packageName: session.recommendedPackage?.name || "Pendiente",
        });

        setInitialValues({
          monthlyConversations:
            session.volumeOperations?.monthlyConversations !== null &&
            session.volumeOperations?.monthlyConversations !== undefined
              ? String(session.volumeOperations.monthlyConversations)
              : "",
          monthlyTickets:
            session.volumeOperations?.monthlyTickets !== null &&
            session.volumeOperations?.monthlyTickets !== undefined
              ? String(session.volumeOperations.monthlyTickets)
              : "",
          monthlyBookings:
            session.volumeOperations?.monthlyBookings !== null &&
            session.volumeOperations?.monthlyBookings !== undefined
              ? String(session.volumeOperations.monthlyBookings)
              : "",
          averageTicketValue:
            session.volumeOperations?.averageTicketValue !== null &&
            session.volumeOperations?.averageTicketValue !== undefined
              ? String(session.volumeOperations.averageTicketValue)
              : "",
          teamSizeOperating:
            session.volumeOperations?.teamSizeOperating !== null &&
            session.volumeOperations?.teamSizeOperating !== undefined
              ? String(session.volumeOperations.teamSizeOperating)
              : "",
          peakDemandNotes:
            session.volumeOperations?.peakDemandNotes || "",
        });
      })
      .catch(() => {
        router.push("/onboarding/start");
      })
      .finally(() => {
        setIsHydrating(false);
      });
  }, [router]);

  const handleSubmit = async (values: VolumeOperationsValues) => {
    if (!sessionToken) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const response = await fetch("/api/onboarding/volume-operations", {
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
          result?.error || "No fue posible guardar el volumen de operación."
        );
      }

      router.push("/onboarding/package-recommendation");
    } catch (error) {
      console.error("VOLUME_OPERATIONS_ERROR:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el volumen de operación."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isHydrating) {
    return (
      <AppShell
        step={5}
        totalSteps={5}
        progress={80}
        summary={{
          businessName: "Cargando...",
          industry: "Cargando...",
          goal: "Cargando...",
          packageName: "Cargando...",
        }}
      >
        <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
          <div className="animate-pulse">
            <div className="mb-6 h-10 w-56 rounded-full bg-[#EEF2FF]" />
            <div className="mb-4 h-16 w-[70%] rounded-2xl bg-[#E5E7EB]" />
            <div className="mb-3 h-6 w-[80%] rounded-xl bg-[#E5E7EB]" />
            <div className="mb-10 h-6 w-[65%] rounded-xl bg-[#E5E7EB]" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-3 h-5 w-44 rounded bg-[#E5E7EB]" />
                  <div className="mb-3 h-5 w-full rounded bg-[#F3F4F6]" />
                  <div className="h-14 w-full rounded-2xl bg-[#F3F4F6]" />
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <div className="h-14 w-28 rounded-2xl bg-[#F3F4F6]" />
              <div className="h-14 w-44 rounded-2xl bg-[#E5E7EB]" />
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      step={5}
      totalSteps={5}
      progress={80}
      summary={summary}
    >
      <VolumeOperationsForm
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onBack={() => router.push("/onboarding/current-process")}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
}