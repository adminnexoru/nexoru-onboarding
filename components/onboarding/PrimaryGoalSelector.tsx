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
    if (
      initialRecommendedPackageName &&
      selectedPrimaryGoalCode === initialPrimaryGoalCode
    ) {
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
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
       <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#4F46E5] sm:px-5 sm:py-3 sm:text-sm">
        Paso 3 · Objetivo principal
      </span>

       <h1 className="mb-8 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#202430] sm:mb-9 sm:text-[38px] md:mb-8 md:text-[60px] md:leading-[1.04]">
        ¿Qué quieres automatizar primero?
      </h1>

      <p className="mb-10 max-w-4xl text-[16px] leading-7 text-[#4B5563] sm:mb-12 sm:text-[17px] sm:leading-8 md:mb-12 md:text-[20px] md:leading-9">
        Elige la necesidad principal de tu negocio. Con base en esta decisión,
        el proceso actual y el volumen operativo, Nexoru recomendará la mejor
        solución inicial.
      </p>

      <div className="mt-10">
        <h3 className="mb-4 text-[16px] font-semibold text-[#202430]">
          <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
          Objetivo principal *</label>
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {primaryGoals.map((goal) => {
            const isSelected = selectedPrimaryGoalCode === goal.code;

            return (
              <button
                key={goal.code}
                type="button"
                onClick={() => handleSelectPrimaryGoal(goal.code)}
                className={`w-full rounded-[22px] border p-5 text-left transition sm:p-6 ${
                  isSelected
                    ? "border-[#4F46E5] bg-[#EEF2FF] shadow-[0_0_0_4px_rgba(79,70,229,0.08)]"
                    : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE]"
                }`}
              >
                <div className="mb-2 text-[17px] font-semibold leading-6 text-[#202430] sm:text-[18px] sm:leading-7">
                  {goal.name}
                </div>

                <div className="text-[15px] leading-7 text-[#4B5563] sm:text-[16px] sm:leading-8">
                  {goal.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 rounded-[24px] bg-[#F7F8FC] p-5 sm:p-6">
        <h4 className="mb-4 text-[16px] font-semibold text-[#202430]">
          Vista preliminar
        </h4>

        <div className="space-y-2 text-[15px] leading-7 text-[#4B5563] sm:text-[16px] sm:leading-8">
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

      <div className="mt-12 flex flex-col gap-4 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }

            window.location.href = "/onboarding/business-profile";
          }}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[16px] font-semibold text-[#202430] transition hover:bg-[#F9FAFB] sm:w-auto sm:min-w-[120px]"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedPrimaryGoalCode || isSubmitting}
          className={`inline-flex h-14 w-full items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition sm:w-auto sm:min-w-[180px] ${
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