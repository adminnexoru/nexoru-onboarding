"use client";

import { useEffect, useMemo, useState } from "react";

type VolumeOperationsFormData = {
  monthlyConversations: string;
  monthlyTickets: string;
  monthlyBookings: string;
  averageTicketValue: string;
  teamSizeOperating: string;
  peakDemandNotes: string;
};

type FormErrors = Partial<Record<keyof VolumeOperationsFormData, string>>;

type Props = {
  initialValues?: Partial<VolumeOperationsFormData>;
  isSubmitting?: boolean;
  submitError?: string;
  onBack?: () => void;
  onSubmit: (values: {
    monthlyConversations: number | null;
    monthlyTickets: number | null;
    monthlyBookings: number | null;
    averageTicketValue: number | null;
    teamSizeOperating: number;
    peakDemandNotes: string;
  }) => Promise<void>;
};

const defaultValues: VolumeOperationsFormData = {
  monthlyConversations: "",
  monthlyTickets: "",
  monthlyBookings: "",
  averageTicketValue: "",
  teamSizeOperating: "",
  peakDemandNotes: "",
};

export default function VolumeOperationsForm({
  initialValues,
  isSubmitting = false,
  submitError = "",
  onBack,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<VolumeOperationsFormData>({
    ...defaultValues,
    ...initialValues,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setFormData({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues]);

  const validate = (values: VolumeOperationsFormData): FormErrors => {
    const newErrors: FormErrors = {};

    const hasAtLeastOneVolume =
      values.monthlyConversations.trim() ||
      values.monthlyTickets.trim() ||
      values.monthlyBookings.trim();

    if (!hasAtLeastOneVolume) {
      newErrors.monthlyConversations =
        "Debes capturar al menos un volumen mensual relevante.";
    }

    if (!values.teamSizeOperating.trim()) {
      newErrors.teamSizeOperating =
        "El tamaño del equipo operativo es obligatorio.";
    }

    return newErrors;
  };

  const isFormValid = useMemo(() => {
    return Object.keys(validate(formData)).length === 0;
  }, [formData]);

  const updateField = (
    field: keyof VolumeOperationsFormData,
    value: string
  ) => {
    const nextValues = {
      ...formData,
      [field]: value,
    };

    setFormData(nextValues);

    if (hasSubmitted) {
      setErrors(validate(nextValues));
    }
  };

  const handleBlur = (field: keyof VolumeOperationsFormData) => {
    const nextErrors = validate(formData);

    setErrors((prev) => ({
      ...prev,
      [field]: nextErrors[field],
    }));
  };

  const inputClass = (field: keyof VolumeOperationsFormData) =>
    `nx-input ${errors[field] ? "nx-input-error" : ""}`;

  const textareaClass = (field: keyof VolumeOperationsFormData) =>
    `nx-textarea ${errors[field] ? "nx-input-error" : ""}`;

  const renderError = (field: keyof VolumeOperationsFormData) =>
    errors[field] ? (
      <p className="nx-field-error">{errors[field]}</p>
    ) : null;

  const parseOptionalInt = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const normalized = trimmed.replace(/,/g, "");
    const parsed = Number(normalized);

    if (!Number.isFinite(parsed)) return null;
    return Math.trunc(parsed);
  };

  const parseOptionalDecimal = (value: string): number | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const normalized = trimmed.replace(/,/g, "");
    const parsed = Number(normalized);

    if (!Number.isFinite(parsed)) return null;
    return parsed;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasSubmitted(true);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit({
      monthlyConversations: parseOptionalInt(formData.monthlyConversations),
      monthlyTickets: parseOptionalInt(formData.monthlyTickets),
      monthlyBookings: parseOptionalInt(formData.monthlyBookings),
      averageTicketValue: parseOptionalDecimal(formData.averageTicketValue),
      teamSizeOperating: parseOptionalInt(formData.teamSizeOperating) ?? 0,
      peakDemandNotes: formData.peakDemandNotes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="nx-page-card">
        <span className="nx-pill">Paso 5 · Volumen y operación</span>

        <div className="nx-section" style={{ marginTop: 24 }}>
          <h1 className="nx-title">Dimensionemos tu operación</h1>

          <p className="nx-subtitle">
            Necesitamos entender el volumen mensual y el tamaño de la operación
            para estimar la complejidad de la solución Nexoru.
          </p>
        </div>

        <div className="nx-section nx-form-grid">
          <div className="nx-field">
            <label className="nx-label">Conversaciones por mes *</label>
            <p className="nx-field-help">
              Estimado mensual de conversaciones por WhatsApp u otro canal
              similar. Captura al menos uno de los volúmenes de esta sección.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={formData.monthlyConversations}
              onChange={(e) =>
                updateField("monthlyConversations", e.target.value)
              }
              onBlur={() => handleBlur("monthlyConversations")}
              placeholder="Ej. 1000"
              className={inputClass("monthlyConversations")}
            />
            {renderError("monthlyConversations")}
          </div>

          <div className="nx-field">
            <label className="nx-label">Tickets registrados por mes</label>
            <p className="nx-field-help">
              Úsalo si tu caso está relacionado con loyalty o registro de
              compras.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={formData.monthlyTickets}
              onChange={(e) => updateField("monthlyTickets", e.target.value)}
              onBlur={() => handleBlur("monthlyTickets")}
              placeholder="Ej. 1000"
              className={inputClass("monthlyTickets")}
            />
          </div>

          <div className="nx-field">
            <label className="nx-label">Reservas / cursos por mes</label>
            <p className="nx-field-help">
              Úsalo si tu operación está relacionada con booking o agenda.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={formData.monthlyBookings}
              onChange={(e) => updateField("monthlyBookings", e.target.value)}
              onBlur={() => handleBlur("monthlyBookings")}
              placeholder="Ej. 200"
              className={inputClass("monthlyBookings")}
            />
          </div>

          <div className="nx-field">
            <label className="nx-label">Ticket promedio</label>
            <p className="nx-field-help">
              Monto promedio por venta, reserva o transacción principal.
            </p>
            <input
              type="text"
              inputMode="decimal"
              value={formData.averageTicketValue}
              onChange={(e) =>
                updateField("averageTicketValue", e.target.value)
              }
              onBlur={() => handleBlur("averageTicketValue")}
              placeholder="Ej. 350"
              className={inputClass("averageTicketValue")}
            />
          </div>

          <div className="nx-field">
            <label className="nx-label">Personas operando hoy *</label>
            <p className="nx-field-help">
              Número de personas que actualmente atienden, validan o ejecutan el
              proceso principal.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={formData.teamSizeOperating}
              onChange={(e) => updateField("teamSizeOperating", e.target.value)}
              onBlur={() => handleBlur("teamSizeOperating")}
              placeholder="Ej. 1"
              className={inputClass("teamSizeOperating")}
            />
            {renderError("teamSizeOperating")}
          </div>

          <div className="nx-field">
            <label className="nx-label">Picos de demanda / notas</label>
            <p className="nx-field-help">
              Describe si tienes días, temporadas o momentos donde aumenta el
              volumen.
            </p>
            <textarea
              value={formData.peakDemandNotes}
              onChange={(e) => updateField("peakDemandNotes", e.target.value)}
              onBlur={() => handleBlur("peakDemandNotes")}
              placeholder="Ej. Fines de semana, quincena, campañas especiales, temporada alta..."
              className={textareaClass("peakDemandNotes")}
            />
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
            onClick={() => {
              if (onBack) {
                onBack();
                return;
              }

              window.history.back();
            }}
            className="nx-btn nx-btn-secondary"
            style={{ minWidth: 130 }}
          >
            Atrás
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`nx-btn ${
              isSubmitting ? "nx-btn-muted" : "nx-btn-primary"
            }`}
            style={{ minWidth: 180 }}
          >
            {isSubmitting ? (
              <span className="nx-inline-loading">
                <span className="nx-spinner" />
                Guardando...
              </span>
            ) : (
              "Siguiente"
            )}
          </button>
        </div>

        {!isFormValid && hasSubmitted ? (
          <div className="nx-section" style={{ marginTop: 16 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--nx-warning-text)",
              }}
            >
              Completa los campos obligatorios para continuar.
            </p>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .nx-textarea {
          width: 100%;
          min-height: 132px;
          resize: vertical;
          border-radius: 18px;
          border: 1px solid var(--nx-border);
          background: rgba(10, 14, 35, 0.72);
          padding: 16px 18px;
          font-size: 15px;
          line-height: 1.75;
          color: var(--nx-text-primary);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .nx-textarea::placeholder {
          color: var(--nx-text-muted);
        }

        .nx-textarea:focus {
          border-color: rgba(124, 58, 237, 0.55);
          box-shadow:
            0 0 0 3px rgba(124, 58, 237, 0.14),
            0 0 24px rgba(37, 99, 235, 0.08);
          background: rgba(10, 14, 35, 0.82);
        }

        .nx-field-help {
          margin: 0 0 12px;
          font-size: 14px;
          line-height: 1.7;
          color: var(--nx-text-secondary);
        }

        @media (max-width: 768px) {
          .nx-textarea {
            min-height: 120px;
            padding: 15px 16px;
            font-size: 14px;
            line-height: 1.7;
          }

          .nx-field-help {
            font-size: 13px;
            line-height: 1.65;
          }
        }
      `}</style>
    </form>
  );
}