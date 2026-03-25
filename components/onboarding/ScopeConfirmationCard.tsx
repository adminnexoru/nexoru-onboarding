"use client";

import { useMemo, useState } from "react";

type OptionalAddon = {
  id: string;
  code: string;
  name: string;
  description: string;
  setupPrice: string | null;
  monthlyPrice: string | null;
};

type ScopeConfirmationCardProps = {
  packageName: string;
  includedItems: string[];
  excludedItems: string[];
  optionalAddons: OptionalAddon[];
  acceptedScope: boolean;
  selectedAddonIds: string[];
  isSubmitting: boolean;
  submitError: string;
  onBack: () => void;
  onContinue: (payload: {
    acceptedScope: boolean;
    selectedAddonIds: string[];
  }) => Promise<void>;
};

function formatMoney(value: string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatAddonPricing(
  setupPrice: string | null,
  monthlyPrice: string | null
) {
  const setup = Number(setupPrice ?? 0);
  const monthly = Number(monthlyPrice ?? 0);

  if (setup <= 0 && monthly <= 0) {
    return "Precio por definir";
  }

  if (setup <= 0 && monthly > 0) {
    return `${formatMoney(monthlyPrice)} / mes`;
  }

  if (setup > 0 && monthly <= 0) {
    return `Setup ${formatMoney(setupPrice)}`;
  }

  return `Setup ${formatMoney(setupPrice)} · Mensual ${formatMoney(monthlyPrice)}`;
}

export default function ScopeConfirmationCard({
  packageName,
  includedItems,
  excludedItems,
  optionalAddons,
  acceptedScope,
  selectedAddonIds,
  isSubmitting,
  submitError,
  onBack,
  onContinue,
}: ScopeConfirmationCardProps) {
  const [accepted, setAccepted] = useState(acceptedScope);
  const [selected, setSelected] = useState<string[]>(selectedAddonIds);
  const [error, setError] = useState("");

  const canContinue = useMemo(() => accepted, [accepted]);

  const toggleAddon = (addonId: string) => {
    setSelected((prev) =>
      prev.includes(addonId)
        ? prev.filter((item) => item !== addonId)
        : [...prev, addonId]
    );
  };

  const handleContinue = async () => {
    if (!accepted) {
      setError("Debes confirmar que entiendes el alcance para continuar.");
      return;
    }

    setError("");

    await onContinue({
      acceptedScope: true,
      selectedAddonIds: selected,
    });
  };

  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">

  <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#4F46E5] sm:px-5 sm:py-3 sm:text-sm">
        Confirmación de alcance
      </span>

      <h1 className="mb-8 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#202430] sm:mb-9 sm:text-[38px] md:mb-8 md:text-[60px] md:leading-[1.04]">
        Esto incluye tu paquete recomendado
      </h1>

      <p className="mb-10 max-w-4xl text-[16px] leading-7 text-[#4B5563] sm:mb-12 sm:text-[17px] sm:leading-8 md:mb-12 md:text-[20px] md:leading-9">
        Antes de continuar, revisa claramente lo que sí incluye el paquete{" "}
        <strong>{packageName}</strong>, lo que queda fuera del alcance base y
        los complementos opcionales que podrían añadirse después.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6">
          <h3 className="mb-5 text-[20px] font-semibold text-[#202430] sm:text-[22px]">
            Incluye
          </h3>

          <div className="grid gap-3">
            {includedItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 break-words text-[#202430] sm:px-5 sm:text-[16px]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#F3D4C2] bg-[#FFF8F5] p-5 sm:p-6">
          <h3 className="mb-5 text-[20px] font-semibold text-[#202430] sm:text-[22px]">
            No incluye
          </h3>

          <div className="grid gap-3">
            {excludedItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#F3D4C2] bg-white px-4 py-4 text-[15px] leading-7 break-words text-[#7C2D12] sm:px-5 sm:text-[16px]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h3 className="mb-5 text-[20px] font-semibold text-[#202430] sm:text-[22px]">
          Add-ons opcionales
        </h3>

        {optionalAddons.length === 0 ? (
          <div className="text-[15px] leading-7 text-[#6B7280]">
            Este paquete no tiene add-ons opcionales configurados por ahora.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {optionalAddons.map((addon) => {
              const active = selected.includes(addon.id);

              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${
                    active
                      ? "border-[#6366F1] bg-[#EEF2FF]"
                      : "border-[#D1D5DB] bg-white"
                  }`}
                >
                  <div className="break-words text-[16px] font-semibold leading-6 text-[#202430]">
                    {addon.name}
                  </div>

                  <div className="mt-2 text-sm leading-6 break-words text-[#6B7280]">
                    {formatAddonPricing(addon.setupPrice, addon.monthlyPrice)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

        <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6">
        <label className="grid w-full grid-cols-[18px,minmax(0,1fr)] items-start gap-3">
            <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
                setAccepted(e.target.checked);
                if (e.target.checked) {
                setError("");
                }
            }}
            className="mt-1 h-[18px] w-[18px] min-w-[18px] max-w-[18px]"
            />

            <span className="min-w-0 break-words text-[15px] leading-7 text-[#202430] sm:text-[16px] sm:leading-8">
            Confirmo que entiendo lo que incluye este paquete, lo que queda
            fuera del alcance base y que cualquier requerimiento adicional puede
            implicar una ampliación de alcance o un add-on.
            </span>
        </label>

        {error ? (
            <p className="mt-4 text-sm font-medium text-[#DC2626]">{error}</p>
        ) : null}
        </div>

      {submitError ? (
        <div className="mb-8 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm font-medium text-[#B91C1C]">
          {submitError}
        </div>
      ) : null}

      <div className="mt-12 flex flex-col gap-4 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[16px] font-semibold text-[#202430] transition hover:bg-[#F9FAFB] sm:w-auto sm:min-w-[120px]"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting || !canContinue}
          className={`inline-flex h-14 w-full items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition sm:w-auto sm:min-w-[180px] ${
            isSubmitting || !canContinue
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