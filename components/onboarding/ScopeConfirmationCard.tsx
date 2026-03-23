"use client";

import { useMemo, useState } from "react";

type OptionalAddon = {
  id: string;
  code: string;
  name: string;
  description: string;
  priceType: string;
  priceAmount: string | null;
};

type Props = {
  sessionToken: string;
  packageName: string;
  includedItems: string[];
  excludedItems: string[];
  optionalAddons: OptionalAddon[];
  initialAcceptedScope?: boolean;
  initialSelectedAddonIds?: string[];
  onBack?: () => void;
  onSuccess?: () => void;
};

export default function ScopeConfirmationCard({
  sessionToken,
  packageName,
  includedItems,
  excludedItems,
  optionalAddons,
  initialAcceptedScope = false,
  initialSelectedAddonIds = [],
  onBack,
  onSuccess,
}: Props) {
  const [acceptedScope, setAcceptedScope] = useState(initialAcceptedScope);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    initialSelectedAddonIds
  );
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = useMemo(() => !isSubmitting, [isSubmitting]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((item) => item !== addonId)
        : [...prev, addonId]
    );
  };

  const formatAddonPrice = (
    priceType: string,
    priceAmount: string | null
  ) => {
    if (priceType === "CUSTOM") {
      return "Precio personalizado";
    }

    if (!priceAmount) {
      return priceType === "MONTHLY" ? "Mensual" : "Único";
    }

    const formatted = `$${priceAmount} MXN`;

    if (priceType === "MONTHLY") {
      return `${formatted} / mes`;
    }

    if (priceType === "ONE_TIME") {
      return `${formatted} único`;
    }

    return formatted;
  };

const handleContinue = async () => {
  if (!acceptedScope) {
    setError("Debes confirmar que entiendes el alcance para continuar.");
    return;
  }

  try {
    setIsSubmitting(true);
    setSubmitError("");
    setError("");

    const response = await fetch("/api/onboarding/scope-confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionToken,
        acceptedScope: true,
        selectedAddonIds,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result?.ok) {
      throw new Error(
        result?.error ||
          "No fue posible guardar la confirmación de alcance."
      );
    }

    if (onSuccess) {
      onSuccess();
      return;
    }

    window.location.href = "/onboarding/payment";
  } catch (error) {
    console.error("SCOPE_CONFIRMATION_SUBMIT_ERROR:", error);
    setSubmitError(
      error instanceof Error
        ? error.message
        : "No fue posible guardar la confirmación de alcance."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
      <div className="mb-8">
        <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-5 py-3 text-sm font-medium text-[#4F46E5]">
          Confirmación de alcance
        </span>

        <h1 className="mb-4 text-[56px] font-semibold leading-[1.04] tracking-[-0.03em] text-[#202430]">
          Esto incluye tu paquete recomendado
        </h1>

        <p className="max-w-5xl text-[20px] leading-9 text-[#4B5563]">
          Antes de continuar, revisa claramente lo que sí incluye el paquete{" "}
          <strong>{packageName}</strong>, lo que queda fuera del alcance base y
          los complementos opcionales que podrían añadirse después.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8F9FC] p-6">
          <h3 className="mb-5 text-[24px] font-semibold text-[#202430]">
            Incluye
          </h3>

          <div className="grid gap-3">
            {includedItems.length > 0 ? (
              includedItems.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 text-[#202430]"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 text-[#6B7280]">
                No hay elementos incluidos configurados para este paquete.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#F3D4C2] bg-[#FFF8F5] p-6">
          <h3 className="mb-5 text-[24px] font-semibold text-[#202430]">
            No incluye
          </h3>

          <div className="grid gap-3">
            {excludedItems.length > 0 ? (
              excludedItems.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="rounded-2xl border border-[#F3D4C2] bg-white px-4 py-4 text-[15px] leading-7 text-[#7C2D12]"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[#F3D4C2] bg-white px-4 py-4 text-[15px] leading-7 text-[#7C2D12]">
                No hay exclusiones configuradas para este paquete.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-6">
        <h3 className="mb-5 text-[24px] font-semibold text-[#202430]">
          Add-ons opcionales
        </h3>

        {optionalAddons.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {optionalAddons.map((addon) => {
              const active = selectedAddonIds.includes(addon.id);

              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`rounded-full border px-4 py-3 text-left text-sm transition ${
                    active
                      ? "border-[#4F46E5] bg-[#EEF2FF] text-[#312E81]"
                      : "border-[#D1D5DB] bg-white text-[#4B5563] hover:border-[#9CA3AF]"
                  }`}
                >
                  <span className="block font-semibold">{addon.name}</span>
                  <span className="mt-1 block text-xs opacity-80">
                    {formatAddonPrice(addon.priceType, addon.priceAmount)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[15px] leading-7 text-[#6B7280]">
            Este paquete no tiene add-ons opcionales configurados por ahora.
          </p>
        )}
      </div>

      <div className="mb-8 rounded-[20px] border border-[#E5E7EB] bg-[#F8F9FC] px-5 py-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={acceptedScope}
            onChange={(e) => {
              setAcceptedScope(e.target.checked);
              if (e.target.checked) {
                setError("");
              }
            }}
            className="mt-1 h-[18px] w-[18px]"
          />

          <span className="text-[16px] leading-8 text-[#202430]">
            Confirmo que entiendo lo que incluye este paquete, lo que queda
            fuera del alcance base y que cualquier requerimiento adicional puede
            implicar una ampliación de alcance o un add-on.
          </span>
        </label>

        {error ? (
          <p className="mt-3 text-sm font-medium text-[#DC2626]">{error}</p>
        ) : null}
      </div>

      {submitError ? (
        <div className="mb-8 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
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
        type="button"
        onClick={handleContinue}
        disabled={isSubmitting}
        className={`inline-flex h-14 min-w-[180px] items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition ${
            isSubmitting
            ? "cursor-not-allowed bg-[#A7AFBE]"
            : "bg-[#202430] hover:bg-[#111827]"
        }`}
        >
        {isSubmitting ? "Guardando..." : "Continuar"}
        </button>
      </div>
    </div>
  );
}