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

  useEffect(() => {
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
    `nx-input ${fieldErrors[field] ? "nx-input-error" : ""}`;

  const renderError = (field: keyof BusinessProfileFormValues) =>
    fieldErrors[field] ? (
      <p className="nx-field-error">{fieldErrors[field]}</p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="nx-page-card">
        <span className="nx-pill">Paso 2 · Perfil del negocio</span>

        <div className="nx-section" style={{ marginTop: 24 }}>
          <h1 className="nx-title">Cuéntanos sobre tu negocio</h1>

          <p className="nx-subtitle">
            Necesitamos entender el contexto base de tu operación para diseñar
            la mejor implementación Nexoru.
          </p>
        </div>

        <div className="nx-section nx-form-grid">
          <div className="nx-field">
            <label className="nx-label">Nombre legal del negocio</label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => updateField("legalName", e.target.value)}
              onBlur={() => handleBlur("legalName")}
              placeholder="Ej. Comercializadora Nexoru S.A. de C.V."
              className={inputClass("legalName")}
            />
          </div>

          <div className="nx-field">
            <label className="nx-label">Nombre comercial *</label>
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

          <div className="nx-field">
            <label className="nx-label">Industria / giro *</label>
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

          <div className="nx-field">
            <label className="nx-label">País *</label>
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

          <div className="nx-field">
            <label className="nx-label">Ciudad *</label>
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

          <div className="nx-field">
            <label className="nx-label">Sitio web o Instagram</label>
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

          <div className="nx-field">
            <label className="nx-label">WhatsApp principal *</label>
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

          <div className="nx-field">
            <label className="nx-label">Horario de operación</label>
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
    </form>
  );
}