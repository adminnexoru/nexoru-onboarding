"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BusinessProfileFormData = {
  legalName: string;
  commercialName: string;
  industry: string;
  country: string;
  city: string;
  websiteOrInstagram: string;
  whatsapp: string;
  operatingHours: string;
};

type BusinessProfileFormProps = {
  sessionToken: string;
  initialValues: BusinessProfileFormData;
  onSummaryChange?: (data: {
    businessName?: string;
    industry?: string;
  }) => void;
};

type FormErrors = Partial<Record<keyof BusinessProfileFormData, string>>;

export default function BusinessProfileForm({
  sessionToken,
  initialValues,
  onSummaryChange,
}: BusinessProfileFormProps) {
  const [formData, setFormData] = useState<BusinessProfileFormData>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const updateField = (field: keyof BusinessProfileFormData, value: string) => {
    const nextData = {
      ...formData,
      [field]: value,
    };

    setFormData(nextData);

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    onSummaryChange?.({
      businessName: nextData.commercialName,
      industry: nextData.industry,
    });
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.commercialName.trim()) {
      newErrors.commercialName = "El nombre comercial es obligatorio.";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "La industria o giro es obligatoria.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "El país es obligatorio.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "La ciudad es obligatoria.";
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "El WhatsApp principal es obligatorio.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return (
      formData.commercialName.trim() &&
      formData.industry.trim() &&
      formData.country.trim() &&
      formData.city.trim() &&
      formData.whatsapp.trim()
    );
  }, [formData]);

  const handleSubmit = async () => {
    const valid = validate();

    if (!valid) return;

    try {
      setIsSaving(true);
      setSubmitError("");

      const response = await fetch("/api/onboarding/business-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken,
          businessProfile: {
            legalName: formData.legalName || null,
            commercialName: formData.commercialName,
            industry: formData.industry,
            country: formData.country,
            city: formData.city,
            websiteOrInstagram: formData.websiteOrInstagram || null,
            whatsapp: formData.whatsapp,
            operatingHours: formData.operatingHours || null,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "No fue posible guardar la información");
      }

      window.location.href = "/onboarding/primary-goal";
    } catch (error) {
      console.error(error);
      setSubmitError(
        "No fue posible guardar el perfil del negocio. Intenta nuevamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "56px",
    borderRadius: "14px",
    border: "1px solid #D1D5DB",
    backgroundColor: "#FFFFFF",
    padding: "0 16px",
    fontSize: "16px",
    color: "#2B2F36",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "16px",
    fontWeight: 600,
    color: "#2B2F36",
    marginBottom: "10px",
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "10px",
    fontSize: "14px",
    color: "#DC2626",
    fontWeight: 500,
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
          Paso 2 · Perfil del negocio
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
          Cuéntanos sobre tu negocio
        </h2>

        <p
          style={{
            fontSize: "19px",
            lineHeight: 1.6,
            color: "#4A4F57",
            maxWidth: "860px",
            margin: 0,
          }}
        >
          Necesitamos entender el contexto base de tu operación para diseñar la
          mejor implementación Nexoru.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px 28px",
          marginBottom: "36px",
        }}
      >
        <div>
          <label style={labelStyle}>Nombre legal del negocio</label>
          <input
            type="text"
            value={formData.legalName}
            onChange={(e) => updateField("legalName", e.target.value)}
            placeholder="Ej. Comercializadora Nexoru S.A. de C.V."
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Nombre comercial *</label>
          <input
            type="text"
            value={formData.commercialName}
            onChange={(e) => updateField("commercialName", e.target.value)}
            placeholder="Ej. Nexoru"
            style={inputStyle}
          />
          {errors.commercialName ? (
            <p style={errorStyle}>{errors.commercialName}</p>
          ) : null}
        </div>

        <div>
          <label style={labelStyle}>Industria / giro *</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            placeholder="Ej. Retail, Educación, Servicios"
            style={inputStyle}
          />
          {errors.industry ? <p style={errorStyle}>{errors.industry}</p> : null}
        </div>

        <div>
          <label style={labelStyle}>País *</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => updateField("country", e.target.value)}
            placeholder="Ej. México"
            style={inputStyle}
          />
          {errors.country ? <p style={errorStyle}>{errors.country}</p> : null}
        </div>

        <div>
          <label style={labelStyle}>Ciudad *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Ej. Ciudad de México"
            style={inputStyle}
          />
          {errors.city ? <p style={errorStyle}>{errors.city}</p> : null}
        </div>

        <div>
          <label style={labelStyle}>Sitio web o Instagram</label>
          <input
            type="text"
            value={formData.websiteOrInstagram}
            onChange={(e) => updateField("websiteOrInstagram", e.target.value)}
            placeholder="Ej. https://... o @negocio"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>WhatsApp principal *</label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            placeholder="Ej. +52 55 1234 5678"
            style={inputStyle}
          />
          {errors.whatsapp ? <p style={errorStyle}>{errors.whatsapp}</p> : null}
        </div>

        <div>
          <label style={labelStyle}>Horario de operación</label>
          <input
            type="text"
            value={formData.operatingHours}
            onChange={(e) => updateField("operatingHours", e.target.value)}
            placeholder="Ej. Lun-Vie 9:00 a 18:00"
            style={inputStyle}
          />
        </div>
      </div>

      {submitError ? (
        <div
          style={{
            marginBottom: "18px",
            border: "1px solid #FECACA",
            backgroundColor: "#FEF2F2",
            color: "#B91C1C",
            borderRadius: "14px",
            padding: "14px 16px",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {submitError}
        </div>
      ) : null}

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
          href="/onboarding/start"
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
          onClick={handleSubmit}
          disabled={!isFormValid || isSaving}
          style={{
            border: "none",
            backgroundColor:
              !isFormValid || isSaving ? "#9CA3AF" : "#2B2F36",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor:
              !isFormValid || isSaving ? "not-allowed" : "pointer",
          }}
        >
          {isSaving ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}