"use client";

import { formatRecommendationMoney } from "@/lib/services/package-recommendation";

type Recommendation = {
  packageCode: string | null;
  packageName: string;
  packageDescription: string;
  setupPrice: string | null;
  monthlyPrice: string | null;
  rationale: string[];
  strategicAnalysis: string;
  notes: string;
  recommendationSource: "openai" | "fallback";
};

type Props = {
  recommendation: Recommendation;
  isSubmitting?: boolean;
  submitError?: string;
  onBack: () => void;
  onContinue: () => Promise<void>;
};

export default function PackageRecommendationCard({
  recommendation,
  isSubmitting = false,
  submitError = "",
  onBack,
  onContinue,
}: Props) {
  return (
    <div className="nx-page-card">
      <span className="nx-pill">Recomendación preliminar</span>

      <div className="nx-section" style={{ marginTop: 24 }}>
        <h1 className="nx-title">Este es el paquete recomendado para tu caso</h1>

        <p className="nx-subtitle">
          Con base en la información de tu negocio, objetivo, proceso actual y
          volumen operativo, esta es la configuración Nexoru que mejor encaja en
          esta etapa.
        </p>
      </div>

      <div className="nx-section">
        <div className="nx-recommendation-panel">
          <div className="nx-recommendation-eyebrow">Paquete sugerido</div>

          <div className="nx-recommendation-name">
            {recommendation.packageName}
          </div>

          {recommendation.packageDescription ? (
            <p className="nx-recommendation-description">
              {recommendation.packageDescription}
            </p>
          ) : null}

          <div className="nx-metrics-grid">
            <div className="nx-metric-card">
              <div className="nx-metric-label">Setup estimado</div>
              <div className="nx-metric-value">
                {formatRecommendationMoney(recommendation.setupPrice)}
              </div>
            </div>

            <div className="nx-metric-card">
              <div className="nx-metric-label">Mensualidad estimada</div>
              <div className="nx-metric-value">
                {formatRecommendationMoney(recommendation.monthlyPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="nx-section">
        <h3 className="nx-section-title">¿Por qué esta recomendación?</h3>

        <div className="nx-rationale-grid">
          {recommendation.rationale.map((item, index) => (
            <div key={`${item}-${index}`} className="nx-rationale-card">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="nx-section">
        <div
          className={`nx-analysis-panel ${
            recommendation.recommendationSource === "openai"
              ? "nx-analysis-panel-openai"
              : "nx-analysis-panel-fallback"
          }`}
        >
          <div className="nx-analysis-label">
            {recommendation.recommendationSource === "openai"
              ? "Análisis estratégico asistido por OpenAI"
              : "Análisis estratégico Nexoru"}
          </div>

          <div className="nx-analysis-copy">
            {recommendation.strategicAnalysis}
          </div>
        </div>
      </div>

      {recommendation.notes ? (
        <div className="nx-section">
          <div className="nx-notes-panel">{recommendation.notes}</div>
        </div>
      ) : null}

      {submitError ? (
        <div className="nx-section">
          <div className="nx-alert nx-alert--error">{submitError}</div>
        </div>
      ) : null}

      <div className="nx-actions">
        <button
          type="button"
          onClick={onBack}
          className="nx-btn nx-btn-secondary"
          style={{ minWidth: 130 }}
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={isSubmitting}
          className={`nx-btn ${
            isSubmitting ? "nx-btn-muted" : "nx-btn-primary"
          }`}
          style={{ minWidth: 180 }}
        >
          {isSubmitting ? (
            <span className="nx-inline-loading">
              <span className="nx-spinner" />
              Guardando...
            </span>
          ) : (
            "Continuar"
          )}
        </button>
      </div>

      <style jsx>{`
        .nx-section-title {
          margin: 0 0 18px;
          font-size: 24px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-recommendation-panel {
          border-radius: 26px;
          border: 1px solid rgba(124, 58, 237, 0.18);
          background:
            radial-gradient(
              circle at top right,
              rgba(56, 189, 248, 0.08),
              transparent 30%
            ),
            linear-gradient(
              180deg,
              rgba(17, 21, 34, 0.92) 0%,
              rgba(10, 13, 23, 0.92) 100%
            );
          padding: 22px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            0 18px 50px rgba(0, 0, 0, 0.22);
        }

        .nx-recommendation-eyebrow {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #a78bfa;
          letter-spacing: 0.02em;
        }

        .nx-recommendation-name {
          margin-bottom: 10px;
          font-size: 30px;
          line-height: 1.15;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-recommendation-description {
          margin: 0 0 22px;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.74);
        }

        .nx-metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .nx-metric-card {
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          padding: 18px 18px;
        }

        .nx-metric-label {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.62);
        }

        .nx-metric-value {
          word-break: break-word;
          font-size: 26px;
          line-height: 1.15;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-rationale-grid {
          display: grid;
          gap: 14px;
        }

        .nx-rationale-card {
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 18px 18px;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.8);
          word-break: break-word;
        }

        .nx-analysis-panel {
          border-radius: 26px;
          padding: 22px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            0 18px 50px rgba(0, 0, 0, 0.18);
        }

        .nx-analysis-panel-openai {
          border: 1px solid rgba(250, 204, 21, 0.22);
          background:
            linear-gradient(
              180deg,
              rgba(120, 53, 15, 0.22) 0%,
              rgba(66, 32, 6, 0.22) 100%
            );
        }

        .nx-analysis-panel-fallback {
          border: 1px solid rgba(124, 58, 237, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(76, 29, 149, 0.16) 0%,
              rgba(15, 23, 42, 0.22) 100%
            );
        }

        .nx-analysis-label {
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #fcd34d;
        }

        .nx-analysis-copy {
          white-space: pre-line;
          word-break: break-word;
          font-size: 15px;
          line-height: 1.85;
          color: rgba(255, 248, 220, 0.9);
        }

        .nx-notes-panel {
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 18px 18px;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.78);
          word-break: break-word;
        }

        @media (min-width: 768px) {
          .nx-section-title {
            font-size: 28px;
          }

          .nx-recommendation-panel,
          .nx-analysis-panel {
            padding: 30px;
          }

          .nx-recommendation-name {
            font-size: 36px;
          }

          .nx-metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .nx-metric-card {
            padding: 22px;
          }

          .nx-metric-value {
            font-size: 30px;
          }

          .nx-rationale-card,
          .nx-notes-panel {
            padding: 20px 22px;
            font-size: 16px;
          }

          .nx-analysis-copy {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}