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
      totalSteps={5}
      progress={10}
      summary={{
        businessName: "",
        industry: "",
        goal: "",
        packageName: "",
      }}
      isLoading
    >
      <StartPageSkeleton />
    </AppShell>
  );
}
  return (
    <AppShell
      step={1}
      totalSteps={5}
      progress={10}
      summary={{
        businessName: "Pendiente",
        industry: "Pendiente",
        goal: "Pendiente",
        packageName: "Pendiente",
      }}
    >
      <section className="start-card">
        <div className="start-pill">Onboarding Nexoru</div>

        <h1 className="start-title">Diseña tu sistema Nexoru</h1>

        <p className="start-description">
          En menos de 15 minutos definiremos la base operativa de tu negocio y
          te recomendaremos la mejor implementación.
        </p>

        <div className="start-actions">
          <div className="start-time">Tiempo estimado: 15 minutos</div>

          <button
            type="button"
            onClick={handleStart}
            disabled={isStarting}
            className="start-button"
          >
            <span className="start-button-content">
              {isStarting ? (
                <span className="start-button-loading">
                  <span className="start-button-spinner" />
                  Iniciando...
                </span>
              ) : (
                "Comenzar"
              )}
            </span>
          </button>
        </div>

        {error ? <div className="start-error">{error}</div> : null}

        <style jsx>{`
          .start-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 28px;
            padding: 40px 40px 42px;
            box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
          }

          .start-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 0 18px;
            border-radius: 999px;
            background: #eef2ff;
            color: #4f46e5;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 26px;
          }

          .start-title {
            margin: 0;
            max-width: 820px;
            font-size: 56px;
            line-height: 1.02;
            letter-spacing: -0.03em;
            font-weight: 750;
            color: #202430;
          }

          .start-description {
            margin: 28px 0 0;
            max-width: 840px;
            font-size: 21px;
            line-height: 1.72;
            color: #4b5563;
          }

          .start-actions {
            margin-top: 34px;
            display: flex;
            align-items: center;
            gap: 18px;
            flex-wrap: wrap;
          }

          .start-time {
            display: inline-flex;
            align-items: center;
            min-height: 58px;
            min-width: 260px;
            padding: 0 20px;
            border-radius: 18px;
            background: #f3f4f6;
            color: #4b5563;
            font-size: 16px;
            font-weight: 500;
          }

          .start-button {
            height: 58px;
            min-width: 148px;
            padding: 0 28px;
            border: none;
            border-radius: 18px;
            background: #1f2937;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
          }

          .start-button:hover {
            background: #111827;
            transform: translateY(-1px);
          }

          .start-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            transform: none;
          }

          .start-error {
            margin-top: 18px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid #fecaca;
            background: #fef2f2;
            color: #b91c1c;
            font-size: 14px;
            font-weight: 500;
          }

          @media (max-width: 1100px) {
            .start-title {
              font-size: 48px;
            }

            .start-description {
              font-size: 19px;
            }
          }
            .start-button-content {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .start-button-loading {
            display: inline-flex;
            align-items: center;
            gap: 10px;
          }

          .start-button-spinner {
            width: 16px;
            height: 16px;
            border-radius: 999px;
            border: 2px solid rgba(255, 255, 255, 0.35);
            border-top-color: #ffffff;
            animation: start-spin 0.8s linear infinite;
          }

          @keyframes start-spin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (max-width: 768px) {
            .start-card {
              border-radius: 22px;
              padding: 28px 22px 30px;
            }

            .start-pill {
              margin-bottom: 20px;
              font-size: 14px;
            }

            .start-title {
              font-size: 38px;
              line-height: 1.08;
            }

            .start-description {
              margin-top: 20px;
              font-size: 17px;
              line-height: 1.65;
            }

            .start-actions {
              margin-top: 24px;
              flex-direction: column;
              align-items: stretch;
            }

            .start-time {
              width: 100%;
              min-width: 0;
            }

            .start-button {
              width: 100%;
            }
          }
        `}</style>
      </section>
    </AppShell>
  );
}