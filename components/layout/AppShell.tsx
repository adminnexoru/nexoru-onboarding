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
      <div className="shell-bg-orb shell-bg-orb--violet" />
      <div className="shell-bg-orb shell-bg-orb--blue" />
      <div className="shell-bg-grid" />

      <header className="shell-header">
        <div className="shell-header-inner">
          {isLoading ? (
            <div className="shell-brand-skeleton" aria-hidden="true">
              <div className="shell-brand-skeleton-row">
                <div className="shell-brand-skeleton-logo" />
                <div className="shell-brand-skeleton-copy">
                  <div className="shell-brand-skeleton-title" />
                  <div className="shell-brand-skeleton-subtitle" />
                </div>
              </div>
            </div>
          ) : (
            <div className="shell-brand-wrap">
              <div className="shell-brand">
                <div className="shell-logo-box">
                  <Image
                    src="/logo-nexoru.png"
                    alt="Nexoru"
                    fill
                    sizes="56px"
                    className="shell-logo"
                    priority
                  />
                </div>

                <div className="shell-brand-copy">
                  <div className="shell-brand-title">NEXORU</div>
                  <div className="shell-brand-subtitle">Onboarding</div>
                </div>
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

          <section
            className={`shell-grid ${hideSummary ? "shell-grid--full" : ""}`}
          >
            <div className="shell-content">{children}</div>

            {!isLoading && !hideSummary ? (
              <aside className="shell-summary">
                <div className="shell-summary-glow" />
                <h3 className="shell-summary-title">Resumen del proyecto</h3>

                <div className="shell-summary-list">
                  <div className="shell-summary-item">
                    <span className="shell-summary-label">Negocio</span>
                    <span className="shell-summary-value">
                      {summary.businessName}
                    </span>
                  </div>

                  <div className="shell-summary-item">
                    <span className="shell-summary-label">Industria</span>
                    <span className="shell-summary-value">
                      {summary.industry}
                    </span>
                  </div>

                  <div className="shell-summary-item">
                    <span className="shell-summary-label">Objetivo</span>
                    <span className="shell-summary-value">{summary.goal}</span>
                  </div>

                  <div className="shell-summary-item">
                    <span className="shell-summary-label">Paquete</span>
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
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at top, rgba(76, 29, 149, 0.22), transparent 32%),
            radial-gradient(circle at 78% 24%, rgba(0, 153, 255, 0.12), transparent 24%),
            linear-gradient(180deg, #05060a 0%, #070a12 48%, #05060a 100%);
          color: #ffffff;
        }

        .shell-bg-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.6;
        }

        .shell-bg-orb--violet {
          top: -120px;
          left: 18%;
          width: 420px;
          height: 420px;
          background: rgba(124, 58, 237, 0.22);
        }

        .shell-bg-orb--blue {
          top: 180px;
          right: -80px;
          width: 340px;
          height: 340px;
          background: rgba(14, 165, 233, 0.16);
        }

        .shell-bg-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
          background-size: 120px 120px;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55), transparent 85%);
        }

        .shell-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(6, 7, 10, 0.78);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .shell-header-inner {
          position: relative;
          max-width: 1440px;
          margin: 0 auto;
          padding: 22px 40px 18px;
        }

        .shell-brand-wrap {
          display: flex;
          align-items: center;
        }

        .shell-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .shell-logo-box {
          position: relative;
          width: 56px;
          height: 56px;
          flex: 0 0 56px;
          filter: drop-shadow(0 0 16px rgba(124, 58, 237, 0.22));
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
          color: #ffffff;
        }

        .shell-brand-subtitle {
          margin-top: 6px;
          font-size: 15px;
          line-height: 1.2;
          color: rgba(255, 255, 255, 0.62);
          font-weight: 500;
        }

        .shell-main {
          position: relative;
          z-index: 1;
          padding: 34px 0 72px;
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
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.82);
        }

        .shell-progress-value {
          font-size: 15px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.64);
        }

        .shell-progress-track {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 999px;
          overflow: hidden;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
        }

        .shell-progress-bar {
          height: 100%;
          border-radius: 999px;
          background:
            linear-gradient(90deg, #7c3aed 0%, #8b5cf6 42%, #38bdf8 100%);
          box-shadow:
            0 0 22px rgba(124, 58, 237, 0.34),
            0 0 30px rgba(56, 189, 248, 0.16);
          transition: width 0.25s ease;
        }

        .shell-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: start;
        }

        .shell-grid.shell-grid--full {
          grid-template-columns: minmax(0, 1fr);
        }

        .shell-content {
          min-width: 0;
        }

        .shell-summary {
          position: sticky;
          top: 112px;
          overflow: hidden;
          background:
            linear-gradient(180deg, rgba(13, 16, 26, 0.88) 0%, rgba(10, 12, 20, 0.88) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 28px 24px;
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.28),
            0 12px 40px rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .shell-summary-glow {
          position: absolute;
          inset: auto auto 0 -30px;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.12);
          filter: blur(48px);
          pointer-events: none;
        }

        .shell-summary-title {
          position: relative;
          margin: 0 0 18px;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .shell-summary-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .shell-summary-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
        }

        .shell-summary-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8b5cf6;
        }

        .shell-summary-value {
          font-size: 15px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.88);
          word-break: break-word;
        }

        .shell-brand-skeleton {
          display: flex;
          align-items: center;
        }

        .shell-brand-skeleton-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .shell-brand-skeleton-logo {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
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
          background: rgba(255, 255, 255, 0.08);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-brand-skeleton-subtitle {
          width: 92px;
          height: 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
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
          background: rgba(255, 255, 255, 0.08);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-progress-skeleton-value {
          width: 44px;
          height: 18px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .shell-progress-skeleton-track {
          width: 100%;
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
        }

        .shell-progress-skeleton-bar {
          width: 38%;
          height: 100%;
          border-radius: 999px;
          background: rgba(139, 92, 246, 0.4);
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
            top: auto;
          }
        }

        @media (max-width: 768px) {
          .shell-header-inner {
            padding: 18px 20px 16px;
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
            gap: 12px;
          }

          .shell-logo-box {
            width: 46px;
            height: 46px;
            flex-basis: 46px;
          }

          .shell-brand-title {
            font-size: 22px;
            letter-spacing: 0.14em;
          }

          .shell-brand-subtitle {
            font-size: 13px;
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