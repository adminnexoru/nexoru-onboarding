"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type VolumeOperationsFormData = {
  monthlyConversations: string;
  monthlyTickets: string;
  monthlyBookings: string;
  averageTicketValue: string;
  teamSizeOperating: string;
  peakDemandNotes: string;
};

type VolumeOperationsFormProps = {
  onSaveSummary?: (data: {
    volumeLabel?: string;
  }) => void;
};

type FormErrors = Partial<Record<keyof VolumeOperationsFormData, string>>;

const initialFormData: VolumeOperationsFormData = {
  monthlyConversations: "",
  monthlyTickets: "",
  monthlyBookings: "",
  averageTicketValue: "",
  teamSizeOperating: "",
  peakDemandNotes: "",
};

export default function VolumeOperationsForm({
  onSaveSummary,
}: VolumeOperationsFormProps) {
  const [formData, setFormData] =
    useState<VolumeOperationsFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (
    field: keyof VolumeOperationsFormData,
    value: string
  ) => {
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
      volumeLabel:
        nextData.monthlyConversations ||
        nextData.monthlyTickets ||
        nextData.monthlyBookings ||
        "",
    });
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (
      !formData.monthlyConversations.trim() &&
      !formData.monthlyTickets.trim() &&
      !formData.monthlyBookings.trim()
    ) {
      newErrors.monthlyConversations =
        "Debes capturar al menos un volumen mensual relevante.";
    }

    if (!formData.teamSizeOperating.trim()) {
      newErrors.teamSizeOperating =
        "El tamaño del equipo operativo es obligatorio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    const hasVolume =
      formData.monthlyConversations.trim() ||
      formData.monthlyTickets.trim() ||
      formData.monthlyBookings.trim();

    return hasVolume && formData.teamSizeOperating.trim();
  }, [formData]);

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
    fontSize: "16px",
    fontWeight: 600,
    color: "#2B2F36",
    marginBottom: "10px",
  };

  const helpTextStyle: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#6B7280",
    margin: "0 0 10px",
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "10px",
    fontSize: "14px",
    color: "#DC2626",
    fontWeight: 500,
  };

const handleSubmit = () => {
  const valid = validate();

  if (!valid) return;

  sessionStorage.setItem(
    "nexoru_volume_operations",
    JSON.stringify({
      monthlyConversations: formData.monthlyConversations,
      monthlyTickets: formData.monthlyTickets,
      monthlyBookings: formData.monthlyBookings,
      averageTicketValue: formData.averageTicketValue,
      teamSizeOperating: formData.teamSizeOperating,
      peakDemandNotes: formData.peakDemandNotes,
    })
  );

  window.location.href = "/onboarding/package-recommendation";
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
          Paso 5 · Volumen y operación
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
          Dimensionemos tu operación
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
          Necesitamos entender el volumen mensual y el tamaño de la operación
          para estimar la complejidad de la solución Nexoru.
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
          <label style={labelStyle}>Conversaciones por mes *</label>
          <p style={helpTextStyle}>
            Estimado mensual de conversaciones por WhatsApp u otro canal similar. Captura al menos uno de los volúmenes de esta sección.
          </p>
          <input
            type="text"
            value={formData.monthlyConversations}
            onChange={(e) =>
              updateField("monthlyConversations", e.target.value)
            }
            placeholder="Ej. 1000"
            style={inputStyle}
          />
          {errors.monthlyConversations && (
            <p style={errorStyle}>{errors.monthlyConversations}</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Tickets registrados por mes</label>
          <p style={helpTextStyle}>
            Úsalo si tu caso está relacionado con loyalty o registro de compras.
          </p>
          <input
            type="text"
            value={formData.monthlyTickets}
            onChange={(e) => updateField("monthlyTickets", e.target.value)}
            placeholder="Ej. 1000"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Reservas / cursos por mes</label>
          <p style={helpTextStyle}>
            Úsalo si tu operación está relacionada con booking o agenda.
          </p>
          <input
            type="text"
            value={formData.monthlyBookings}
            onChange={(e) => updateField("monthlyBookings", e.target.value)}
            placeholder="Ej. 200"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Ticket promedio</label>
          <p style={helpTextStyle}>
            Monto promedio por venta, reserva o transacción principal.
          </p>
          <input
            type="text"
            value={formData.averageTicketValue}
            onChange={(e) => updateField("averageTicketValue", e.target.value)}
            placeholder="Ej. 350"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Personas operando hoy *</label>
          <p style={helpTextStyle}>
            Número de personas que actualmente atienden, validan o ejecutan el
            proceso principal.
          </p>
          <input
            type="text"
            value={formData.teamSizeOperating}
            onChange={(e) => updateField("teamSizeOperating", e.target.value)}
            placeholder="Ej. 1"
            style={inputStyle}
          />
          {errors.teamSizeOperating && (
            <p style={errorStyle}>{errors.teamSizeOperating}</p>
          )}
        </div>

        <div>
          <label style={labelStyle}>Picos de demanda / notas</label>
          <p style={helpTextStyle}>
            Describe si tienes días, temporadas o momentos donde aumenta el
            volumen.
          </p>
          <textarea
            value={formData.peakDemandNotes}
            onChange={(e) => updateField("peakDemandNotes", e.target.value)}
            placeholder="Ej. Fines de semana, quincena, campañas especiales, temporada alta..."
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
          href="/onboarding/current-process"
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