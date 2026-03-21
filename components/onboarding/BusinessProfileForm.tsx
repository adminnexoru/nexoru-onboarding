"use client";

import { useEffect, useMemo, useState } from "react";

type BusinessProfileFormValues = {
  legalName: string;
  commercialName: string;
  industry: string;
  country: string;
  city: string;
  websiteOrInstagram: string;
  whatsapp: string;
  operatingHours: string;
};

type FieldErrors = Partial<Record<keyof BusinessProfileFormValues, string>>;

type Props = {
  initialValues?: Partial<BusinessProfileFormValues>;
  isSubmitting?: boolean;
  submitError?: string;
  onBack?: () => void;
  onSubmit: (values: BusinessProfileFormValues) => Promise<void>;
};

const defaultValues: BusinessProfileFormValues = {
  legalName: "",
  commercialName: "",
  industry: "",
  country: "",
  city: "",
  websiteOrInstagram: "",
  whatsapp: "",
  operatingHours: "",
};

export default function BusinessProfileForm({
  initialValues,
  isSubmitting = false,
  submitError = "",
  onBack,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<BusinessProfileFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect (() =>{
    setFormData({
      ...defaultValues,
      ...initialValues,
    });
  }, [initialValues]);

  const validate = (values: BusinessProfileFormValues): FieldErrors => {
    const errors: FieldErrors = {};

    if (!values.commercialName.trim()) {
      errors.commercialName = "El nombre comercial es obligatorio.";
    }

    if (!values.industry.trim()) {
      errors.industry = "La industria es obligatoria.";
    }

    if (!values.country.trim()) {
      errors.country = "El país es obligatorio.";
    }

    if (!values.city.trim()) {
      errors.city = "La ciudad es obligatoria.";
    }

    if (!values.whatsapp.trim()) {
      errors.whatsapp = "El WhatsApp principal es obligatorio.";
    }

    return errors;
  };

  const isFormValid = useMemo(() => {
    return Object.keys(validate(formData)).length === 0;
  }, [formData]);

  const updateField = (
    field: keyof BusinessProfileFormValues,
    value: string
  ) => {
    const nextValues = {
      ...formData,
      [field]: value,
    };

    setFormData(nextValues);

    if (hasSubmitted) {
      setFieldErrors(validate(nextValues));
    }
  };

  const handleBlur = (field: keyof BusinessProfileFormValues) => {
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
      legalName: formData.legalName.trim(),
      commercialName: formData.commercialName.trim(),
      industry: formData.industry.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      websiteOrInstagram: formData.websiteOrInstagram.trim(),
      whatsapp: formData.whatsapp.trim(),
      operatingHours: formData.operatingHours.trim(),
    });
  };

  const inputClass = (field: keyof BusinessProfileFormValues) =>
    `w-full rounded-2xl border bg-white px-5 py-4 text-[16px] text-[#202430] shadow-sm transition outline-none placeholder:text-[#9CA3AF] ${
      fieldErrors[field]
        ? "border-[#DC2626] focus:border-[#DC2626]"
        : "border-[#E5E7EB] focus:border-[#4F46E5]"
    }`;

  const renderError = (field: keyof BusinessProfileFormValues) =>
    fieldErrors[field] ? (
      <p className="mt-2 text-sm font-medium text-[#DC2626]">
        {fieldErrors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
        <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-5 py-3 text-sm font-medium text-[#4F46E5]">
          Paso 2 · Perfil del negocio
        </span>

        <h1 className="mb-4 text-[64px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#202430]">
          Cuéntanos sobre tu negocio
        </h1>

        <p className="mb-12 max-w-4xl text-[20px] leading-9 text-[#4B5563]">
          Necesitamos entender el contexto base de tu operación para diseñar la
          mejor implementación Nexoru.
        </p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Nombre legal del negocio
            </label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => updateField("legalName", e.target.value)}
              onBlur={() => handleBlur("legalName")}
              placeholder="Ej. Comercializadora Nexoru S.A. de C.V."
              className={inputClass("legalName")}
            />
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Nombre comercial *
            </label>
            <input
              type="text"
              value={formData.commercialName}
              onChange={(e) => updateField("commercialName", e.target.value)}
              onBlur={() => handleBlur("commercialName")}
              placeholder="Ej. Nexoru"
              className={inputClass("commercialName")}
            />
            {renderError("commercialName")}
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Industria / giro *
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => updateField("industry", e.target.value)}
              onBlur={() => handleBlur("industry")}
              placeholder="Ej. Retail, Educación, Servicios"
              className={inputClass("industry")}
            />
            {renderError("industry")}
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              País *
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => updateField("country", e.target.value)}
              onBlur={() => handleBlur("country")}
              placeholder="Ej. México"
              className={inputClass("country")}
            />
            {renderError("country")}
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Ciudad *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              onBlur={() => handleBlur("city")}
              placeholder="Ej. Ciudad de México"
              className={inputClass("city")}
            />
            {renderError("city")}
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Sitio web o Instagram
            </label>
            <input
              type="text"
              value={formData.websiteOrInstagram}
              onChange={(e) =>
                updateField("websiteOrInstagram", e.target.value)
              }
              onBlur={() => handleBlur("websiteOrInstagram")}
              placeholder="Ej. https://... o @negocio"
              className={inputClass("websiteOrInstagram")}
            />
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              WhatsApp principal *
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
              onBlur={() => handleBlur("whatsapp")}
              placeholder="Ej. +52 55 1234 5678"
              className={inputClass("whatsapp")}
            />
            {renderError("whatsapp")}
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
              Horario de operación
            </label>
            <input
              type="text"
              value={formData.operatingHours}
              onChange={(e) => updateField("operatingHours", e.target.value)}
              onBlur={() => handleBlur("operatingHours")}
              placeholder="Ej. Lun-Vie 9:00 a 18:00"
              className={inputClass("operatingHours")}
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
                ? "bg-[#A7AFBE] cursor-not-allowed"
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