"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ScopeConfirmationCardProps = {
  packageName: string;
  includedItems: string[];
  excludedItems: string[];
  optionalAddons: string[];
};

export default function ScopeConfirmationCard({
  packageName,
  includedItems,
  excludedItems,
  optionalAddons,
}: ScopeConfirmationCardProps) {
  const [acceptedScope, setAcceptedScope] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon)
        ? prev.filter((item) => item !== addon)
        : [...prev, addon]
    );
  };

  const canContinue = useMemo(() => acceptedScope, [acceptedScope]);

    const handleContinue = () => {
    if (!acceptedScope) {
        setError("Debes confirmar que entiendes el alcance para continuar.");
        return;
    }

    sessionStorage.setItem(
        "nexoru_scope_confirmation",
        JSON.stringify({
        acceptedScope: true,
        selectedAddons,
        })
    );

    window.location.href = "/onboarding/executive-summary";
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
          Confirmación de alcance
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
          Esto incluye tu paquete recomendado
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
          Antes de continuar, revisa claramente lo que sí incluye el paquete{" "}
          <strong>{packageName}</strong>, lo que queda fuera del alcance base y
          los complementos opcionales que podrían añadirse después.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
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
              fontSize: "22px",
              fontWeight: 700,
              color: "#2B2F36",
              margin: "0 0 18px",
            }}
          >
            Incluye
          </h3>

          <div style={{ display: "grid", gap: "12px" }}>
            {includedItems.map((item, index) => (
              <div
                key={index}
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
            backgroundColor: "#FFF8F5",
            border: "1px solid #F3D4C2",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#2B2F36",
              margin: "0 0 18px",
            }}
          >
            No incluye
          </h3>

          <div style={{ display: "grid", gap: "12px" }}>
            {excludedItems.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #F3D4C2",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  color: "#7C2D12",
                  lineHeight: 1.5,
                }}
              >
                {item}
              </div>
            ))}
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
            fontSize: "22px",
            fontWeight: 700,
            color: "#2B2F36",
            margin: "0 0 18px",
          }}
        >
          Add-ons opcionales
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {optionalAddons.map((addon) => {
            const active = selectedAddons.includes(addon);

            return (
              <button
                key={addon}
                type="button"
                onClick={() => toggleAddon(addon)}
                style={{
                  border: active ? "1px solid #3A3D91" : "1px solid #D1D5DB",
                  backgroundColor: active ? "#EEF1FF" : "#FFFFFF",
                  color: active ? "#2B2F36" : "#4A4F57",
                  borderRadius: "999px",
                  padding: "10px 16px",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {addon}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          marginBottom: "24px",
          backgroundColor: "#F8F9FC",
          border: "1px solid #E5E7EB",
          borderRadius: "18px",
          padding: "20px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={acceptedScope}
            onChange={(e) => {
              setAcceptedScope(e.target.checked);
              if (e.target.checked) setError("");
            }}
            style={{
              marginTop: "3px",
              width: "18px",
              height: "18px",
            }}
          />

          <span
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#2B2F36",
            }}
          >
            Confirmo que entiendo lo que incluye este paquete, lo que queda
            fuera del alcance base y que cualquier requerimiento adicional puede
            implicar una ampliación de alcance o un add-on.
          </span>
        </label>

        {error && (
          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#DC2626",
              fontWeight: 500,
            }}
          >
            {error}
          </p>
        )}
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
          href="/onboarding/package-recommendation"
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
            backgroundColor: canContinue ? "#2B2F36" : "#9CA3AF",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: canContinue ? "pointer" : "not-allowed",
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}