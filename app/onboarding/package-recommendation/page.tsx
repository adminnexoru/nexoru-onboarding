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
  currentProcess: {
    currentProcess?: string | null;
    manualSteps?: string | null;
    toolsUsed?: string | null;
    painPoints?: string | null;
  } | null;
  volumeOperations: {
    monthlyConversations?: number | null;
    monthlyTickets?: number | null;
    monthlyBookings?: number | null;
    averageTicketValue?: string | null;
    teamSizeOperating?: number | null;
    peakDemandNotes?: string | null;
  } | null;
};

type PackageRecommendationApiResponse = {
  recommendedPackage: {
    id: string;
    code: string;
    name: string;
    description: string | null;
    setupPrice: string;
    monthlyPrice: string;
  };
  session: {
    id: string;
    currentStep: string;
    status: string;
    recommendedPackageId: string | null;
    setupPriceSnapshot: string | null;
    monthlyPriceSnapshot: string | null;
    updatedAt: string;
  };
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

        const sessionJson = await sessionRes.json();
        const recommendationJson = await recommendationRes.json();

        if (!sessionRes.ok || !sessionJson?.ok) {
          throw new Error(
            sessionJson?.error || "No fue posible cargar sesión"
          );
        }

        if (!recommendationRes.ok || !recommendationJson?.ok) {
          throw new Error(
            recommendationJson?.error ||
              "No fue posible generar recomendación"
          );
        }

        const sessionData = sessionJson.data as SessionResponse;
        const recommendationData =
          recommendationJson.data as PackageRecommendationApiResponse;

        const businessName =
          sessionData.businessProfile?.commercialName || "Pendiente";
        const industry = sessionData.businessProfile?.industry || "Pendiente";
        const goal = sessionData.primaryGoal?.primaryGoalLabel || "Pendiente";

        const monthlyConversations =
          sessionData.volumeOperations?.monthlyConversations ?? null;
        const monthlyTickets =
          sessionData.volumeOperations?.monthlyTickets ?? null;
        const monthlyBookings =
          sessionData.volumeOperations?.monthlyBookings ?? null;
        const averageTicketValue =
          sessionData.volumeOperations?.averageTicketValue ?? null;
        const teamSizeOperating =
          sessionData.volumeOperations?.teamSizeOperating ?? null;
        const peakDemandNotes =
          sessionData.volumeOperations?.peakDemandNotes ?? "";

        const rationale: string[] = [];

        if (goal !== "Pendiente") {
          rationale.push(`Tu objetivo principal actual es: ${goal}.`);
        }

        if (sessionData.currentProcess?.currentProcess) {
          rationale.push(
            `Proceso actual detectado: ${sessionData.currentProcess.currentProcess}.`
          );
        }

        if (sessionData.currentProcess?.manualSteps) {
          rationale.push(
            `Hoy todavía existen pasos manuales relevantes: ${sessionData.currentProcess.manualSteps}.`
          );
        }

        if (sessionData.currentProcess?.painPoints) {
          rationale.push(
            `También identificamos fricciones operativas: ${sessionData.currentProcess.painPoints}.`
          );
        }

        const volumeParts: string[] = [];

        if (monthlyConversations !== null) {
          volumeParts.push(
            `${monthlyConversations} conversaciones mensuales`
          );
        }

        if (monthlyTickets !== null) {
          volumeParts.push(`${monthlyTickets} tickets mensuales`);
        }

        if (monthlyBookings !== null) {
          volumeParts.push(`${monthlyBookings} reservas mensuales`);
        }

        if (teamSizeOperating !== null) {
          volumeParts.push(`${teamSizeOperating} personas operando hoy`);
        }

        if (volumeParts.length > 0) {
          rationale.push(
            `El volumen capturado (${volumeParts.join(
              ", "
            )}) confirma que ya existe una operación real que vale la pena estructurar.`
          );
        }

        if (recommendationData.recommendedPackage.code === "base0") {
          rationale.push(
            "La mejor primera capa es una automatización básica de atención, porque hoy la operación todavía puede ordenarse sin sobredimensionar la solución inicial."
          );
        }

        if (recommendationData.recommendedPackage.code === "sales_os") {
          rationale.push(
            "La lógica principal del negocio apunta a venta y seguimiento comercial, por lo que una arquitectura Sales OS es la mejor base inicial."
          );
        }

        if (recommendationData.recommendedPackage.code === "loyalty_os") {
          rationale.push(
            "La operación está más alineada a tickets, acumulación y redención, por lo que Loyalty OS ofrece la mejor estructura base."
          );
        }

        if (recommendationData.recommendedPackage.code === "booking_os") {
          rationale.push(
            "La lógica principal depende de disponibilidad, confirmación y calendarización, por lo que una arquitectura de booking es la mejor base inicial."
          );
        }

        const strategicAnalysis = [
          `Analizando el contexto de ${businessName} dentro de ${industry}, la prioridad declarada es "${goal}". Esto indica que la recomendación no debe limitarse a una automatización genérica, sino alinearse con la necesidad operativa central del negocio.`,
          sessionData.currentProcess?.currentProcess
            ? `Actualmente el proceso se describe como "${sessionData.currentProcess.currentProcess}". Además, existen pasos manuales relevantes (${sessionData.currentProcess.manualSteps || "sin detalle adicional"}) y herramientas actuales (${sessionData.currentProcess.toolsUsed || "sin herramientas declaradas"}), lo que sugiere que parte del esfuerzo operativo todavía depende de intervención humana y coordinación manual.`
            : `Aún con información parcial del proceso, la recomendación se construye sobre el objetivo principal y el volumen operativo reportado.`,
          sessionData.currentProcess?.painPoints
            ? `Desde una perspectiva operativa, los principales puntos de fricción identificados son: ${sessionData.currentProcess.painPoints}.`
            : `No se documentaron fricciones operativas detalladas, pero el volumen y la necesidad principal ya justifican una estructura inicial clara.`,
          volumeParts.length > 0
            ? `Sumado al volumen observado (${volumeParts.join(", ")}${averageTicketValue ? `, ticket promedio de ${averageTicketValue}` : ""}${peakDemandNotes ? `, con notas de demanda como "${peakDemandNotes}"` : ""}), existe evidencia suficiente para justificar una solución más estructurada y no únicamente una respuesta táctica.`
            : `Aunque no hay suficiente detalle de volumen, sí hay señales suficientes para recomendar una base operativa inicial.`,
          `Con base en esos factores, la mejor recomendación inicial es ${recommendationData.recommendedPackage.name}, porque permite atacar el núcleo del problema sin sobre-dimensionar la implementación en esta etapa. La lógica del paquete se alinea con el tipo de operación actual y con el nivel de madurez reportado.`,
          `Estratégicamente, esta recomendación debe entenderse como una base operativa escalable: primero ordena el flujo central del negocio, después permite ampliar alcance con add-ons o integraciones según crecimiento, complejidad y necesidad comercial real.`,
        ].join("\n\n");

        const notes =
          "Esta recomendación organiza la primera fase de implementación y puede ampliarse después con add-ons o mayor complejidad operativa.";

        setSummary({
          businessName,
          industry,
          goal,
          packageName: recommendationData.recommendedPackage.name || "Pendiente",
        });

        setRecommendation({
          packageCode: recommendationData.recommendedPackage.code,
          packageName: recommendationData.recommendedPackage.name,
          packageDescription:
            recommendationData.recommendedPackage.description || "",
          setupPrice: recommendationData.recommendedPackage.setupPrice,
          monthlyPrice: recommendationData.recommendedPackage.monthlyPrice,
          rationale,
          strategicAnalysis,
          notes,
        });
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