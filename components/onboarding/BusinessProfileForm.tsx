"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
  onSummaryChange?: (data: {
    businessName?: string;
    industry?: string;
  }) => void;
};

type FormErrors = Partial<Record<keyof BusinessProfileFormData, string>>;

const initialFormData: BusinessProfileFormData = {
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
  onSummaryChange,
}: BusinessProfileFormProps) {
  const [formData, setFormData] = useState<BusinessProfileFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

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
      newErrors.industry = "La industria o giro es obligatorio.";
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

  const handleSubmit = () => {
    const valid = validate();

    if (!valid) return;

    // En HU 2.1 todavía no persistimos backend.
    // Dejamos la navegación lista para la siguiente pantalla.
    window.location.href = "/onboarding/primary-goal";
  };

  const inputClassName =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#2B2F36] outline-none transition focus:border-[#3A3D91] focus:ring-2 focus:ring-[#E8EBF8]";

  const labelClassName = "text-sm font-medium text-[#2B2F36]";
  const errorClassName = "mt-2 text-sm text-red-600";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <span className="mb-4 inline-block rounded-full bg-[#E8EBF8] px-3 py-1 text-sm font-medium text-[#3A3D91]">
          Paso 2 · Perfil del negocio
        </span>

        <h2 className="mb-3 text-3xl font-semibold text-[#2B2F36]">
          Cuéntanos sobre tu negocio
        </h2>

        <p className="max-w-2xl text-base leading-7 text-[#4A4F57]">
          Necesitamos entender el contexto base de tu operación para diseñar la
          mejor implementación Nexoru.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className={labelClassName}>Nombre legal del negocio</label>
          <input
            type="text"
            value={formData.legalName}
            onChange={(e) => updateField("legalName", e.target.value)}
            className={inputClassName}
            placeholder="Ej. Comercializadora Nexoru S.A. de C.V."
          />
        </div>

        <div>
          <label className={labelClassName}>Nombre comercial *</label>
          <input
            type="text"
            value={formData.commercialName}
            onChange={(e) => updateField("commercialName", e.target.value)}
            className={inputClassName}
            placeholder="Ej. Nexoru"
          />
          {errors.commercialName && (
            <p className={errorClassName}>{errors.commercialName}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>Industria / giro *</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className={inputClassName}
            placeholder="Ej. Retail, Educación, Servicios"
          />
          {errors.industry && (
            <p className={errorClassName}>{errors.industry}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>País *</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => updateField("country", e.target.value)}
            className={inputClassName}
            placeholder="Ej. México"
          />
          {errors.country && <p className={errorClassName}>{errors.country}</p>}
        </div>

        <div>
          <label className={labelClassName}>Ciudad *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={inputClassName}
            placeholder="Ej. Ciudad de México"
          />
          {errors.city && <p className={errorClassName}>{errors.city}</p>}
        </div>

        <div>
          <label className={labelClassName}>Sitio web o Instagram</label>
          <input
            type="text"
            value={formData.websiteOrInstagram}
            onChange={(e) => updateField("websiteOrInstagram", e.target.value)}
            className={inputClassName}
            placeholder="Ej. https://... o @negocio"
          />
        </div>

        <div>
          <label className={labelClassName}>WhatsApp principal *</label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => updateField("whatsapp", e.target.value)}
            className={inputClassName}
            placeholder="Ej. +52 55 1234 5678"
          />
          {errors.whatsapp && (
            <p className={errorClassName}>{errors.whatsapp}</p>
          )}
        </div>

        <div>
          <label className={labelClassName}>Horario de operación</label>
          <input
            type="text"
            value={formData.operatingHours}
            onChange={(e) => updateField("operatingHours", e.target.value)}
            className={inputClassName}
            placeholder="Ej. Lun-Vie 9:00 a 18:00"
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/onboarding/start"
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-[#2B2F36] transition hover:bg-gray-50"
        >
          Atrás
        </Link>

        <button
          type="button"
          onClick={handleSubmit}
          className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium text-white transition ${
            isFormValid
              ? "bg-[#2B2F36] hover:bg-[#1f2329]"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}