"use client";

import { useEffect, useMemo, useState } from "react";

type CurrentProcessValues = {
  currentProcess: string;
  manualSteps: string;
  toolsUsed: string;
  painPoints: string;
};

type FieldErrors = Partial<Record<keyof CurrentProcessValues, string>>;

type Props = {
  initialValues?: Partial<CurrentProcessValues>;
  isSubmitting?: boolean;
  submitError?: string;
  onBack?: () => void;
  onSubmit: (values: CurrentProcessValues) => Promise<void>;
};

const defaultValues: CurrentProcessValues = {
  currentProcess: "",
  manualSteps: "",
  toolsUsed: "",
  painPoints: "",
};

export default function CurrentProcessForm({
  initialValues,
  isSubmitting = false,
  submitError = "",
  onBack,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<CurrentProcessValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    setFormData({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues]);

  const validate = (values: CurrentProcessValues): FieldErrors => {
    const errors: FieldErrors = {};

    if (!values.currentProcess.trim()) {
      errors.currentProcess =
        "La descripción del proceso actual es obligatoria.";
    }

    return errors;
  };

  const isFormValid = useMemo(() => {
    return Object.keys(validate(formData)).length === 0;
  }, [formData]);

  const updateField = (field: keyof CurrentProcessValues, value: string) => {
    const nextValues = {
      ...formData,
      [field]: value,
    };

    setFormData(nextValues);

    if (hasSubmitted) {
      setFieldErrors(validate(nextValues));
    }
  };

  const handleBlur = (field: keyof CurrentProcessValues) => {
    const nextErrors = validate(formData);
    setFieldErrors((prev) => ({
      ...prev,
      [field]: nextErrors[field],
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasSubmitted(true);

    const errors = validate(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await onSubmit({
      currentProcess: formData.currentProcess.trim(),
      manualSteps: formData.manualSteps.trim(),
      toolsUsed: formData.toolsUsed.trim(),
      painPoints: formData.painPoints.trim(),
    });
  };

  const textareaClass = (field: keyof CurrentProcessValues) =>
    `nx-textarea ${fieldErrors[field] ? "nx-input-error" : ""}`;

  const renderError = (field: keyof CurrentProcessValues) =>
    fieldErrors[field] ? (
      <p className="nx-field-error">{fieldErrors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="nx-page-card">
        <span className="nx-pill">Paso 4 · Proceso actual</span>

        <div className="nx-section" style={{ marginTop: 24 }}>
          <h1 className="nx-title">Cuéntanos cómo operas hoy</h1>

          <p className="nx-subtitle">
            Queremos entender tu proceso actual para identificar pasos
            manuales, herramientas utilizadas y puntos de fricción antes de
            diseñar la solución Nexoru.
          </p>
        </div>

        <div className="nx-section" style={{ display: "grid", gap: 28 }}>
          <div className="nx-field">
            <label className="nx-label">
              Describe brevemente cómo funciona hoy tu proceso *
            </label>
            <p className="nx-field-help">
              Explica qué ocurre actualmente desde que inicia la interacción
              hasta que termina el proceso principal.
            </p>
            <textarea
              value={formData.currentProcess}
              onChange={(e) => updateField("currentProcess", e.target.value)}
              onBlur={() => handleBlur("currentProcess")}
              placeholder="Ej. Hoy recibimos mensajes por WhatsApp, una persona responde manualmente, valida información, registra datos en una hoja y después coordina el siguiente paso..."
              className={textareaClass("currentProcess")}
            />
            {renderError("currentProcess")}
          </div>

          <div className="nx-field">
            <label className="nx-label">
              ¿Qué pasos haces manualmente hoy?
            </label>
            <p className="nx-field-help">
              Describe tareas que hoy dependen de una persona o se hacen sin
              automatización.
            </p>
            <textarea
              value={formData.manualSteps}
              onChange={(e) => updateField("manualSteps", e.target.value)}
              onBlur={() => handleBlur("manualSteps")}
              placeholder="Ej. Validar datos, registrar información, confirmar pagos, asignar puntos, reagendar..."
              className={textareaClass("manualSteps")}
            />
          </div>

          <div className="nx-field">
            <label className="nx-label">
              ¿Qué herramientas usas actualmente?
            </label>
            <p className="nx-field-help">
              Menciona apps, hojas de cálculo, WhatsApp, CRM u otras
              herramientas que hoy forman parte del proceso.
            </p>
            <textarea
              value={formData.toolsUsed}
              onChange={(e) => updateField("toolsUsed", e.target.value)}
              onBlur={() => handleBlur("toolsUsed")}
              placeholder="Ej. WhatsApp, Google Sheets, Excel, Mercado Pago, calendario, CRM..."
              className={textareaClass("toolsUsed")}
            />
          </div>

          <div className="nx-field">
            <label className="nx-label">
              ¿Dónde están hoy los principales problemas o fricciones?
            </label>
            <p className="nx-field-help">
              Explica retrasos, errores, retrabajos o cuellos de botella del
              proceso actual.
            </p>
            <textarea
              value={formData.painPoints}
              onChange={(e) => updateField("painPoints", e.target.value)}
              onBlur={() => handleBlur("painPoints")}
              placeholder="Ej. Respuesta lenta, errores de captura, seguimiento inconsistente, poca visibilidad, pérdida de clientes..."
              className={textareaClass("painPoints")}
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
              Completa el campo obligatorio para continuar.
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