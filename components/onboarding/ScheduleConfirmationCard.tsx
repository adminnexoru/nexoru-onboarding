"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  meetingReference: string;
  scheduledAt: string;
  scheduledEndAt: string;
  timezone: string;
  whatsappLink: string | null;
};

function formatDateTimeRange(
  startIso: string,
  endIso: string,
  timezone: string
) {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const dateFormatter = new Intl.DateTimeFormat("es-MX", {
    timeZone: timezone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("es-MX", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return {
    date: dateFormatter.format(start),
    timeRange: `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`,
  };
}

export default function ScheduleConfirmationCard({
  meetingReference,
  scheduledAt,
  scheduledEndAt,
  timezone,
  whatsappLink,
}: Props) {
  const formatted = formatDateTimeRange(
    scheduledAt,
    scheduledEndAt,
    timezone
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const syncViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const qrCodeUrl = useMemo(() => {
    if (!whatsappLink || isMobile) return null;

    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
      whatsappLink
    )}`;
  }, [whatsappLink, isMobile]);

  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#4F46E5] sm:px-5 sm:py-3 sm:text-sm">
        Confirmación final
      </span>

      <h1 className="mb-8 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#202430] sm:mb-9 sm:text-[38px] md:mb-8 md:text-[60px] md:leading-[1.04]">
        Tu sesión quedó agendada
      </h1>

      <p className="mb-10 max-w-4xl text-[16px] leading-7 text-[#4B5563] sm:mb-12 sm:text-[17px] sm:leading-8 md:mb-12 md:text-[20px] md:leading-9">
        Ya registramos tu sesión de entendimiento con Nexoru. Usa la referencia
        del caso para cualquier seguimiento comercial o por WhatsApp.
      </p>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:rounded-[28px] sm:p-8">
        <div className="mb-3 text-[15px] font-semibold text-[#4F46E5]">
          Referencia del caso
        </div>

        <div className="break-words text-[24px] font-semibold text-[#202430] sm:text-[30px]">
          {meetingReference}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="mb-2 text-[15px] text-[#6B7280]">Fecha</div>
          <div className="text-[18px] font-semibold capitalize text-[#202430]">
            {formatted.date}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="mb-2 text-[15px] text-[#6B7280]">Horario</div>
          <div className="text-[18px] font-semibold text-[#202430]">
            {formatted.timeRange}
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:rounded-[28px] sm:p-8">
        <h3 className="mb-3 text-[22px] font-semibold text-[#202430]">
          Para finalizar y dejar todo listo
        </h3>

        <p className="mb-6 text-[16px] leading-7 text-[#4B5563] sm:text-[17px] sm:leading-8">
          {isMobile
            ? "Da clic en el botón de WhatsApp para continuar con Nexoru usando tu referencia."
            : "Escanea el QR con tu celular o abre WhatsApp para continuar con Nexoru usando tu referencia."}
        </p>

        {isMobile ? (
          whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-[#25D366] px-6 text-[16px] font-semibold text-white transition hover:opacity-90"
            >
              Abrir WhatsApp con referencia
            </a>
          ) : null
        ) : (
          <div className="flex flex-col items-center rounded-[24px] border border-[#D1D5DB] bg-white px-5 py-6">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="QR para abrir WhatsApp"
                className="h-[220px] w-[220px] rounded-2xl"
              />
            ) : null}

            <div className="mt-4 text-center text-[14px] leading-6 text-[#6B7280]">
              Escanea este código para abrir WhatsApp con tu referencia
            </div>

            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-6 text-[15px] font-semibold text-[#202430] transition hover:bg-[#F9FAFB]"
              >
                Abrir enlace manualmente
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}