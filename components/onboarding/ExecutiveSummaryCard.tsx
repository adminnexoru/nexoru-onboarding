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
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <div className="mb-8 sm:mb-10">
        <div className="mb-5 inline-flex rounded-full bg-[#E8EBF8] px-4 py-2 text-[13px] font-medium text-[#3A3D91] sm:text-sm">
          Resumen ejecutivo
        </div>

        <h1 className="mb-5 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#2B2F36] sm:text-[38px] md:text-[56px] md:leading-[1.04]">
          Tu configuración Nexoru está lista
        </h1>

        <p className="max-w-4xl text-[16px] leading-7 text-[#4A4F57] sm:text-[17px] sm:leading-8 md:text-[20px] md:leading-9">
          Este es el resumen consolidado de tu onboarding. Aquí puedes revisar
          el contexto del negocio, la solución recomendada y la inversión
          estimada antes de agendar tu sesión de entendimiento.
        </p>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-[#F8F9FC] p-5 sm:p-6">
          <h3 className="mb-5 text-[24px] font-semibold text-[#2B2F36]">
            Resumen del caso
          </h3>

          <div className="grid gap-4">
            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4">
              <strong className="text-[#2B2F36]">Negocio:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{businessName}</span>
            </div>

            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4">
              <strong className="text-[#2B2F36]">Industria:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{industry}</span>
            </div>

            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4">
              <strong className="text-[#2B2F36]">Objetivo principal:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{goal}</span>
            </div>

            <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4">
              <strong className="text-[#2B2F36]">Paquete recomendado:</strong>{" "}
              <span className="break-words text-[#4A4F57]">{packageName}</span>
            </div>

            {paymentReference ? (
              <div className="rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-4">
                <strong className="text-[#2B2F36]">Referencia de pago:</strong>{" "}
                <span className="break-all text-[#4A4F57]">
                  {paymentReference}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <h3 className="mb-5 text-[24px] font-semibold text-[#2B2F36]">
            Inversión estimada
          </h3>

          <div className="grid gap-4">
            <div className="rounded-[16px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
              <div className="mb-2 text-[14px] text-[#6B7280]">
                Setup inicial total
              </div>
              <div className="break-words text-[28px] font-semibold text-[#2B2F36] sm:text-[30px]">
                {formatCurrency(totalSetupPrice)}
              </div>
            </div>

            <div className="rounded-[16px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
              <div className="mb-2 text-[14px] text-[#6B7280]">
                Mensualidad estimada total
              </div>
              <div className="break-words text-[28px] font-semibold text-[#2B2F36] sm:text-[30px]">
                {formatCurrency(totalMonthlyPrice)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-7 rounded-[20px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h3 className="mb-5 text-[24px] font-semibold text-[#2B2F36]">
          Desglose económico
        </h3>

        <div className="grid gap-4">
          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4">
            <strong className="text-[#2B2F36]">Setup paquete:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(packageSetupPrice)}
            </span>
          </div>

          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4">
            <strong className="text-[#2B2F36]">Mensualidad paquete:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(packageMonthlyPrice)}
            </span>
          </div>

          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4">
            <strong className="text-[#2B2F36]">Setup add-ons:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(addonsSetupTotal)}
            </span>
          </div>

          <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4">
            <strong className="text-[#2B2F36]">Mensualidad add-ons:</strong>{" "}
            <span className="text-[#4A4F57]">
              {formatCurrency(addonsMonthlyTotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-7 rounded-[20px] border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <h3 className="mb-5 text-[24px] font-semibold text-[#2B2F36]">
          Add-ons seleccionados
        </h3>

        {selectedAddons.length > 0 ? (
          <div className="grid gap-4">
            {selectedAddons.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-[#F8F9FC] px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 text-[16px] font-bold text-[#2B2F36]">
                    {item.addon.name}
                  </div>
                  <div className="text-[14px] leading-6 text-[#6B7280]">
                    {item.addon.description || "Complemento opcional"}
                  </div>
                </div>

                <div className="text-left text-[14px] font-semibold leading-6 text-[#2B2F36] sm:min-w-[180px] sm:text-right">
                  <div>Setup {formatCurrency(item.addon.setupPrice)}</div>
                  <div>Mensual {formatCurrency(item.addon.monthlyPrice)}</div>
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

      <div className="mb-7 rounded-[18px] border border-[#E5E7EB] bg-[#F8F9FC] p-5">
        <h3 className="mb-3 text-[20px] font-semibold text-[#2B2F36]">
          Siguiente paso
        </h3>

        <p className="text-[16px] leading-7 text-[#4A4F57]">
          Agenda una sesión de entendimiento con Nexoru para revisar tu caso,
          validar alcance y continuar el proceso comercial.
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/onboarding/payment"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #D1D5DB",
            backgroundColor: "#FFFFFF",
            color: "#2B2F36",
            borderRadius: "14px",
            padding: "14px 22px",
            fontSize: "15px",
            fontWeight: 600,
            textDecoration: "none",
            WebkitTextFillColor: "#2B2F36",
          }}
        >
          <span
            style={{
              color: "#2B2F36",
              WebkitTextFillColor: "#2B2F36",
              fontWeight: 600,
            }}
          >
            Atrás
          </span>
        </Link>

      <Link
        href="/onboarding/schedule-session"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backgroundColor: "#2B2F36",
          color: "#FFFFFF",
          borderRadius: "14px",
          padding: "14px 24px",
          fontSize: "15px",
          fontWeight: 600,
          textDecoration: "none",
          WebkitTextFillColor: "#FFFFFF",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            fontWeight: 700,
          }}
        >
          Agendar sesión
        </span>
      </Link>
      </div>
    </div>
  );
}