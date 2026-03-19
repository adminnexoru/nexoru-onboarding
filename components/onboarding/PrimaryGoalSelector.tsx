"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PrimaryGoalKey =
  | "base0"
  | "sales"
  | "loyalty"
  | "booking"
  | "other";

type SecondaryNeedKey =
  | "agenda"
  | "ubicacion"
  | "delivery"
  | "campanas"
  | "base_datos"
  | "dashboard"
  | "pagos"
  | "redencion";

type PrimaryGoalSelectorProps = {
  onSummaryChange?: (data: {
    goal?: string;
    packageName?: string;
  }) => void;
};

const primaryGoals: {
  key: PrimaryGoalKey;
  title: string;
  description: string;
}[] = [
  {
    key: "base0",
    title: "Responder mensajes automáticamente",
    description:
      "Automatizar respuestas básicas, FAQs y atención inicial sin procesos complejos.",
  },
  {
    key: "sales",
    title: "Vender / cobrar por WhatsApp",
    description:
      "Capturar leads, responder con IA, generar pagos y automatizar seguimiento comercial.",
  },
  {
    key: "loyalty",
    title: "Registrar tickets y puntos",
    description:
      "Implementar un sistema de loyalty con validación de tickets, puntos y redenciones.",
  },
  {
    key: "booking",
    title: "Agendar reservas, cursos o citas",
    description:
      "Gestionar disponibilidad, reservas, recordatorios y confirmaciones automáticas.",
  },
  {
    key: "other",
    title: "Otro",
    description:
      "Tengo una necesidad diferente y quiero que Nexoru me ayude a estructurarla.",
  },
];

const secondaryNeeds: {
  key: SecondaryNeedKey;
  label: string;
}[] = [
  { key: "agenda", label: "Agenda" },
  { key: "ubicacion", label: "Ubicación" },
  { key: "delivery", label: "Delivery" },
  { key: "campanas", label: "Campañas" },
  { key: "base_datos", label: "Base de datos" },
  { key: "dashboard", label: "Dashboard" },
  { key: "pagos", label: "Pagos" },
  { key: "redencion", label: "Redención de puntos" },
];

function getSuggestedPackage(goal: PrimaryGoalKey | null): string {
  switch (goal) {
    case "base0":
      return "Nexoru Base 0";
    case "sales":
      return "Nexoru Sales OS";
    case "loyalty":
      return "Nexoru Loyalty OS";
    case "booking":
      return "Nexoru Booking OS";
    case "other":
      return "Por definir";
    default:
      return "";
  }
}

function getGoalLabel(goal: PrimaryGoalKey | null): string {
  const found = primaryGoals.find((item) => item.key === goal);
  return found?.title || "";
}

export default function PrimaryGoalSelector({
  onSummaryChange,
}: PrimaryGoalSelectorProps) {
  const [selectedGoal, setSelectedGoal] = useState<PrimaryGoalKey | null>(null);
  const [selectedSecondaryNeeds, setSelectedSecondaryNeeds] = useState<
    SecondaryNeedKey[]
  >([]);
  const [error, setError] = useState("");

  const suggestedPackage = useMemo(
    () => getSuggestedPackage(selectedGoal),
    [selectedGoal]
  );

  const handleSelectGoal = (goal: PrimaryGoalKey) => {
    setSelectedGoal(goal);
    setError("");

    onSummaryChange?.({
      goal: getGoalLabel(goal),
      packageName: getSuggestedPackage(goal),
    });
  };

  const toggleSecondaryNeed = (need: SecondaryNeedKey) => {
    setSelectedSecondaryNeeds((prev) =>
      prev.includes(need)
        ? prev.filter((item) => item !== need)
        : [...prev, need]
    );
  };

  const handleSubmit = () => {
    if (!selectedGoal) {
      setError("Selecciona un objetivo principal para continuar.");
      return;
    }

    alert("Objetivo principal capturado. La siguiente pantalla se construirá en la siguiente HU.");
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#E8EBF8",
            color: "#3A3D91",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 14px",
            borderRadius: "999px",
            marginBottom: "18px",
          }}
        >
          Paso 3 · Objetivo principal
        </div>

        <h2
          style={{
            fontSize: "44px",
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 16px",
          }}
        >
          ¿Qué quieres automatizar primero?
        </h2>

        <p
          style={{
            fontSize: "20px",
            lineHeight: 1.6,
            color: "#4A4F57",
            maxWidth: "860px",
            margin: 0,
          }}
        >
          Elige la necesidad principal de tu negocio. Después podrás agregar
          necesidades secundarias para complementar la solución.
        </p>
      </div>

      <div style={{ marginBottom: "36px" }}>
        <h3
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 18px",
          }}
        >
          Objetivo principal *
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {primaryGoals.map((goal) => {
            const isSelected = selectedGoal === goal.key;

            return (
              <button
                key={goal.key}
                type="button"
                onClick={() => handleSelectGoal(goal.key)}
                style={{
                  textAlign: "left",
                  backgroundColor: isSelected ? "#EEF1FF" : "#FFFFFF",
                  border: isSelected
                    ? "2px solid #3A3D91"
                    : "1px solid #E5E7EB",
                  borderRadius: "18px",
                  padding: "22px",
                  minHeight: "132px",
                  cursor: "pointer",
                  boxShadow: isSelected
                    ? "0 4px 16px rgba(58,61,145,0.08)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#2B2F36",
                    marginBottom: "10px",
                    lineHeight: 1.2,
                  }}
                >
                  {goal.title}
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.55,
                    color: "#4A4F57",
                  }}
                >
                  {goal.description}
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <p
            style={{
              marginTop: "14px",
              color: "#DC2626",
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            {error}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "36px" }}>
        <h3
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 18px",
          }}
        >
          Necesidades secundarias (opcional)
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {secondaryNeeds.map((need) => {
            const active = selectedSecondaryNeeds.includes(need.key);

            return (
              <button
                key={need.key}
                type="button"
                onClick={() => toggleSecondaryNeed(need.key)}
                style={{
                  border: active ? "1px solid #3A3D91" : "1px solid #D1D5DB",
                  backgroundColor: active ? "#EEF1FF" : "#FFFFFF",
                  color: active ? "#2B2F36" : "#4A4F57",
                  borderRadius: "999px",
                  padding: "10px 16px",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {need.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          marginBottom: "36px",
          backgroundColor: "#F8F9FC",
          border: "1px solid #E5E7EB",
          borderRadius: "18px",
          padding: "22px",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 14px",
          }}
        >
          Vista preliminar
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: "#4A4F57",
            margin: "0 0 10px",
          }}
        >
          <strong style={{ color: "#2B2F36" }}>Objetivo:</strong>{" "}
          {selectedGoal ? getGoalLabel(selectedGoal) : "Pendiente"}
        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#4A4F57",
            margin: 0,
          }}
        >
          <strong style={{ color: "#2B2F36" }}>Paquete sugerido:</strong>{" "}
          {suggestedPackage || "Pendiente"}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginTop: "8px",
        }}
      >
        <Link
          href="/onboarding/business-profile"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #D1D5DB",
            backgroundColor: "#FFFFFF",
            color: "#2B2F36",
            borderRadius: "14px",
            padding: "14px 22px",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Atrás
        </Link>

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            border: "none",
            backgroundColor: selectedGoal ? "#2B2F36" : "#9CA3AF",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: selectedGoal ? "pointer" : "not-allowed",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}