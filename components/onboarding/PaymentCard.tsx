"use client";

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

type PaymentCardProps = {
  packageName: string;
  setupPrice: string;
  monthlyPrice: string;
  selectedAddons: SelectedAddonItem[];
  addonsSetupTotal: string;
  addonsMonthlyTotal: string;
  totalInitial: string;
  totalMonthly: string;
  isSubmitting: boolean;
  submitError: string;
  onBack: () => void;
  onContinue: () => Promise<void>;
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

export default function PaymentCard({
  packageName,
  setupPrice,
  monthlyPrice,
  selectedAddons,
  addonsSetupTotal,
  addonsMonthlyTotal,
  totalInitial,
  totalMonthly,
  isSubmitting,
  submitError,
  onBack,
  onContinue,
}: PaymentCardProps) {
  return (
    <div className="nx-page-card">
      <span className="nx-pill">Confirmación · Alcance</span>

      <div className="nx-section" style={{ marginTop: 24 }}>
        <h1 className="nx-title">Confirmemos tu alcance inicial</h1>

        <p className="nx-subtitle">
          Revisa el paquete seleccionado, los complementos elegidos y el monto
          estimado para avanzar con tu resumen ejecutivo y reservación de sesión
          comercial Nexoru.
        </p>
      </div>

      <div className="nx-section">
        <div className="nx-package-panel">
          <div className="nx-panel-eyebrow">Paquete recomendado</div>

          <div className="nx-package-name">{packageName}</div>

          <div className="nx-summary-metrics-grid">
            <div className="nx-summary-metric-card">
              <div className="nx-summary-metric-label">Setup estimado</div>
              <div className="nx-summary-metric-value">
                {formatCurrency(setupPrice)}
              </div>
            </div>

            <div className="nx-summary-metric-card">
              <div className="nx-summary-metric-label">
                Mensualidad estimada
              </div>
              <div className="nx-summary-metric-value">
                {formatCurrency(monthlyPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-block-panel">
          <h3 className="nx-section-title">Add-ons seleccionados</h3>

          {selectedAddons.length === 0 ? (
            <div className="nx-empty-state">
              No seleccionaste add-ons adicionales.
            </div>
          ) : (
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
          )}
        </div>
      </div>

      <div className="nx-section nx-totals-grid">
        <div className="nx-total-card nx-total-card-soft">
          <div className="nx-panel-eyebrow">Setup add-ons seleccionados</div>
          <div className="nx-total-card-value">
            {formatCurrency(addonsSetupTotal)}
          </div>
        </div>

        <div className="nx-total-card nx-total-card-soft">
          <div className="nx-panel-eyebrow">
            Mensualidad add-ons seleccionados
          </div>
          <div className="nx-total-card-value">
            {formatCurrency(addonsMonthlyTotal)}
          </div>
        </div>
      </div>

      <div className="nx-section nx-totals-grid">
        <div className="nx-total-card nx-total-card-strong">
          <div className="nx-panel-eyebrow">Total inicial estimado</div>
          <div className="nx-total-card-value nx-total-card-value-lg">
            {formatCurrency(totalInitial)}
          </div>
          <p className="nx-total-card-copy">
            Setup del paquete más setup de add-ons seleccionados.
          </p>
        </div>

        <div className="nx-total-card nx-total-card-strong">
          <div className="nx-panel-eyebrow">Total mensual estimado</div>
          <div className="nx-total-card-value nx-total-card-value-lg">
            {formatCurrency(totalMonthly)}
          </div>
          <p className="nx-total-card-copy">
            Mensualidad del paquete más mensualidad de add-ons seleccionados.
          </p>
        </div>
      </div>

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
          style={{ minWidth: 240 }}
        >
          {isSubmitting ? (
            <span className="nx-inline-loading">
              <span className="nx-spinner" />
              Generando resumen ejecutivo...
            </span>
          ) : (
            "Ver resumen ejecutivo"
          )}
        </button>
      </div>

      <style jsx>{`
        .nx-section-title {
          margin: 0 0 18px;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-panel-eyebrow {
          margin-bottom: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #a78bfa;
        }

        .nx-package-panel,
        .nx-block-panel {
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.08);
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
          padding: 22px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            0 18px 50px rgba(0, 0, 0, 0.22);
        }

        .nx-package-name {
          margin-bottom: 20px;
          word-break: break-word;
          font-size: 30px;
          line-height: 1.15;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-summary-metrics-grid,
        .nx-totals-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .nx-summary-metric-card,
        .nx-total-card {
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 18px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .nx-summary-metric-card {
          background: rgba(255, 255, 255, 0.035);
        }

        .nx-total-card-soft {
          background: rgba(255, 255, 255, 0.035);
        }

        .nx-total-card-strong {
          background:
            linear-gradient(
              180deg,
              rgba(124, 58, 237, 0.12) 0%,
              rgba(37, 99, 235, 0.08) 100%
            ),
            rgba(255, 255, 255, 0.03);
          border-color: rgba(124, 58, 237, 0.18);
        }

        .nx-summary-metric-label {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.62);
        }

        .nx-summary-metric-value,
        .nx-total-card-value {
          word-break: break-word;
          font-size: 26px;
          line-height: 1.15;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-total-card-value-lg {
          font-size: 34px;
        }

        .nx-total-card-copy {
          margin: 10px 0 0;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.68);
        }

        .nx-empty-state {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 14px 16px;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.66);
        }

        .nx-addon-list {
          display: grid;
          gap: 14px;
        }

        .nx-addon-item {
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
        }

        .nx-addon-item-main {
          min-width: 0;
        }

        .nx-addon-item-name {
          word-break: break-word;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-addon-item-description {
          margin-top: 6px;
          word-break: break-word;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.66);
        }

        .nx-addon-item-pricing {
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.7;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
        }

        .nx-addon-item-pricing-muted {
          color: rgba(255, 255, 255, 0.58);
        }

        @media (min-width: 768px) {
          .nx-section-title {
            font-size: 24px;
          }

          .nx-package-panel,
          .nx-block-panel {
            padding: 30px;
          }

          .nx-package-name {
            font-size: 36px;
          }

          .nx-summary-metrics-grid,
          .nx-totals-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .nx-summary-metric-card,
          .nx-total-card {
            padding: 22px;
          }

          .nx-summary-metric-value {
            font-size: 30px;
          }

          .nx-total-card-value-lg {
            font-size: 40px;
          }

          .nx-addon-item {
            padding: 18px;
          }

          .nx-addon-item {
            display: flex;
            gap: 18px;
            align-items: flex-start;
            justify-content: space-between;
          }

          .nx-addon-item-pricing {
            margin-top: 0;
            min-width: 180px;
            text-align: right;
          }
        }
      `}</style>
    </div>
  );
}