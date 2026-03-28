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
    <div className="nx-page-card">
      <span className="nx-pill">Paso 3 · Objetivo principal</span>

      <div className="nx-section" style={{ marginTop: 24 }}>
        <h1 className="nx-title">¿Qué quieres automatizar primero?</h1>

        <p className="nx-subtitle">
          Elige la necesidad principal de tu negocio. Con base en esta decisión,
          el proceso actual y el volumen operativo, Nexoru recomendará la mejor
          solución inicial.
        </p>
      </div>

      <div className="nx-section">
        <div className="nx-field">
          <label className="nx-label">Objetivo principal *</label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
              gap: "16px",
            }}
          >
            {primaryGoals.map((goal) => {
              const isSelected = selectedPrimaryGoalCode === goal.code;

              return (
                <button
                  key={goal.code}
                  type="button"
                  onClick={() => handleSelectPrimaryGoal(goal.code)}
                  className={`nx-select-card ${
                    isSelected ? "nx-select-card-active" : ""
                  }`}
                >
                  <div className="nx-select-card-title">{goal.name}</div>

                  <div className="nx-select-card-description">
                    {goal.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-info-card">
          <h4
            style={{
              margin: 0,
              marginBottom: 14,
              fontSize: 16,
              fontWeight: 700,
              color: "var(--nx-text-primary)",
            }}
          >
            Vista preliminar
          </h4>

          <div
            style={{
              display: "grid",
              gap: "10px",
              color: "var(--nx-text-secondary)",
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: 0 }}>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--nx-text-primary)",
                }}
              >
                Objetivo:
              </span>{" "}
              {selectedPrimaryGoal?.name ?? "Pendiente"}
            </p>

            <p style={{ margin: 0 }}>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--nx-text-primary)",
                }}
              >
                Solución preliminar:
              </span>{" "}
              {selectedPrimaryGoalCode
                ? preliminarySolutionLabel
                : "Pendiente"}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="nx-section">
          <div className="nx-alert nx-alert--error">{error}</div>
        </div>
      ) : null}

      <div className="nx-actions">
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }

            window.location.href = "/onboarding/business-profile";
          }}
          className="nx-btn nx-btn-secondary"
          style={{ minWidth: 130 }}
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedPrimaryGoalCode || isSubmitting}
          className={`nx-btn ${
            !selectedPrimaryGoalCode || isSubmitting
              ? "nx-btn-muted"
              : "nx-btn-primary"
          }`}
          style={{ minWidth: 180 }}
        >
          {isSubmitting ? (
            <span className="nx-inline-loading">
              <span className="nx-spinner" />
              Guardando...
            </span>
          ) : (
            "Siguiente"
          )}
        </button>
      </div>

      <style jsx>{`
        .nx-select-card {
          width: 100%;
          border-radius: 22px;
          border: 1px solid var(--nx-border);
          background: var(--nx-surface-elevated);
          padding: 20px;
          text-align: left;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
          cursor: pointer;
        }

        .nx-select-card:hover {
          border-color: rgba(124, 58, 237, 0.4);
          transform: translateY(-1px);
        }

        .nx-select-card-active {
          border-color: rgba(124, 58, 237, 0.65);
          background:
            linear-gradient(
              180deg,
              rgba(124, 58, 237, 0.16) 0%,
              rgba(37, 99, 235, 0.08) 100%
            ),
            var(--nx-surface-elevated);
          box-shadow:
            0 0 0 1px rgba(124, 58, 237, 0.24),
            0 18px 50px rgba(76, 29, 149, 0.18);
        }

        .nx-select-card-title {
          margin-bottom: 8px;
          font-size: 18px;
          line-height: 1.4;
          font-weight: 700;
          color: var(--nx-text-primary);
        }

        .nx-select-card-description {
          font-size: 15px;
          line-height: 1.7;
          color: var(--nx-text-secondary);
        }

        @media (min-width: 768px) {
          .nx-field > div {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 18px !important;
          }

          .nx-select-card {
            padding: 24px;
          }

          .nx-select-card-title {
            font-size: 19px;
          }

          .nx-select-card-description {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}