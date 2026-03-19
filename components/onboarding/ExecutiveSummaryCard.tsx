"use client";

import Link from "next/link";

type ExecutiveSummaryCardProps = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
  setupPrice: string;
  monthlyPrice: string;
  selectedAddons: string[];
};

export default function ExecutiveSummaryCard({
  businessName,
  industry,
  goal,
  packageName,
  setupPrice,
  monthlyPrice,
  selectedAddons,
}: ExecutiveSummaryCardProps) {
  const handleContinue = () => {
    sessionStorage.setItem(
      "nexoru_executive_summary_ready",
      JSON.stringify({
        readyForPayment: true,
      })
    );

    alert(
      "Resumen ejecutivo confirmado. La siguiente pantalla se construirá en la siguiente HU."
    );
  };

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
          estimada antes de pasar al pago.
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
                Setup inicial
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#2B2F36",
                }}
              >
                {setupPrice}
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
                Mensualidad
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#2B2F36",
                }}
              >
                {monthlyPrice}
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
          Add-ons seleccionados
        </h3>

        {selectedAddons.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {selectedAddons.map((addon) => (
              <div
                key={addon}
                style={{
                  border: "1px solid #3A3D91",
                  backgroundColor: "#EEF1FF",
                  color: "#2B2F36",
                  borderRadius: "999px",
                  padding: "10px 16px",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {addon}
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
          En la siguiente pantalla activaremos el pago del setup inicial para
          dar arranque formal al proyecto y disparar la creación automática de
          activos internos del onboarding Nexoru.
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
          href="/onboarding/scope-confirmation"
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

        <button
          type="button"
          onClick={handleContinue}
          style={{
            border: "none",
            backgroundColor: "#2B2F36",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continuar a pago
        </button>
      </div>
    </div>
  );
}