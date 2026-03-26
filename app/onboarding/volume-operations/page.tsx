"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import VolumeOperationsForm from "@/components/onboarding/VolumeOperationsForm";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";
import VolumeOperationsPageSkeleton from "@/components/onboarding/VolumeOperationsPageSkeleton";

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
        totalSteps={10}
        progress={40}
        summary={{
            businessName: "",
            industry: "",
            goal: "",
            packageName: "",
        }}
        isLoading
        >
        <VolumeOperationsPageSkeleton />
        </AppShell>
    );
    }

  return (
    <AppShell
      step={5}
      totalSteps={10}
      progress={40}
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