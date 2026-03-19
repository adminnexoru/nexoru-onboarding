"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PackageRecommendationCard from "@/components/onboarding/PackageRecommendationCard";

type Recommendation = {
  packageName: string;
  setupPrice: string;
  monthlyPrice: string;
  rationale: string[];
  notes?: string;
};

function buildRecommendation(primaryGoal: any, volumeOps: any): Recommendation {
  const goal = primaryGoal?.selectedGoal || "other";
  const conversations = Number(volumeOps?.monthlyConversations || 0);
  const tickets = Number(volumeOps?.monthlyTickets || 0);
  const bookings = Number(volumeOps?.monthlyBookings || 0);
  const teamSize = Number(volumeOps?.teamSizeOperating || 0);

  if (goal === "base0") {
    return {
      packageName: "Nexoru Base 0",
      setupPrice: "$7,000 MXN",
      monthlyPrice: "$2,000 MXN",
      rationale: [
        "Tu necesidad principal está orientada a automatizar respuestas básicas y atención inicial.",
        "No se detecta una lógica compleja de pagos, loyalty o reservas como eje principal.",
        "Este paquete permite comenzar con una base mínima pero escalable.",
      ],
      notes:
        conversations > 500
          ? "Detectamos un volumen relevante. Si el canal crece, podrías evolucionar a Sales OS."
          : undefined,
    };
  }

  if (goal === "sales") {
    return {
      packageName: "Nexoru Sales OS",
      setupPrice: "$28,000 MXN",
      monthlyPrice: "$9,000 MXN",
      rationale: [
        "Tu objetivo principal está orientado a ventas, seguimiento y/o cobro por WhatsApp.",
        "El proceso actual muestra fricción comercial y necesidad de automatizar interacción con clientes.",
        "El paquete Sales OS es la base correcta para capturar, responder y operar el flujo comercial.",
      ],
      notes:
        teamSize >= 3 || conversations >= 1000
          ? "El volumen y tamaño operativo sugieren que este caso podría evolucionar a un tier de mayor capacidad."
          : undefined,
    };
  }

  if (goal === "loyalty") {
    return {
      packageName: "Nexoru Loyalty OS",
      setupPrice: "$72,000 MXN",
      monthlyPrice: "$18,000 MXN",
      rationale: [
        "Tu necesidad principal está orientada a registro de tickets, puntos o redenciones.",
        "Este tipo de operación requiere mayor lógica operativa, control de validaciones y base de datos estructurada.",
        "Loyalty OS está diseñado para programas de fidelización con operación automatizada.",
      ],
      notes:
        tickets >= 1000
          ? "El volumen de tickets sugiere un caso de loyalty con complejidad media/alta."
          : undefined,
    };
  }

  if (goal === "booking") {
    return {
      packageName: "Nexoru Booking OS",
      setupPrice: "$25,000 MXN",
      monthlyPrice: "$8,000 MXN",
      rationale: [
        "Tu objetivo principal está orientado a reservas, cursos, sesiones o citas.",
        "El proceso necesita coordinación operativa, disponibilidad y control del flujo de atención.",
        "Booking OS es el paquete adecuado para estructurar este tipo de operación.",
      ],
      notes:
        bookings >= 300
          ? "El volumen de reservas indica que podrías requerir una capa adicional de control operativo en el futuro."
          : undefined,
    };
  }

  return {
    packageName: "Por definir",
    setupPrice: "A definir",
    monthlyPrice: "A definir",
    rationale: [
      "El caso actual no encaja completamente en una sola categoría del catálogo base.",
      "Se recomienda una revisión adicional para definir la mejor configuración inicial.",
    ],
  };
}

export default function PackageRecommendationPage() {
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
    const businessProfileRaw = sessionStorage.getItem("nexoru_business_profile");
    const primaryGoalRaw = sessionStorage.getItem("nexoru_primary_goal");
    const volumeOpsRaw = sessionStorage.getItem("nexoru_volume_operations");

    let businessProfile: any = null;
    let primaryGoal: any = null;
    let volumeOps: any = null;

    if (businessProfileRaw) {
      try {
        businessProfile = JSON.parse(businessProfileRaw);
      } catch (error) {
        console.error("Error reading business profile", error);
      }
    }

    if (primaryGoalRaw) {
      try {
        primaryGoal = JSON.parse(primaryGoalRaw);
      } catch (error) {
        console.error("Error reading primary goal", error);
      }
    }

    if (volumeOpsRaw) {
      try {
        volumeOps = JSON.parse(volumeOpsRaw);
      } catch (error) {
        console.error("Error reading volume operations", error);
      }
    }

    setSummary({
      businessName: businessProfile?.commercialName || "Pendiente",
      industry: businessProfile?.industry || "Pendiente",
      goal: primaryGoal?.goalLabel || "Pendiente",
      packageName: primaryGoal?.suggestedPackage || "Pendiente",
    });

    setRecommendation(buildRecommendation(primaryGoal, volumeOps));
  }, []);

  return (
    <AppShell
      step={5}
      totalSteps={5}
      progress={90}
      summary={{
        businessName: summary.businessName,
        industry: summary.industry,
        goal: summary.goal,
        packageName: recommendation.packageName,
      }}
    >
      <PackageRecommendationCard recommendation={recommendation} />
    </AppShell>
  );
}