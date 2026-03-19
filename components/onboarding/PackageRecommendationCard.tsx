"use client";

import Link from "next/link";

type PackageRecommendation = {
  packageName: string;
  setupPrice: string;
  monthlyPrice: string;
  rationale: string[];
  notes?: string;
};

type PackageRecommendationCardProps = {
  recommendation: PackageRecommendation;
};

export default function PackageRecommendationCard({
  recommendation,
}: PackageRecommendationCardProps) {
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
          Recomendación preliminar
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
          Este es el paquete recomendado para tu caso
        </h2>

        <p
          style={{
            fontSize: "19px",
            lineHeight: 1.6,
            color: "#4A4F57",
            maxWidth: "900px",
            margin: 0,
          }}
        >
          Con base en la información de tu negocio, objetivo, proceso actual y
          volumen operativo, esta es la configuración Nexoru que mejor encaja
          en esta etapa.
        </p>
      </div>

      <div
        style={{
          border: "1px solid #E5E7EB",
          backgroundColor: "#F8F9FC",
          borderRadius: "20px",
          padding: "28px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            color: "#3A3D91",
            fontWeight: 600,
            marginBottom: "12px",
          }}
        >
          Paquete sugerido
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 700,
            color: "#2B2F36",
            marginBottom: "18px",
          }}
        >
          {recommendation.packageName}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
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
              Setup estimado
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#2B2F36",
              }}
            >
              {recommendation.setupPrice}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
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
              Mensualidad estimada
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#2B2F36",
              }}
            >
              {recommendation.monthlyPrice}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h3
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 18px",
          }}
        >
          ¿Por qué esta recomendación?
        </h3>

        <div style={{ display: "grid", gap: "14px" }}>
          {recommendation.rationale.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                padding: "16px 18px",
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#4A4F57",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {recommendation.notes && (
        <div
          style={{
            marginBottom: "32px",
            backgroundColor: "#FFFBEA",
            border: "1px solid #FDE68A",
            borderRadius: "16px",
            padding: "18px",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "#92400E",
          }}
        >
          {recommendation.notes}
        </div>
      )}

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
          href="/onboarding/volume-operations"
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
          onClick={() => {
                sessionStorage.setItem(
                    "nexoru_package_recommendation",
                    JSON.stringify(recommendation)
                );
                window.location.href = "/onboarding/scope-confirmation";
                }}
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
          Continuar
        </button>
      </div>
    </div>
  );
}