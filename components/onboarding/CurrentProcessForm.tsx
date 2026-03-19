"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type CurrentProcessFormData = {
  processDescription: string;
  manualSteps: string;
  currentTools: string;
  painPoints: string;
};

type CurrentProcessFormProps = {
  onSaveSummary?: (data: {
    processDescription?: string;
  }) => void;
};

type FormErrors = Partial<Record<keyof CurrentProcessFormData, string>>;

const initialFormData: CurrentProcessFormData = {
  processDescription: "",
  manualSteps: "",
  currentTools: "",
  painPoints: "",
};

export default function CurrentProcessForm({
  onSaveSummary,
}: CurrentProcessFormProps) {
  const [formData, setFormData] = useState<CurrentProcessFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof CurrentProcessFormData, value: string) => {
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

    onSaveSummary?.({
      processDescription: nextData.processDescription,
    });
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.processDescription.trim()) {
      newErrors.processDescription =
        "La descripción del proceso actual es obligatoria.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    return formData.processDescription.trim();
  }, [formData]);

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "130px",
    borderRadius: "14px",
    border: "1px solid #D1D5DB",
    backgroundColor: "#FFFFFF",
    padding: "16px",
    fontSize: "16px",
    lineHeight: 1.6,
    color: "#2B2F36",
    outline: "none",
    resize: "vertical",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "17px",
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

  const helpTextStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#6B7280",
    margin: "0 0 10px",
  };

  const handleSubmit = () => {
  const valid = validate();

  if (!valid) return;

  sessionStorage.setItem(
    "nexoru_current_process",
    JSON.stringify({
      processDescription: formData.processDescription,
      manualSteps: formData.manualSteps,
      currentTools: formData.currentTools,
      painPoints: formData.painPoints,
    })
  );

  window.location.href = "/onboarding/volume-operations";
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
          Paso 4 · Proceso actual
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
          Cuéntanos cómo operas hoy
        </h2>

        <p
          style={{
            fontSize: "19px",
            lineHeight: 1.6,
            color: "#4A4F57",
            maxWidth: "880px",
            margin: 0,
          }}
        >
          Queremos entender tu proceso actual para identificar pasos manuales,
          herramientas utilizadas y puntos de fricción antes de diseñar la
          solución Nexoru.
        </p>
      </div>

      <div style={{ display: "grid", gap: "28px", marginBottom: "36px" }}>
        <div>
          <label style={labelStyle}>
            Describe brevemente cómo funciona hoy tu proceso *
          </label>
          <p style={helpTextStyle}>
            Explica qué ocurre actualmente desde que inicia la interacción hasta
            que termina el proceso principal.
          </p>
          <textarea
            value={formData.processDescription}
            onChange={(e) => updateField("processDescription", e.target.value)}
            placeholder="Ej. Hoy recibimos mensajes por WhatsApp, una persona responde manualmente, valida información, registra datos en una hoja y después coordina el siguiente paso..."
            style={textareaStyle}
          />
          {errors.processDescription && (
            <p style={errorStyle}>{errors.processDescription}</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>
            ¿Qué pasos haces manualmente hoy?
          </label>
          <p style={helpTextStyle}>
            Describe tareas que hoy dependen de una persona o se hacen sin
            automatización.
          </p>
          <textarea
            value={formData.manualSteps}
            onChange={(e) => updateField("manualSteps", e.target.value)}
            placeholder="Ej. Validar datos, registrar información, confirmar pagos, asignar puntos, reagendar..."
            style={textareaStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            ¿Qué herramientas usas actualmente?
          </label>
          <p style={helpTextStyle}>
            Menciona si usas WhatsApp, Google Sheets, Airtable, CRM, Excel,
            correo o cualquier otra herramienta.
          </p>
          <textarea
            value={formData.currentTools}
            onChange={(e) => updateField("currentTools", e.target.value)}
            placeholder="Ej. WhatsApp, Google Sheets, Excel, correo, ManyChat..."
            style={textareaStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            ¿Dónde se generan más errores, retrasos o pérdida de tiempo?
          </label>
          <p style={helpTextStyle}>
            Identifica fricciones operativas: validaciones, seguimiento, captura
            de datos, redención, pagos, confirmaciones, etc.
          </p>
          <textarea
            value={formData.painPoints}
            onChange={(e) => updateField("painPoints", e.target.value)}
            placeholder="Ej. Se pierden mensajes, no sabemos qué usuario ya fue atendido, se duplican tickets, la redención es manual..."
            style={textareaStyle}
          />
        </div>
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
          href="/onboarding/primary-goal"
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
          style={{
            border: "none",
            backgroundColor: isFormValid ? "#2B2F36" : "#9CA3AF",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: isFormValid ? "pointer" : "not-allowed",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}