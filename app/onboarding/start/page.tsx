"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import StartPageSkeleton from "@/components/onboarding/StartPageSkeleton";
import { setOnboardingSessionToken } from "@/lib/onboarding-storage";

export default function StartPage() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsPageLoading(false);
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      setError("");

      const response = await fetch("/api/onboarding/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "No fue posible crear la sesión");
      }

      const sessionToken = result.data.sessionToken as string;

      setOnboardingSessionToken(sessionToken);

      window.location.href = "/onboarding/business-profile";
    } catch (err) {
      console.error(err);
      setError("No fue posible iniciar el onboarding. Intenta nuevamente.");
    } finally {
      setIsStarting(false);
    }
  };

  if (isPageLoading) {
    return (
      <AppShell
        step={1}
        totalSteps={10}
        progress={0}
        summary={{
          businessName: "",
          industry: "",
          goal: "",
          packageName: "",
        }}
        isLoading
        hideSummary
      >
        <StartPageSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell
      step={1}
      totalSteps={10}
      progress={0}
      summary={{
        businessName: "Pendiente",
        industry: "Pendiente",
        goal: "Pendiente",
        packageName: "Pendiente",
      }}
      hideSummary
    >
      <section className="nx-page-card">
        <span className="nx-pill">Onboarding Nexoru</span>

        <div className="nx-section" style={{ marginTop: 24 }}>
          <h1 className="nx-title">Diseña tu sistema Nexoru</h1>

          <p className="nx-subtitle">
            En menos de 15 minutos definiremos la base operativa de tu negocio y
            te recomendaremos la mejor implementación.
          </p>
        </div>

        <div className="nx-section">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div
              className="nx-info-card"
              style={{
                minHeight: 56,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <p className="nx-info-copy" style={{ fontWeight: 600 }}>
                Tiempo estimado: 15 minutos
              </p>
            </div>

            <button
              type="button"
              onClick={handleStart}
              disabled={isStarting}
              className={`nx-btn ${
                isStarting ? "nx-btn-muted" : "nx-btn-primary"
              }`}
              style={{ minWidth: 170 }}
            >
              {isStarting ? (
                <span className="nx-inline-loading">
                  <span className="nx-spinner" />
                  Iniciando...
                </span>
              ) : (
                "Comenzar"
              )}
            </button>
          </div>
        </div>

        {error ? (
          <div className="nx-section">
            <div className="nx-alert nx-alert--error">{error}</div>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}