"use client";

import { useMemo, useState } from "react";

type GoalOption = {
  code: string;
  name: string;
  description: string | null;
};

type Props = {
  sessionToken: string;
  primaryGoals: GoalOption[];
  initialPrimaryGoalCode?: string;
  initialRecommendedPackageName?: string;
  onSummaryChange?: (data: { goal?: string; packageName?: string }) => void;
  onBack?: () => void;
};

function getPreliminarySolutionLabel(goalCode: string) {
  switch (goalCode) {
    case "other":
      return "Solución por definir";
    default:
      return "Se determinará con base en tu operación";
  }
}

export default function PrimaryGoalSelector({
  sessionToken,
  primaryGoals,
  initialPrimaryGoalCode = "",
  initialRecommendedPackageName = "",
  onSummaryChange,
  onBack,
}: Props) {
  const [selectedPrimaryGoalCode, setSelectedPrimaryGoalCode] = useState(
    initialPrimaryGoalCode
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPrimaryGoal = useMemo(() => {
    return (
      primaryGoals.find((goal) => goal.code === selectedPrimaryGoalCode) ?? null
    );
  }, [primaryGoals, selectedPrimaryGoalCode]);

  const preliminarySolutionLabel = useMemo(() => {
    if (initialRecommendedPackageName && selectedPrimaryGoalCode === initialPrimaryGoalCode) {
      return initialRecommendedPackageName;
    }

    return getPreliminarySolutionLabel(selectedPrimaryGoalCode);
  }, [
    initialPrimaryGoalCode,
    initialRecommendedPackageName,
    selectedPrimaryGoalCode,
  ]);

  const handleSelectPrimaryGoal = (goalCode: string) => {
    const selected =
      primaryGoals.find((item) => item.code === goalCode) ?? null;

    setSelectedPrimaryGoalCode(goalCode);
    setError("");

    onSummaryChange?.({
      goal: selected?.name ?? "Pendiente",
      packageName:
        goalCode === "other"
          ? "Solución por definir"
          : "Se determinará con base en tu operación",
    });
  };

  const handleSubmit = async () => {
    if (!selectedPrimaryGoalCode) {
      setError("Selecciona un objetivo principal para continuar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await fetch("/api/onboarding/primary-goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          primaryGoalCode: selectedPrimaryGoalCode,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error ||
            "No fue posible guardar el objetivo principal. Intenta nuevamente."
        );
      }

      onSummaryChange?.({
        goal:
          result?.data?.primaryGoal?.primaryGoalLabel ??
          selectedPrimaryGoal?.name ??
          "Pendiente",
        packageName:
          result?.data?.recommendedPackage?.name ??
          (selectedPrimaryGoalCode === "other"
            ? "Solución por definir"
            : "Se determinará con base en tu operación"),
      });

      window.location.href = "/onboarding/current-process";
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible guardar el objetivo principal. Intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-12">
      <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-5 py-2.5 text-sm font-medium text-[#4F46E5]">
        Paso 3 · Objetivo principal
      </span>

      <h1 className="max-w-[920px] text-[42px] font-semibold leading-[1.04] tracking-[-0.03em] text-[#202430] md:text-[60px]">
        ¿Qué quieres automatizar primero?
      </h1>

      <p className="mt-5 max-w-[920px] text-[19px] leading-8 text-[#4B5563] md:text-[20px]">
        Elige la necesidad principal de tu negocio. Con base en esta decisión,
        el proceso actual y el volumen operativo, Nexoru recomendará la mejor
        solución inicial.
      </p>

      <div className="mt-10">
        <h3 className="mb-4 text-[16px] font-semibold text-[#202430]">
          Objetivo principal *
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {primaryGoals.map((goal) => {
            const isSelected = selectedPrimaryGoalCode === goal.code;

            return (
              <button
                key={goal.code}
                type="button"
                onClick={() => handleSelectPrimaryGoal(goal.code)}
                className={`rounded-[22px] border p-6 text-left transition ${
                  isSelected
                    ? "border-[#4F46E5] bg-[#EEF2FF] shadow-[0_0_0_4px_rgba(79,70,229,0.08)]"
                    : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE]"
                }`}
              >
                <div className="mb-2 text-[18px] font-semibold leading-7 text-[#202430]">
                  {goal.name}
                </div>

                <div className="text-[16px] leading-8 text-[#4B5563]">
                  {goal.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 rounded-[24px] bg-[#F7F8FC] p-6">
        <h4 className="mb-4 text-[16px] font-semibold text-[#202430]">
          Vista preliminar
        </h4>

        <div className="space-y-2 text-[16px] leading-8 text-[#4B5563]">
          <p>
            <span className="font-semibold text-[#202430]">Objetivo:</span>{" "}
            {selectedPrimaryGoal?.name ?? "Pendiente"}
          </p>
          <p>
            <span className="font-semibold text-[#202430]">
              Solución preliminar:
            </span>{" "}
            {selectedPrimaryGoalCode
              ? preliminarySolutionLabel
              : "Pendiente"}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-[#FCA5A5] bg-[#FEF2F2] px-5 py-4 text-sm font-medium text-[#B91C1C]">
          {error}
        </div>
      ) : null}

      <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }

            window.location.href = "/onboarding/business-profile";
          }}
          className="inline-flex h-14 min-w-[108px] items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[16px] font-semibold text-[#202430] transition hover:bg-[#F9FAFB]"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedPrimaryGoalCode || isSubmitting}
          className={`inline-flex h-14 min-w-[180px] items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition ${
            !selectedPrimaryGoalCode || isSubmitting
              ? "cursor-not-allowed bg-[#A7AFBE]"
              : "bg-[#202430] hover:bg-[#111827]"
          }`}
        >
          {isSubmitting ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}