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
    `w-full rounded-2xl border bg-white px-5 py-4 text-[16px] text-[#202430] shadow-sm transition outline-none placeholder:text-[#9CA3AF] ${
      errors[field]
        ? "border-[#DC2626] focus:border-[#DC2626]"
        : "border-[#E5E7EB] focus:border-[#4F46E5]"
    }`;

  const textareaClass = (field: keyof VolumeOperationsFormData) =>
    `w-full min-h-[140px] rounded-2xl border bg-white px-5 py-4 text-[16px] leading-7 text-[#202430] shadow-sm transition outline-none placeholder:text-[#9CA3AF] resize-y ${
      errors[field]
        ? "border-[#DC2626] focus:border-[#DC2626]"
        : "border-[#E5E7EB] focus:border-[#4F46E5]"
    }`;

  const renderError = (field: keyof VolumeOperationsFormData) =>
    errors[field] ? (
      <p className="mt-2 text-sm font-medium text-[#DC2626]">
        {errors[field]}
      </p>
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
      <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
        <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-5 py-3 text-sm font-medium text-[#4F46E5]">
          Paso 5 · Volumen y operación
        </span>

        <h1 className="mb-4 text-[64px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#202430]">
          Dimensionemos tu operación
        </h1>

        <p className="mb-12 max-w-4xl text-[20px] leading-9 text-[#4B5563]">
          Necesitamos entender el volumen mensual y el tamaño de la operación
          para estimar la complejidad de la solución Nexoru.
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Conversaciones por mes *
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Tickets registrados por mes
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Reservas / cursos por mes
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Ticket promedio
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Personas operando hoy *
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Picos de demanda / notas
            </label>
            <p className="mb-3 text-[15px] leading-7 text-[#6B7280]">
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
          <div className="mt-8 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
            {submitError}
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (onBack) {
                onBack();
                return;
              }

              window.history.back();
            }}
            className="inline-flex h-14 min-w-[108px] items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[16px] font-semibold text-[#202430] transition hover:bg-[#F9FAFB]"
          >
            Atrás
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex h-14 min-w-[180px] items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition ${
              isSubmitting
                ? "cursor-not-allowed bg-[#A7AFBE]"
                : "bg-[#202430] hover:bg-[#111827]"
            }`}
          >
            {isSubmitting ? "Guardando..." : "Siguiente"}
          </button>
        </div>

        {!isFormValid && hasSubmitted ? (
          <p className="mt-4 text-right text-sm font-medium text-[#B45309]">
            Completa los campos obligatorios para continuar.
          </p>
        ) : null}
      </div>
    </form>
  );
}