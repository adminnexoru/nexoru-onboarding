"use client";

import Link from "next/link";

type SelectedAddonItem = {
  id: string;
  sessionId: string;
  addonId: string;
  createdAt?: string | Date;
  addon: {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    setupPrice: string | null;
    monthlyPrice: string | null;
  };
};

type ExecutiveSummaryCardProps = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
  packageSetupPrice: string;
  packageMonthlyPrice: string;
  selectedAddons: SelectedAddonItem[];
  addonsSetupTotal: string;
  addonsMonthlyTotal: string;
  totalSetupPrice: string;
  totalMonthlyPrice: string;
  paymentReference: string;
};

function formatCurrency(value: string | null | undefined) {
  if (!value) return "$0";

  const amount = Number(value);

  if (Number.isNaN(amount)) return "$0";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ExecutiveSummaryCard({
  businessName,
  industry,
  goal,
  packageName,
  packageSetupPrice,
  packageMonthlyPrice,
  selectedAddons,
  addonsSetupTotal,
  addonsMonthlyTotal,
  totalSetupPrice,
  totalMonthlyPrice,
  paymentReference,
}: ExecutiveSummaryCardProps) {
  return (
    <div className="nx-page-card">
      <span className="nx-pill">Resumen ejecutivo</span>

      <div className="nx-section" style={{ marginTop: 24 }}>
        <h1 className="nx-title">Tu configuración Nexoru está lista</h1>

        <p className="nx-subtitle">
          Este es el resumen consolidado de tu onboarding. Aquí puedes revisar
          el contexto del negocio, la solución recomendada y la inversión
          estimada antes de agendar tu sesión de entendimiento.
        </p>
      </div>

      <div className="nx-section nx-summary-top-grid">
        <div className="nx-summary-panel">
          <h3 className="nx-section-title">Resumen del caso</h3>

          <div className="nx-summary-items">
            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">Negocio:</strong>{" "}
              <span className="nx-summary-item-value">{businessName}</span>
            </div>

            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">Industria:</strong>{" "}
              <span className="nx-summary-item-value">{industry}</span>
            </div>

            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">
                Objetivo principal:
              </strong>{" "}
              <span className="nx-summary-item-value">{goal}</span>
            </div>

            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">
                Paquete recomendado:
              </strong>{" "}
              <span className="nx-summary-item-value">{packageName}</span>
            </div>

            {paymentReference ? (
              <div className="nx-summary-item">
                <strong className="nx-summary-item-strong">
                  Referencia de pago:
                </strong>{" "}
                <span className="nx-summary-item-value nx-break-all">
                  {paymentReference}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="nx-summary-panel nx-summary-panel-strong">
          <h3 className="nx-section-title">Inversión estimada</h3>

          <div className="nx-metric-stack">
            <div className="nx-metric-card">
              <div className="nx-metric-label">Setup inicial total</div>
              <div className="nx-metric-value">
                {formatCurrency(totalSetupPrice)}
              </div>
            </div>

            <div className="nx-metric-card">
              <div className="nx-metric-label">
                Mensualidad estimada total
              </div>
              <div className="nx-metric-value">
                {formatCurrency(totalMonthlyPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-summary-panel">
          <h3 className="nx-section-title">Desglose económico</h3>

          <div className="nx-summary-items">
            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">Setup paquete:</strong>{" "}
              <span className="nx-summary-item-value">
                {formatCurrency(packageSetupPrice)}
              </span>
            </div>

            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">
                Mensualidad paquete:
              </strong>{" "}
              <span className="nx-summary-item-value">
                {formatCurrency(packageMonthlyPrice)}
              </span>
            </div>

            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">Setup add-ons:</strong>{" "}
              <span className="nx-summary-item-value">
                {formatCurrency(addonsSetupTotal)}
              </span>
            </div>

            <div className="nx-summary-item">
              <strong className="nx-summary-item-strong">
                Mensualidad add-ons:
              </strong>{" "}
              <span className="nx-summary-item-value">
                {formatCurrency(addonsMonthlyTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-summary-panel">
          <h3 className="nx-section-title">Add-ons seleccionados</h3>

          {selectedAddons.length > 0 ? (
            <div className="nx-addon-list">
              {selectedAddons.map((item) => (
                <div key={item.id} className="nx-addon-item">
                  <div className="nx-addon-item-main">
                    <div className="nx-addon-item-name">{item.addon.name}</div>
                    <div className="nx-addon-item-description">
                      {item.addon.description || "Complemento opcional"}
                    </div>
                  </div>

                  <div className="nx-addon-item-pricing">
                    <div>Setup {formatCurrency(item.addon.setupPrice)}</div>
                    <div className="nx-addon-item-pricing-muted">
                      Mensual {formatCurrency(item.addon.monthlyPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="nx-empty-copy">
              No seleccionaste add-ons opcionales en esta etapa.
            </p>
          )}
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-next-step-panel">
          <h3 className="nx-next-step-title">Siguiente paso</h3>

          <p className="nx-next-step-copy">
            Agenda una sesión de entendimiento con Nexoru para revisar tu caso,
            validar alcance y continuar el proceso comercial.
          </p>
        </div>
      </div>

      <div className="nx-actions">
        <Link
          href="/onboarding/payment"
          className="nx-btn nx-btn-secondary nx-link-btn"
          style={{ minWidth: 130 }}
        >
          Atrás
        </Link>

        <Link
          href="/onboarding/schedule-session"
          className="nx-btn nx-btn-primary nx-link-btn"
          style={{ minWidth: 220 }}
        >
          Agendar sesión
        </Link>
      </div>

      <style jsx>{`
        .nx-section-title {
          margin: 0 0 18px;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-summary-top-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .nx-summary-panel {
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(
              180deg,
              rgba(17, 21, 34, 0.92) 0%,
              rgba(10, 13, 23, 0.92) 100%
            );
          padding: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            0 18px 50px rgba(0, 0, 0, 0.18);
        }

        .nx-summary-panel-strong {
          background:
            radial-gradient(
              circle at top right,
              rgba(56, 189, 248, 0.08),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              rgba(17, 21, 34, 0.92) 0%,
              rgba(10, 13, 23, 0.92) 100%
            );
          border-color: rgba(124, 58, 237, 0.16);
        }

        .nx-summary-items {
          display: grid;
          gap: 12px;
        }

        .nx-summary-item {
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 14px 16px;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.74);
        }

        .nx-summary-item-strong {
          color: #ffffff;
        }

        .nx-summary-item-value {
          color: rgba(255, 255, 255, 0.78);
          word-break: break-word;
        }

        .nx-break-all {
          word-break: break-all;
        }

        .nx-metric-stack {
          display: grid;
          gap: 14px;
        }

        .nx-metric-card {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          padding: 18px;
        }

        .nx-metric-label {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.62);
        }

        .nx-metric-value {
          word-break: break-word;
          font-size: 28px;
          line-height: 1.15;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-addon-list {
          display: grid;
          gap: 14px;
        }

        .nx-addon-item {
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
        }

        .nx-addon-item-main {
          min-width: 0;
          flex: 1;
        }

        .nx-addon-item-name {
          margin-bottom: 6px;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 700;
          color: #ffffff;
          word-break: break-word;
        }

        .nx-addon-item-description {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.66);
          word-break: break-word;
        }

        .nx-addon-item-pricing {
          font-size: 14px;
          line-height: 1.7;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
        }

        .nx-addon-item-pricing-muted {
          color: rgba(255, 255, 255, 0.58);
        }

        .nx-empty-copy {
          margin: 0;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.66);
        }

        .nx-next-step-panel {
          border-radius: 20px;
          border: 1px solid rgba(124, 58, 237, 0.16);
          background:
            linear-gradient(
              180deg,
              rgba(124, 58, 237, 0.12) 0%,
              rgba(37, 99, 235, 0.06) 100%
            ),
            rgba(255, 255, 255, 0.03);
          padding: 20px;
        }

        .nx-next-step-title {
          margin: 0 0 10px;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-next-step-copy {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.76);
        }

        .nx-link-btn {
          text-decoration: none;
        }

        @media (min-width: 768px) {
          .nx-section-title {
            font-size: 24px;
          }

          .nx-summary-panel {
            padding: 24px;
          }

          .nx-metric-value {
            font-size: 30px;
          }

          .nx-addon-item {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
          }

          .nx-addon-item-pricing {
            min-width: 180px;
            text-align: right;
          }

          .nx-next-step-title {
            font-size: 22px;
          }

          .nx-next-step-copy {
            font-size: 16px;
          }
        }

        @media (min-width: 1100px) {
          .nx-summary-top-grid {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}