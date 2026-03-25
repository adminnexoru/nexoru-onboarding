"use client";

import Link from "next/link";

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

type ExecutiveSummaryCardProps = {
  businessName: string;
  industry: string;
  goal: string;
  packageName: string;
  packageSetupPrice: string;
  packageMonthlyPrice: string;
  selectedAddons: SelectedAddonItem[];
  addonsSetupTotal: string;
  addonsMonthlyTotal: string;
  totalSetupPrice: string;
  totalMonthlyPrice: string;
  paymentReference: string;
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

export default function ExecutiveSummaryCard({
  businessName,
  industry,
  goal,
  packageName,
  packageSetupPrice,
  packageMonthlyPrice,
  selectedAddons,
  addonsSetupTotal,
  addonsMonthlyTotal,
  totalSetupPrice,
  totalMonthlyPrice,
  paymentReference,
}: ExecutiveSummaryCardProps) {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 lg:px-10 lg:py-10">

        <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#4F46E5] sm:px-5 sm:py-3 sm:text-sm">
          Resumen ejecutivo
        </span>

        <h1 className="mb-8 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#202430] sm:mb-9 sm:text-[38px] md:mb-8 md:text-[60px] md:leading-[1.04]">
          Tu configuración Nexoru está lista
        </h1>

         <p className="mb-10 max-w-4xl text-[16px] leading-7 text-[#4B5563] sm:mb-12 sm:text-[17px] sm:leading-8 md:mb-12 md:text-[20px] md:leading-9">
          Este es el resumen consolidado de tu onboarding. Aquí puedes revisar
          el contexto del negocio, la solución recomendada y la inversión
          estimada antes de pasar al pago.
        </p>

      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-[#F8F9FC] p-5 sm:p-6">
          <h3 className="mb-5 text-[22px] font-semibold text-[#2B2F36] sm:text-[24px]">
            Resumen del caso
          </h3>

          <div className="grid gap-3">
            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 sm:px-5">
              <strong className="text-[#2B2F36]">Negocio:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{businessName}</span>
            </div>

            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 sm:px-5">
              <strong className="text-[#2B2F36]">Industria:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{industry}</span>
            </div>

            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 sm:px-5">
              <strong className="text-[#2B2F36]">Objetivo principal:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{goal}</span>
            </div>

            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 sm:px-5">
              <strong className="text-[#2B2F36]">Paquete recomendado:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{packageName}</span>
            </div>

            {paymentReference ? (
              <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4 text-[15px] leading-7 sm:px-5">
                <strong className="text-[#2B2F36]">Referencia de pago:</strong>{" "}
                <span className="break-all text-[#4A4F57]">
                  {paymentReference}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <h3 className="mb-5 text-[22px] font-semibold text-[#2B2F36] sm:text-[24px]">
            Inversión estimada
          </h3>

          <div className="grid gap-4">
            <div className="rounded-[16px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
              <div className="mb-2 text-sm text-[#6B7280]">
                Setup inicial total
              </div>
              <div className="break-words text-[28px] font-semibold text-[#2B2F36] sm:text-[30px]">
                {formatCurrency(totalSetupPrice)}
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
              <div className="mb-2 text-sm text-[#6B7280]">
                Mensualidad estimada total
              </div>
              <div className="break-words text-[28px] font-semibold text-[#2B2F36] sm:text-[30px]">
                {formatCurrency(totalMonthlyPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[20px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h3 className="mb-5 text-[22px] font-semibold text-[#2B2F36] sm:text-[24px]">
          Desglose económico
        </h3>

        <div className="grid gap-3">
          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4 text-[15px] leading-7 sm:px-5">
            <strong className="text-[#2B2F36]">Setup paquete:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(packageSetupPrice)}
            </span>
          </div>

          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4 text-[15px] leading-7 sm:px-5">
            <strong className="text-[#2B2F36]">Mensualidad paquete:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(packageMonthlyPrice)}
            </span>
          </div>

          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4 text-[15px] leading-7 sm:px-5">
            <strong className="text-[#2B2F36]">Setup add-ons:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(addonsSetupTotal)}
            </span>
          </div>

          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4 text-[15px] leading-7 sm:px-5">
            <strong className="text-[#2B2F36]">Mensualidad add-ons:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(addonsMonthlyTotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[20px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h3 className="mb-5 text-[22px] font-semibold text-[#2B2F36] sm:text-[24px]">
          Add-ons seleccionados
        </h3>

        {selectedAddons.length > 0 ? (
          <div className="grid gap-3">
            {selectedAddons.map((item) => (
              <div
                key={item.id}
                className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4 sm:px-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-1 break-words text-[16px] font-semibold text-[#2B2F36]">
                      {item.addon.name}
                    </div>
                    <div className="text-[14px] leading-6 break-words text-[#6B7280]">
                      {item.addon.description || "Complemento opcional"}
                    </div>
                  </div>

                  <div className="text-[14px] font-semibold leading-6 text-[#2B2F36] sm:min-w-[180px] sm:text-right">
                    <div>Setup {formatCurrency(item.addon.setupPrice)}</div>
                    <div>Mensual {formatCurrency(item.addon.monthlyPrice)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[16px] leading-7 text-[#6B7280]">
            No seleccionaste add-ons opcionales en esta etapa.
          </p>
        )}
      </div>

      <div className="mb-8 rounded-[18px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
        <h3 className="mb-3 text-[18px] font-semibold text-[#2B2F36] sm:text-[20px]">
          Siguiente paso
        </h3>

        <p className="text-[15px] leading-7 text-[#4A4F57] sm:text-[16px]">
          La inversión inicial ya quedó consolidada con base en el paquete y los
          add-ons seleccionados. Este resumen puede usarse como referencia
          operativa y comercial del arranque.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/onboarding/payment"
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[15px] font-semibold text-[#2B2F36] no-underline transition hover:bg-[#F9FAFB] sm:w-auto"
        >
          Atrás
        </Link>

        <Link
          href="/onboarding/payment"
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F36] px-6 text-[15px] font-semibold text-white no-underline transition hover:bg-[#1F2329] sm:w-auto"
        >
          Ir a pago
        </Link>
      </div>
    </div>
  );
}