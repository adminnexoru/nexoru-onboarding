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

function formatAddonPrice(
  priceType: string,
  priceAmount?: string | null
): string {
  if (!priceAmount) {
    return "Precio personalizado";
  }

  const amount = Number(priceAmount);

  if (Number.isNaN(amount)) {
    return "Precio personalizado";
  }

  const formatted = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);

  if (priceType === "MONTHLY") {
    return `${formatted} / mes`;
  }

  return formatted;
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
    <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
      <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-5 py-3 text-sm font-medium text-[#4F46E5]">
        Confirmación de alcance
      </span>

      <h1 className="mb-4 text-[56px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#202430]">
        Esto incluye tu paquete recomendado
      </h1>

      <p className="mb-10 max-w-5xl text-[20px] leading-9 text-[#4B5563]">
        Antes de continuar, revisa claramente lo que sí incluye el paquete{" "}
        <strong>{packageName}</strong>, lo que queda fuera del alcance base y
        los complementos opcionales que podrían añadirse después.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-6">
          <h3 className="mb-5 text-[22px] font-semibold text-[#202430]">
            Incluye
          </h3>

          <div className="grid gap-3">
            {includedItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 text-[16px] text-[#202430]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#F3D4C2] bg-[#FFF8F5] p-6">
          <h3 className="mb-5 text-[22px] font-semibold text-[#202430]">
            No incluye
          </h3>

          <div className="grid gap-3">
            {excludedItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#F3D4C2] bg-white px-5 py-4 text-[16px] text-[#7C2D12]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-6">
        <h3 className="mb-5 text-[22px] font-semibold text-[#202430]">
          Add-ons opcionales
        </h3>

        {optionalAddons.length === 0 ? (
          <div className="text-[15px] text-[#6B7280]">
            Este paquete no tiene add-ons opcionales configurados por ahora.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {optionalAddons.map((item) => {
              const active = selected.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAddon(item.id)}
                  className={`rounded-full border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#6366F1] bg-[#EEF2FF]"
                      : "border-[#D1D5DB] bg-white"
                  }`}
                >
                  <div className="text-[16px] font-semibold text-[#202430]">
                    {item.name}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {formatAddonPrice(item.priceType, item.priceAmount)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked);
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
          <p className="mt-4 text-sm font-medium text-[#DC2626]">{error}</p>
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
          onClick={onBack}
          className="inline-flex h-14 min-w-[108px] items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[16px] font-semibold text-[#202430] transition hover:bg-[#F9FAFB]"
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting || !canContinue}
          className={`inline-flex h-14 min-w-[180px] items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition ${
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