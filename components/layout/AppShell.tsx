"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type SummaryData = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
};

type Props = {
  children: ReactNode;
  step: number;
  totalSteps: number;
  progress: number;
  summary: SummaryData;
  isLoading?: boolean;
  hideSummary?: boolean;
};

export default function AppShell({
  step,
  totalSteps,
  progress,
  summary,
  children,
  isLoading = false,
  hideSummary = false,
}: Props) {
  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-header-inner">
          {isLoading ? (
            <div className="shell-brand-skeleton" aria-hidden="true">
              <div className="shell-brand-skeleton-logo" />
              <div className="shell-brand-skeleton-copy">
                <div className="shell-brand-skeleton-title" />
                <div className="shell-brand-skeleton-subtitle" />
              </div>
            </div>
          ) : (
            <div className="shell-brand">
              <Image
                src="/logo-nexoru.png"
                alt="Nexoru"
                width={56}
                height={56}
                style={{height:"auto", width:"auto"}}
                className="shell-logo"
                priority
              />

              <div className="shell-brand-copy">
                <div className="shell-brand-title">NEXORU</div>
                <div className="shell-brand-subtitle">Onboarding</div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="shell-main">
        <div className="shell-container">
          <section className="shell-progress-block">
            {isLoading ? (
              <div className="shell-progress-skeleton" aria-hidden="true">
                <div className="shell-progress-skeleton-top">
                  <div className="shell-progress-skeleton-label" />
                  <div className="shell-progress-skeleton-value" />
                </div>

                <div className="shell-progress-skeleton-track">
                  <div className="shell-progress-skeleton-bar" />
                </div>
              </div>
            ) : (
              <>
                <div className="shell-progress-top">
                  <span className="shell-step-label">
                    Paso {step} de {totalSteps}
                  </span>
                  <span className="shell-progress-value">{progress}%</span>
                </div>

                <div className="shell-progress-track">
                  <div
                    className="shell-progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            )}
          </section>

          <section className={`shell-grid ${hideSummary ? "shell-grid--full" : ""}`}>
        <div className="shell-content">{children}</div>
          {!isLoading && !hideSummary ? (
            <aside className="shell-summary">
              <h3 className="shell-summary-title">Resumen del proyecto</h3>

              <div className="shell-summary-list">
                <div className="shell-summary-item">
                  <span className="shell-summary-label">Negocio:</span>
                  <span className="shell-summary-value">
                    {summary.businessName}
                  </span>
                </div>

                <div className="shell-summary-item">
                  <span className="shell-summary-label">Industria:</span>
                  <span className="shell-summary-value">
                    {summary.industry}
                  </span>
                </div>

                <div className="shell-summary-item">
                  <span className="shell-summary-label">Objetivo:</span>
                  <span className="shell-summary-value">{summary.goal}</span>
                </div>

                <div className="shell-summary-item">
                  <span className="shell-summary-label">Paquete:</span>
                  <span className="shell-summary-value">
                    {summary.packageName}
                  </span>
                </div>
              </div>
            </aside>
          ) : null}
        </section>
        </div>
      </main>

      <style jsx>{`
        .shell {
          min-height: 100vh;
          background: #f5f7fb;
          color: #202430;
        }

        .shell-header {
          background: #ffffff;
          border-bottom: 1px solid #e8ebf2;
        }

        .shell-grid.shell-grid--full {
          grid-template-columns: minmax(0, 1fr);
        }

        .shell-header-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 28px 40px 24px;
        }

        .shell-brand {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .shell-logo {
          object-fit: contain;
        }

        .shell-brand-copy {
          display: flex;
          flex-direction: column;
        }

        .shell-brand-title {
          font-size: 28px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: #111827;
        }

        .shell-brand-subtitle {
          margin-top: 6px;
          font-size: 15px;
          line-height: 1.2;
          color: #6b7280;
          font-weight: 500;
        }

        .shell-main {
          padding: 34px 0 64px;
        }

        .shell-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .shell-progress-block {
          margin-bottom: 34px;
        }

        .shell-progress-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .shell-step-label {
          font-size: 16px;
          font-weight: 500;
          color: #4b5563;
        }

        .shell-progress-value {
          font-size: 16px;
          font-weight: 500;
          color: #6b7280;
        }

        .shell-progress-track {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .shell-progress-bar {
          height: 100%;
          background: #4f46e5;
          border-radius: 999px;
          transition: width 0.25s ease;
        }

        .shell-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: start;
        }

        .shell-content {
          min-width: 0;
        }

        .shell-summary {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 28px 24px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
          position: sticky;
          top: 24px;
        }

        .shell-summary-title {
          margin: 0 0 18px;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 700;
          color: #202430;
        }

        .shell-summary-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .shell-summary-item {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          font-size: 15px;
          line-height: 1.5;
        }

        .shell-summary-label {
          font-weight: 700;
          color: #202430;
        }

        .shell-summary-value {
          color: #4b5563;
        }
          .shell-brand-skeleton {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .shell-brand-skeleton-logo {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #e5e7eb;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-brand-skeleton-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shell-brand-skeleton-title {
          width: 160px;
          height: 24px;
          border-radius: 10px;
          background: #e5e7eb;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-brand-skeleton-subtitle {
          width: 92px;
          height: 16px;
          border-radius: 8px;
          background: #e5e7eb;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-progress-skeleton-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .shell-progress-skeleton-label {
          width: 110px;
          height: 18px;
          border-radius: 8px;
          background: #e5e7eb;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-progress-skeleton-value {
          width: 44px;
          height: 18px;
          border-radius: 8px;
          background: #e5e7eb;
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-progress-skeleton-track {
          width: 100%;
          height: 8px;
          border-radius: 999px;
          overflow: hidden;
          background: #e5e7eb;
        }

        .shell-progress-skeleton-bar {
          width: 38%;
          height: 100%;
          border-radius: 999px;
          background: #d1d5db;
          animation: pulse 1.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.45;
          }
        }

        @media (max-width: 1100px) {
          .shell-grid {
            grid-template-columns: 1fr;
          }

          .shell-summary {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .shell-header-inner {
            padding: 22px 20px 18px;
          }

          .shell-container {
            padding: 0 20px;
          }

          .shell-main {
            padding: 24px 0 44px;
          }

          .shell-progress-block {
            margin-bottom: 24px;
          }

          .shell-brand {
            gap: 14px;
          }

          .shell-brand-title {
            font-size: 24px;
          }

          .shell-brand-subtitle {
            font-size: 14px;
          }

          .shell-summary {
            border-radius: 20px;
            padding: 22px 18px;
          }
        }
      `}</style>
    </div>
  );
}