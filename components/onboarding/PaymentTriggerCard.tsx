"use client";

import Link from "next/link";
import { useState } from "react";

type PaymentTriggerCardProps = {
  packageName: string;
  setupPrice: string;
  monthlyPrice: string;
};

export default function PaymentTriggerCard({
  packageName,
  setupPrice,
  monthlyPrice,
}: PaymentTriggerCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentStart = () => {
    setIsProcessing(true);

    const paymentPayload = {
      packageName,
      setupPrice,
      monthlyPrice,
      paymentStatus: "initiated",
      paymentProvider: "mock",
      startedAt: new Date().toISOString(),
    };

    sessionStorage.setItem(
      "nexoru_payment_trigger",
      JSON.stringify(paymentPayload)
    );

    setTimeout(() => {
      setIsProcessing(false);
      alert(
        "Pago iniciado correctamente. La integración real con el proveedor de pago se construirá en la siguiente fase."
      );
    }, 700);
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
          Activación de pago
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
          Activa tu proyecto Nexoru
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
          El siguiente paso es activar el pago del setup inicial para arrancar
          formalmente tu proyecto y habilitar la generación operativa de
          documentos, estructura y handoff técnico.
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
            ¿Qué activa este pago?
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            {[
              "Inicio formal del proyecto",
              "Bloqueo del alcance acordado",
              "Preparación de activos internos",
              "Base para Config Pack y handoff operativo",
              "Arranque del flujo de implementación Nexoru",
            ].map((item) => (
              <div
                key={item}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  color: "#2B2F36",
                  lineHeight: 1.5,
                }}
              >
                {item}
              </div>
            ))}
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
            Resumen de activación
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
                Paquete
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#2B2F36",
                }}
              >
                {packageName}
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
                Mensualidad estimada posterior
              </div>
              <div
                style={{
                  fontSize: "24px",
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
          Nota importante
        </h3>

        <p
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: 1.6,
            color: "#4A4F57",
          }}
        >
          En esta versión del MVP, el pago se simula para validar la experiencia
          end-to-end del onboarding. La integración real con Mercado Pago se
          conectará en la siguiente fase técnica.
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
          href="/onboarding/executive-summary"
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
          onClick={handlePaymentStart}
          disabled={isProcessing}
          style={{
            border: "none",
            backgroundColor: isProcessing ? "#9CA3AF" : "#2B2F36",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: isProcessing ? "not-allowed" : "pointer",
          }}
        >
          {isProcessing ? "Iniciando..." : "Iniciar pago de setup"}
        </button>
      </div>
    </div>
  );
}