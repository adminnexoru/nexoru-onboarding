"use client";

import { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  step: number;
  totalSteps: number;
  progress: number;
  summary: {
    businessName?: string;
    industry?: string;
    goal?: string;
    packageName?: string;
  };
};

export default function AppShell({
  children,
  step,
  totalSteps,
  progress,
  summary,
}: AppShellProps) {
  return (
    <div className="nexoru-shell">
      <header className="nexoru-shell__header">
        <div className="nexoru-shell__header-inner">
          <div>
            <h1 className="nexoru-shell__brand">NEXORU</h1>
            <p className="nexoru-shell__subtitle">Onboarding</p>
          </div>
        </div>
      </header>

      <main className="nexoru-shell__main">
        <section className="nexoru-shell__progress">
          <div className="nexoru-shell__progress-row">
            <span>
              Paso {step} de {totalSteps}
            </span>
            <span>{progress}%</span>
          </div>

          <div className="nexoru-shell__progress-track">
            <div
              className="nexoru-shell__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="nexoru-shell__content">
          <div className="nexoru-shell__left">{children}</div>

          <aside className="nexoru-shell__right">
            <div className="nexoru-shell__summary-card">
              <h3 className="nexoru-shell__summary-title">
                Resumen del proyecto
              </h3>

              <div className="nexoru-shell__summary-item">
                <span className="nexoru-shell__summary-label">Negocio:</span>
                <span className="nexoru-shell__summary-value">
                  {summary?.businessName || "Pendiente"}
                </span>
              </div>

              <div className="nexoru-shell__summary-item">
                <span className="nexoru-shell__summary-label">Industria:</span>
                <span className="nexoru-shell__summary-value">
                  {summary?.industry || "Pendiente"}
                </span>
              </div>

              <div className="nexoru-shell__summary-item">
                <span className="nexoru-shell__summary-label">Objetivo:</span>
                <span className="nexoru-shell__summary-value">
                  {summary?.goal || "Pendiente"}
                </span>
              </div>

              <div className="nexoru-shell__summary-item">
                <span className="nexoru-shell__summary-label">Paquete:</span>
                <span className="nexoru-shell__summary-value">
                  {summary?.packageName || "Pendiente"}
                </span>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <style jsx>{`
        .nexoru-shell {
          min-height: 100vh;
          background: #f5f6fa;
        }

        .nexoru-shell__header {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .nexoru-shell__header-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 32px;
        }

        .nexoru-shell__brand {
          margin: 0;
          font-size: 22px;
          line-height: 1;
          font-weight: 700;
          color: #2b2f36;
          letter-spacing: 0.02em;
        }

        .nexoru-shell__subtitle {
          margin: 8px 0 0;
          font-size: 15px;
          color: #6b7280;
        }

        .nexoru-shell__main {
          max-width: 1440px;
          margin: 0 auto;
          padding: 28px 32px 40px;
        }

        .nexoru-shell__progress {
          margin-bottom: 28px;
        }

        .nexoru-shell__progress-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 10px;
          font-size: 15px;
          color: #4a4f57;
        }

        .nexoru-shell__progress-track {
          width: 100%;
          height: 10px;
          border-radius: 999px;
          background: #e5e7eb;
          overflow: hidden;
        }

        .nexoru-shell__progress-fill {
          height: 100%;
          border-radius: 999px;
          background: #3a3d91;
        }

        .nexoru-shell__content {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: start;
        }

        .nexoru-shell__left {
          min-width: 0;
        }

        .nexoru-shell__right {
          min-width: 0;
        }

        .nexoru-shell__summary-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 24px;
        }

        .nexoru-shell__summary-title {
          margin: 0 0 18px;
          font-size: 18px;
          font-weight: 700;
          color: #2b2f36;
        }

        .nexoru-shell__summary-item {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
          font-size: 15px;
          line-height: 1.5;
        }

        .nexoru-shell__summary-item:last-child {
          margin-bottom: 0;
        }

        .nexoru-shell__summary-label {
          font-weight: 700;
          color: #2b2f36;
        }

        .nexoru-shell__summary-value {
          color: #4a4f57;
        }

        @media (max-width: 1024px) {
          .nexoru-shell__content {
            grid-template-columns: 1fr;
          }

          .nexoru-shell__summary-card {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .nexoru-shell__header-inner {
            padding: 20px 16px;
          }

          .nexoru-shell__main {
            padding: 20px 16px 28px;
          }

          .nexoru-shell__brand {
            font-size: 20px;
          }

          .nexoru-shell__subtitle,
          .nexoru-shell__progress-row {
            font-size: 14px;
          }

          .nexoru-shell__summary-card {
            border-radius: 20px;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}