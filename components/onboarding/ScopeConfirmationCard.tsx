"use client";

import { useEffect, useMemo, useState } from "react";

type OptionalAddon = {
  id: string;
  code: string;
  name: string;
  description: string;
  setupPrice: string | null;
  monthlyPrice: string | null;
};

type ScopeConfirmationCardProps = {
  packageName: string;
  includedItems: string[];
  excludedItems: string[];
  optionalAddons: OptionalAddon[];
  acceptedScope: boolean;
  selectedAddonIds: string[];
  isSubmitting: boolean;
  submitError: string;
  onBack: () => void;
  onContinue: (payload: {
    acceptedScope: boolean;
    selectedAddonIds: string[];
  }) => Promise<void>;
};

function formatMoney(value: string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatAddonPricing(
  setupPrice: string | null,
  monthlyPrice: string | null
) {
  const setup = Number(setupPrice ?? 0);
  const monthly = Number(monthlyPrice ?? 0);

  if (setup <= 0 && monthly <= 0) {
    return "Precio por definir";
  }

  if (setup <= 0 && monthly > 0) {
    return `${formatMoney(monthlyPrice)} / mes`;
  }

  if (setup > 0 && monthly <= 0) {
    return `Setup ${formatMoney(setupPrice)}`;
  }

  return `Setup ${formatMoney(setupPrice)} · Mensual ${formatMoney(
    monthlyPrice
  )}`;
}

export default function ScopeConfirmationCard({
  packageName,
  includedItems,
  excludedItems,
  optionalAddons,
  acceptedScope,
  selectedAddonIds,
  isSubmitting,
  submitError,
  onBack,
  onContinue,
}: ScopeConfirmationCardProps) {
  const [accepted, setAccepted] = useState(acceptedScope);
  const [selected, setSelected] = useState<string[]>(selectedAddonIds);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canContinue = useMemo(() => accepted, [accepted]);

  const toggleAddon = (addonId: string) => {
    setSelected((prev) =>
      prev.includes(addonId)
        ? prev.filter((item) => item !== addonId)
        : [...prev, addonId]
    );
  };

  const handleContinue = async () => {
    if (!accepted) {
      setError("Debes confirmar que entiendes el alcance para continuar.");
      return;
    }

    setError("");

    await onContinue({
      acceptedScope: true,
      selectedAddonIds: selected,
    });
  };

  return (
    <div className="nx-page-card">
      <span className="nx-pill">Confirmación de alcance</span>

      <div className="nx-section" style={{ marginTop: 24 }}>
        <h1 className="nx-title">Esto incluye tu paquete recomendado</h1>

        <p className="nx-subtitle">
          Antes de continuar, revisa claramente lo que sí incluye el paquete{" "}
          <strong>{packageName}</strong>, lo que queda fuera del alcance base y
          los complementos opcionales que podrían añadirse después.
        </p>
      </div>

      <div className="nx-section nx-scope-grid">
        <div className="nx-scope-panel">
          <h3 className="nx-scope-title">Incluye</h3>

          <div className="nx-scope-items">
            {includedItems.map((item, index) => (
              <div key={index} className="nx-scope-item">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="nx-scope-panel nx-scope-panel-excluded">
          <h3 className="nx-scope-title">No incluye</h3>

          <div className="nx-scope-items">
            {excludedItems.map((item, index) => (
              <div key={index} className="nx-scope-item nx-scope-item-excluded">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-addons-panel">
          <h3 className="nx-scope-title">Add-ons opcionales</h3>

          {optionalAddons.length === 0 ? (
            <div className="nx-empty-copy">
              Este paquete no tiene add-ons opcionales configurados por ahora.
            </div>
          ) : (
            <div className="nx-addons-grid">
              {optionalAddons.map((addon) => {
                const active = selected.includes(addon.id);

                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`nx-addon-card ${
                      active ? "nx-addon-card-active" : ""
                    }`}
                  >
                    <div className="nx-addon-name">{addon.name}</div>

                    {addon.description ? (
                      <div className="nx-addon-description">
                        {addon.description}
                      </div>
                    ) : null}

                    <div className="nx-addon-price">
                      {formatAddonPricing(addon.setupPrice, addon.monthlyPrice)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-confirm-panel">
          <label className="nx-confirm-label">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                if (e.target.checked) {
                  setError("");
                }
              }}
              className="nx-confirm-checkbox"
            />

            <span className="nx-confirm-copy">
              Confirmo que entiendo lo que incluye este paquete, lo que queda
              fuera del alcance base y que cualquier requerimiento adicional
              puede implicar una ampliación de alcance o un add-on.
            </span>
          </label>

          {error ? <p className="nx-field-error">{error}</p> : null}
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
          onClick={handleContinue}
          disabled={isSubmitting || !canContinue}
          className={`nx-btn ${
            isSubmitting || !canContinue ? "nx-btn-muted" : "nx-btn-primary"
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
        .nx-scope-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .nx-scope-panel,
        .nx-addons-panel,
        .nx-confirm-panel {
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .nx-scope-panel-excluded {
          border-color: rgba(251, 146, 60, 0.22);
          background: linear-gradient(
            180deg,
            rgba(124, 45, 18, 0.12) 0%,
            rgba(255, 255, 255, 0.03) 100%
          );
        }

        .nx-scope-title {
          margin: 0 0 16px;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-scope-items {
          display: grid;
          gap: 12px;
        }

        .nx-scope-item {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 14px 16px;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.88);
          word-break: break-word;
        }

        .nx-scope-item-excluded {
          border-color: rgba(251, 146, 60, 0.18);
          color: #fed7aa;
        }

        .nx-empty-copy {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.68);
        }

        .nx-addons-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .nx-addon-card {
          width: 100%;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 16px;
          text-align: left;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
          cursor: pointer;
        }

        .nx-addon-card:hover {
          transform: translateY(-1px);
          border-color: rgba(124, 58, 237, 0.34);
        }

        .nx-addon-card-active {
          border-color: rgba(124, 58, 237, 0.6);
          background:
            linear-gradient(
              180deg,
              rgba(124, 58, 237, 0.15) 0%,
              rgba(37, 99, 235, 0.08) 100%
            ),
            rgba(255, 255, 255, 0.03);
          box-shadow:
            0 0 0 1px rgba(124, 58, 237, 0.18),
            0 18px 44px rgba(76, 29, 149, 0.16);
        }

        .nx-addon-name {
          margin-bottom: 8px;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 700;
          color: #ffffff;
          word-break: break-word;
        }

        .nx-addon-description {
          margin-bottom: 10px;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.66);
          word-break: break-word;
        }

        .nx-addon-price {
          font-size: 14px;
          line-height: 1.65;
          color: #c4b5fd;
          word-break: break-word;
        }

        .nx-confirm-label {
          display: grid;
          grid-template-columns: 18px minmax(0, 1fr);
          align-items: start;
          gap: 12px;
          width: 100%;
        }

        .nx-confirm-checkbox {
          margin-top: 2px;
          width: 18px;
          height: 18px;
          min-width: 18px;
          max-width: 18px;
          accent-color: #7c3aed;
        }

        .nx-confirm-copy {
          min-width: 0;
          word-break: break-word;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.86);
        }

        @media (min-width: 768px) {
          .nx-scope-title {
            font-size: 22px;
          }

          .nx-scope-panel,
          .nx-addons-panel,
          .nx-confirm-panel {
            padding: 24px;
          }

          .nx-addons-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .nx-addon-card {
            padding: 18px;
          }

          .nx-confirm-copy {
            font-size: 16px;
          }
        }

        @media (min-width: 1200px) {
          .nx-scope-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 22px;
          }

          .nx-addons-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}