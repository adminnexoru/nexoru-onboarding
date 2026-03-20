"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { setOnboardingSessionToken } from "@/lib/onboarding-storage";

export default function StartPage() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

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
      <div className="start-card">
        <div className="start-pill">Onboarding Nexoru</div>

        <h2 className="start-title">Diseña tu sistema Nexoru</h2>

        <p className="start-description">
          En menos de 15 minutos definiremos la base operativa de tu negocio y
          te recomendaremos la mejor implementación.
        </p>

        <div className="start-time">Tiempo estimado: 15 minutos</div>

        {error ? <div className="start-error">{error}</div> : null}

        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          className="start-button"
        >
          {isStarting ? "Iniciando..." : "Comenzar"}
        </button>

        <style jsx>{`
          .start-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          }

          .start-pill {
            display: inline-block;
            margin-bottom: 18px;
            padding: 8px 14px;
            border-radius: 999px;
            background: #e8ebf8;
            color: #3a3d91;
            font-size: 14px;
            font-weight: 500;
          }

          .start-title {
            margin: 0 0 16px;
            font-size: 54px;
            line-height: 1.05;
            font-weight: 700;
            color: #2b2f36;
            letter-spacing: -0.02em;
            max-width: 760px;
          }

          .start-description {
            margin: 0 0 24px;
            max-width: 760px;
            font-size: 20px;
            line-height: 1.7;
            color: #4a4f57;
          }

          .start-time {
            display: inline-block;
            margin-bottom: 24px;
            min-width: 320px;
            padding: 14px 18px;
            border-radius: 16px;
            background: #f3f4f6;
            font-size: 15px;
            color: #4a4f57;
          }

          .start-error {
            margin-bottom: 16px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid #fecaca;
            background: #fef2f2;
            color: #b91c1c;
            font-size: 14px;
            font-weight: 500;
          }

          .start-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 14px;
            background: #2b2f36;
            color: #ffffff;
            padding: 14px 24px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease;
          }

          .start-button:hover {
            background: #1f2329;
          }

          .start-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }

          @media (max-width: 1024px) {
            .start-title {
              font-size: 46px;
            }

            .start-description {
              font-size: 18px;
            }
          }

          @media (max-width: 640px) {
            .start-card {
              padding: 24px 20px;
              border-radius: 20px;
            }

            .start-pill {
              font-size: 13px;
              margin-bottom: 16px;
            }

            .start-title {
              font-size: 34px;
              line-height: 1.1;
              margin-bottom: 14px;
            }

            .start-description {
              font-size: 16px;
              line-height: 1.65;
              margin-bottom: 20px;
            }

            .start-time {
              width: 100%;
              min-width: 0;
              box-sizing: border-box;
              margin-bottom: 20px;
            }

            .start-button {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </AppShell>
  );
}