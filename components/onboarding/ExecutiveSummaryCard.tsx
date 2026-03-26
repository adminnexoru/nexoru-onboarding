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
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#E8EBF8",
            color: "#3A3D91",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 14px",
            borderRadius: "999px",
            marginBottom: "18px",
          }}
        >
          Resumen ejecutivo
        </div>

        <h2
          style={{
            fontSize: "42px",
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 16px",
          }}
        >
          Tu configuración Nexoru está lista
        </h2>

        <p
          style={{
            fontSize: "19px",
            lineHeight: 1.6,
            color: "#4A4F57",
            maxWidth: "920px",
            margin: 0,
          }}
        >
          Este es el resumen consolidado de tu onboarding. Aquí puedes revisar
          el contexto del negocio, la solución recomendada y la inversión
          estimada antes de agendar tu sesión de entendimiento.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            backgroundColor: "#F8F9FC",
            border: "1px solid #E5E7EB",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#2B2F36",
              margin: "0 0 18px",
            }}
          >
            Resumen del caso
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "14px 16px",
              }}
            >
              <strong style={{ color: "#2B2F36" }}>Negocio:</strong>{" "}
              <span style={{ color: "#4A4F57" }}>{businessName}</span>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "14px 16px",
              }}
            >
              <strong style={{ color: "#2B2F36" }}>Industria:</strong>{" "}
              <span style={{ color: "#4A4F57" }}>{industry}</span>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "14px 16px",
              }}
            >
              <strong style={{ color: "#2B2F36" }}>Objetivo principal:</strong>{" "}
              <span style={{ color: "#4A4F57" }}>{goal}</span>
            </div>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "14px 16px",
              }}
            >
              <strong style={{ color: "#2B2F36" }}>Paquete recomendado:</strong>{" "}
              <span style={{ color: "#4A4F57" }}>{packageName}</span>
            </div>

            {paymentReference ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  padding: "14px 16px",
                }}
              >
                <strong style={{ color: "#2B2F36" }}>Referencia de pago:</strong>{" "}
                <span style={{ color: "#4A4F57" }}>{paymentReference}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#2B2F36",
              margin: "0 0 18px",
            }}
          >
            Inversión estimada
          </h3>

          <div style={{ display: "grid", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "#F8F9FC",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "6px",
                }}
              >
                Setup inicial total
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#2B2F36",
                }}
              >
                {formatCurrency(totalSetupPrice)}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#F8F9FC",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "6px",
                }}
              >
                Mensualidad estimada total
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#2B2F36",
                }}
              >
                {formatCurrency(totalMonthlyPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "28px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 18px",
          }}
        >
          Desglose económico
        </h3>

        <div style={{ display: "grid", gap: "14px" }}>
          <div
            style={{
              backgroundColor: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "14px 16px",
            }}
          >
            <strong style={{ color: "#2B2F36" }}>Setup paquete:</strong>{" "}
            <span style={{ color: "#4A4F57" }}>
              {formatCurrency(packageSetupPrice)}
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "14px 16px",
            }}
          >
            <strong style={{ color: "#2B2F36" }}>Mensualidad paquete:</strong>{" "}
            <span style={{ color: "#4A4F57" }}>
              {formatCurrency(packageMonthlyPrice)}
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "14px 16px",
            }}
          >
            <strong style={{ color: "#2B2F36" }}>Setup add-ons:</strong>{" "}
            <span style={{ color: "#4A4F57" }}>
              {formatCurrency(addonsSetupTotal)}
            </span>
          </div>

          <div
            style={{
              backgroundColor: "#F8F9FC",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "14px 16px",
            }}
          >
            <strong style={{ color: "#2B2F36" }}>Mensualidad add-ons:</strong>{" "}
            <span style={{ color: "#4A4F57" }}>
              {formatCurrency(addonsMonthlyTotal)}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "28px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 18px",
          }}
        >
          Add-ons seleccionados
        </h3>

        {selectedAddons.length > 0 ? (
          <div style={{ display: "grid", gap: "14px" }}>
            {selectedAddons.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#F8F9FC",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div style={{flex: "1 1 260px", minWidth:0}}>
                  <div
                    style={{
                      color: "#2B2F36",
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "6px",
                    }}
                  >
                    {item.addon.name}
                  </div>
                  <div
                    style={{
                      color: "#6B7280",
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.addon.description || "Complemento opcional"}
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    minWidth: "180px",
                    color: "#2B2F36",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                    marginLeft: "auto",
                  }}
                >
                  <div>Setup {formatCurrency(item.addon.setupPrice)}</div>
                  <div>Mensual {formatCurrency(item.addon.monthlyPrice)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: "#6B7280",
              lineHeight: 1.6,
            }}
          >
            No seleccionaste add-ons opcionales en esta etapa.
          </p>
        )}
      </div>

      <div
        style={{
          marginBottom: "28px",
          backgroundColor: "#F8F9FC",
          border: "1px solid #E5E7EB",
          borderRadius: "18px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 12px",
          }}
        >
          Siguiente paso
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: 1.6,
            color: "#4A4F57",
          }}
        >
          Agenda una sesión de entendimiento con Nexoru para revisar tu caso,
          validar alcance y continuar el proceso comercial.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginTop: "8px",
        }}
      >
        <Link
          href="/onboarding/payment"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #D1D5DB",
            backgroundColor: "#FFFFFF",
            color: "#2B2F36",
            borderRadius: "14px",
            padding: "14px 22px",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Atrás
        </Link>

        <Link
          href="/onboarding/schedule-session"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            backgroundColor: "#2B2F36",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Agendar sesión
        </Link>
      </div>
    </div>
  );
}