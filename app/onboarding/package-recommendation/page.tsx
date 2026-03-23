"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PackageRecommendationCard from "@/components/onboarding/PackageRecommendationCard";
import { getOnboardingSessionToken } from "@/lib/onboarding-storage";

type Recommendation = {
  packageName: string;
  setupPrice: string;
  monthlyPrice: string;
  rationale: string[];
  notes?: string;
};

type SessionResponse = {
  ok: boolean;
  data?: {
    businessProfile?: {
      commercialName?: string;
      industry?: string;
    } | null;
    primaryGoal?: {
      primaryGoalCode?: string;
      primaryGoalLabel?: string;
      primaryGoalDescription?: string;
    } | null;
    currentProcess?: {
      currentProcess?: string;
      manualSteps?: string;
      toolsUsed?: string;
      painPoints?: string;
    } | null;
    volumeOperations?: {
      monthlyConversations?: number | null;
      monthlyTickets?: number | null;
      monthlyBookings?: number | null;
      averageTicketValue?: string | null;
      teamSizeOperating?: number | null;
      peakDemandNotes?: string | null;
    } | null;
    recommendedPackage?: {
      id: string;
      code: string;
      name: string;
      description?: string | null;
      setupPrice?: string | null;
      monthlyPrice?: string | null;
    } | null;
  };
};

function formatCurrency(value: string | null | undefined) {
  if (!value) return "A definir";

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function buildRecommendationFromSession(session: SessionResponse["data"]): Recommendation {
  const primaryGoal = session?.primaryGoal;
  const currentProcess = session?.currentProcess;
  const volumeOps = session?.volumeOperations;
  const recommendedPackage = session?.recommendedPackage;

  const goalLabel = primaryGoal?.primaryGoalLabel || "Pendiente";
  const goalDescription = primaryGoal?.primaryGoalDescription || "";
  const currentProcessText = currentProcess?.currentProcess || "";
  const manualStepsText = currentProcess?.manualSteps || "";
  const painPointsText = currentProcess?.painPoints || "";

  const monthlyConversations = Number(volumeOps?.monthlyConversations || 0);
  const monthlyTickets = Number(volumeOps?.monthlyTickets || 0);
  const monthlyBookings = Number(volumeOps?.monthlyBookings || 0);
  const teamSizeOperating = Number(volumeOps?.teamSizeOperating || 0);

  const rationale: string[] = [];

  rationale.push(
    `Tu objetivo principal actual es: ${goalLabel}.`
  );

  if (goalDescription) {
    rationale.push(goalDescription);
  }

  if (currentProcessText) {
    rationale.push(
      `Proceso actual detectado: ${currentProcessText}.`
    );
  }

  if (manualStepsText) {
    rationale.push(
      `Hoy todavía existen pasos manuales relevantes: ${manualStepsText}.`
    );
  }

  if (painPointsText) {
    rationale.push(
      `También identificamos fricciones operativas: ${painPointsText}.`
    );
  }

  if (monthlyConversations > 0 || monthlyTickets > 0 || monthlyBookings > 0) {
    rationale.push(
      `El volumen capturado (${monthlyConversations} conversaciones, ${monthlyTickets} tickets, ${monthlyBookings} reservas) confirma que ya existe una operación real que vale la pena estructurar.`
    );
  }

  if (teamSizeOperating > 0) {
    rationale.push(
      `Actualmente operan ${teamSizeOperating} persona(s), lo que ayuda a dimensionar la complejidad inicial de implementación.`
    );
  }

  return {
    packageName: recommendedPackage?.name || "Pendiente",
    setupPrice: formatCurrency(recommendedPackage?.setupPrice),
    monthlyPrice: formatCurrency(recommendedPackage?.monthlyPrice),
    rationale:
      rationale.length > 0
        ? rationale
        : [
            "Con base en la información capturada, ya existe una recomendación preliminar disponible para tu caso.",
          ],
    notes: recommendedPackage?.description || undefined,
  };
}

export default function PackageRecommendationPage() {
  const router = useRouter();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [summary, setSummary] = useState({
    businessName: "Pendiente",
    industry: "Pendiente",
    goal: "Pendiente",
    packageName: "Pendiente",
  });

  const [recommendation, setRecommendation] = useState<Recommendation>({
    packageName: "Analizando...",
    setupPrice: "-",
    monthlyPrice: "-",
    rationale: [],
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
      .then((res: SessionResponse) => {
        if (!res?.ok || !res.data) {
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

        setRecommendation(buildRecommendationFromSession(session));
      })
      .catch((error) => {
        console.error("PACKAGE_RECOMMENDATION_LOAD_ERROR:", error);
        router.push("/onboarding/start");
      });
  }, [router]);

  const handleContinue = async () => {
    if (!sessionToken) return;

    try {
      setIsSubmitting(true);

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
          result?.error || "No fue posible continuar a scope confirmation"
        );
      }

      router.push("/onboarding/scope-confirmation");
    } catch (error) {
      console.error("PACKAGE_RECOMMENDATION_SUBMIT_ERROR:", error);
      alert("No fue posible continuar. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell
      step={5}
      totalSteps={5}
      progress={90}
      summary={summary}
    >
      <PackageRecommendationCard
        recommendation={recommendation}
        isSubmitting={isSubmitting}
        onBack={() => router.push("/onboarding/volume-operations")}
        onContinue={handleContinue}
      />
    </AppShell>
  );
}