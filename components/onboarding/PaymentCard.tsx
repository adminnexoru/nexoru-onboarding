"use client";

type SelectedAddonItem = {
  id: string;
  sessionId: string;
  addonId: string;
  createdAt?: string | Date;
  addon: {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    setupPrice: string | null;
    monthlyPrice: string | null;
  };
};

type PaymentCardProps = {
  packageName: string;
  setupPrice: string;
  monthlyPrice: string;
  selectedAddons: SelectedAddonItem[];
  addonsSetupTotal: string;
  addonsMonthlyTotal: string;
  totalInitial: string;
  totalMonthly: string;
  isSubmitting: boolean;
  submitError: string;
  onBack: () => void;
  onContinue: () => Promise<void>;
};

function formatCurrency(value: string | null | undefined) {
  if (!value) return "$0";

  const amount = Number(value);

  if (Number.isNaN(amount)) return "$0";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentCard({
  packageName,
  setupPrice,
  monthlyPrice,
  selectedAddons,
  addonsSetupTotal,
  addonsMonthlyTotal,
  totalInitial,
  totalMonthly,
  isSubmitting,
  submitError,
  onBack,
  onContinue,
}: PaymentCardProps) {
  return (
    <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
      <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-5 py-3 text-sm font-medium text-[#4F46E5]">
        Paso final · Pago
      </span>

      <h1 className="mb-4 text-[56px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#202430]">
        Confirmemos tu inversión inicial
      </h1>

      <p className="mb-10 max-w-4xl text-[20px] leading-9 text-[#4B5563]">
        Revisa el paquete seleccionado, los complementos elegidos y el monto
        estimado para avanzar con tu implementación Nexoru.
      </p>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-8">
        <div className="mb-6">
          <div className="mb-2 text-sm font-semibold text-[#4F46E5]">
            Paquete recomendado
          </div>
          <div className="text-[36px] font-semibold text-[#202430]">
            {packageName}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="mb-2 text-sm text-[#6B7280]">Setup estimado</div>
            <div className="text-[28px] font-semibold text-[#202430]">
              {formatCurrency(setupPrice)}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="mb-2 text-sm text-[#6B7280]">Mensualidad estimada</div>
            <div className="text-[28px] font-semibold text-[#202430]">
              {formatCurrency(monthlyPrice)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-white p-8">
        <h3 className="mb-5 text-[24px] font-semibold text-[#202430]">
          Add-ons seleccionados
        </h3>

        {selectedAddons.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-[15px] text-[#6B7280]">
            No seleccionaste add-ons adicionales.
          </div>
        ) : (
          <div className="grid gap-4">
            {selectedAddons.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4"
              >
                <div>
                  <div className="text-[16px] font-semibold text-[#202430]">
                    {item.addon.name}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {item.addon.description || "Complemento opcional"}
                  </div>
                </div>

                <div className="text-right text-sm font-semibold text-[#202430]">
                  <div>Setup {formatCurrency(item.addon.setupPrice)}</div>
                  <div className="mt-1 text-[#6B7280]">
                    Mensual {formatCurrency(item.addon.monthlyPrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-8">
          <div className="mb-2 text-sm font-semibold text-[#4F46E5]">
            Setup add-ons seleccionados
          </div>
          <div className="text-[32px] font-semibold text-[#202430]">
            {formatCurrency(addonsSetupTotal)}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-8">
          <div className="mb-2 text-sm font-semibold text-[#4F46E5]">
            Mensualidad add-ons seleccionados
          </div>
          <div className="text-[32px] font-semibold text-[#202430]">
            {formatCurrency(addonsMonthlyTotal)}
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-8">
          <div className="mb-2 text-sm font-semibold text-[#4F46E5]">
            Total inicial estimado
          </div>
          <div className="text-[40px] font-semibold text-[#202430]">
            {formatCurrency(totalInitial)}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">
            Setup del paquete más setup de add-ons seleccionados.
          </p>
        </div>

        <div className="rounded-[24px] border border-[#D9E3F0] bg-[#F8FAFC] p-8">
          <div className="mb-2 text-sm font-semibold text-[#4F46E5]">
            Total mensual estimado
          </div>
          <div className="text-[40px] font-semibold text-[#202430]">
            {formatCurrency(totalMonthly)}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">
            Mensualidad del paquete más mensualidad de add-ons seleccionados.
          </p>
        </div>
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
          onClick={onContinue}
          disabled={isSubmitting}
          className={`inline-flex h-14 min-w-[220px] items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition ${
            isSubmitting
              ? "cursor-not-allowed bg-[#A7AFBE]"
              : "bg-[#202430] hover:bg-[#111827]"
          }`}
        >
          {isSubmitting ? "Generando pago..." : "Continuar al pago"}
        </button>
      </div>
    </div>
  );
}