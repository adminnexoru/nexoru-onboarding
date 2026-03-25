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
    `w-full min-h-[120px] rounded-2xl border bg-white px-5 py-4 text-[16px] leading-7 text-[#202430] shadow-sm transition outline-none placeholder:text-[#9CA3AF] resize-none sm:min-h-[140px] ${
      fieldErrors[field]
        ? "border-[#DC2626] focus:border-[#DC2626]"
        : "border-[#E5E7EB] focus:border-[#4F46E5]"
    }`;

  const renderError = (field: keyof CurrentProcessValues) =>
    fieldErrors[field] ? (
      <p className="mt-2 text-sm font-medium text-[#DC2626]">
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">

  <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#4F46E5] sm:px-5 sm:py-3 sm:text-sm">
          Paso 4 · Proceso actual
        </span>

        <h1 className="mb-8 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#202430] sm:mb-9 sm:text-[38px] md:mb-8 md:text-[60px] md:leading-[1.04]">
          Cuéntanos cómo operas hoy
        </h1>

        <p className="mb-10 max-w-4xl text-[16px] leading-7 text-[#4B5563] sm:mb-12 sm:text-[17px] sm:leading-8 md:mb-12 md:text-[20px] md:leading-9">
          Queremos entender tu proceso actual para identificar pasos manuales,
          herramientas utilizadas y puntos de fricción antes de diseñar la
          solución Nexoru.
        </p>

        <div className="grid grid-cols-1 gap-y-7 sm:gap-y-8">
          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Describe brevemente cómo funciona hoy tu proceso *
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              ¿Qué pasos haces manualmente hoy?
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              ¿Qué herramientas usas actualmente?
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              ¿Dónde están hoy los principales problemas o fricciones?
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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
          <div className="mt-8 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
            {submitError}
          </div>
        ) : null}

        <div className="mt-12 flex flex-col gap-4 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              if (onBack) {
                onBack();
                return;
              }

              window.history.back();
            }}
            className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[16px] font-semibold text-[#202430] transition hover:bg-[#F9FAFB] sm:w-auto sm:min-w-[120px]"
          >
            Atrás
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex h-14 w-full items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition sm:w-auto sm:min-w-[180px] ${
              isSubmitting
                ? "cursor-not-allowed bg-[#A7AFBE]"
                : "bg-[#202430] hover:bg-[#111827]"
            }`}
          >
            {isSubmitting ? "Guardando..." : "Siguiente"}
          </button>
        </div>

        {!isFormValid && hasSubmitted ? (
          <p className="mt-4 text-sm font-medium text-[#B45309] sm:text-right">
            Completa el campo obligatorio para continuar.
          </p>
        ) : null}
      </div>
    </form>
  );
}