"use client";

import AppShell from "@/components/layout/AppShell";

export default function StartPage() {
  return (
    <AppShell
      step={1}
      totalSteps={5}
      progress={10}
      summary={{
        businessName: "",
        industry: "",
        goal: "",
        packageName: "",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "20px",
          padding: "36px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#E8EBF8",
            color: "#3A3D91",
            fontSize: "14px",
            fontWeight: 500,
            padding: "8px 14px",
            borderRadius: "999px",
            marginBottom: "20px",
          }}
        >
          Onboarding Nexoru
        </div>

        <h1
          style={{
            fontSize: "38px",
            lineHeight: 1.1,
            fontWeight: 700,
            margin: "0 0 20px",
            color: "#2B2F36",
            maxWidth: "720px",
          }}
        >
          Diseña tu sistema Nexoru
        </h1>

        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            color: "#4A4F57",
            maxWidth: "840px",
            margin: "0 0 28px",
          }}
        >
          En menos de 15 minutos definiremos la base operativa de tu negocio y
          te recomendaremos la mejor implementación.
        </p>

        <div
          style={{
            backgroundColor: "#F5F6F8",
            color: "#4A4F57",
            borderRadius: "14px",
            padding: "16px 18px",
            fontSize: "16px",
            marginBottom: "32px",
            maxWidth: "420px",
          }}
        >
          Tiempo estimado: 15 minutos
        </div>

        <button
          onClick={() => (window.location.href = "/onboarding/business-profile")}
          style={{
            backgroundColor: "#2B2F36",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "14px",
            padding: "16px 28px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Comenzar
        </button>
      </div>
    </AppShell>
  );
}