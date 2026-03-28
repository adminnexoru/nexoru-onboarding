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
    <div className="nx-page-card">
      <span className="nx-pill">Confirmación final</span>

      <div className="nx-section" style={{ marginTop: 24 }}>
        <h1 className="nx-title">Tu sesión quedó agendada</h1>

        <p className="nx-subtitle">
          Ya registramos tu sesión de entendimiento con Nexoru. Usa la
          referencia del caso para cualquier seguimiento comercial o por
          WhatsApp.
        </p>
      </div>

      <div className="nx-section">
        <div className="nx-reference-panel">
          <div className="nx-panel-eyebrow">Referencia del caso</div>

          <div className="nx-reference-value">{meetingReference}</div>
        </div>
      </div>

      <div className="nx-section nx-datetime-grid">
        <div className="nx-datetime-card">
          <div className="nx-datetime-label">Fecha</div>
          <div className="nx-datetime-value nx-capitalize">{formatted.date}</div>
        </div>

        <div className="nx-datetime-card">
          <div className="nx-datetime-label">Horario</div>
          <div className="nx-datetime-value">{formatted.timeRange}</div>
        </div>
      </div>

      <div className="nx-section">
        <div className="nx-whatsapp-panel">
          <h3 className="nx-whatsapp-title">Para finalizar y dejar todo listo</h3>

          <p className="nx-whatsapp-copy">
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
                className="nx-whatsapp-button"
              >
                Abrir WhatsApp con referencia
              </a>
            ) : null
          ) : (
            <div className="nx-qr-card">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="QR para abrir WhatsApp"
                  className="nx-qr-image"
                />
              ) : null}

              <div className="nx-qr-copy">
                Escanea este código para abrir WhatsApp con tu referencia
              </div>

              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="nx-btn nx-btn-secondary nx-link-btn"
                  style={{ minWidth: 220 }}
                >
                  Abrir enlace manualmente
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .nx-panel-eyebrow {
          margin-bottom: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #a78bfa;
        }

        .nx-reference-panel,
        .nx-whatsapp-panel,
        .nx-datetime-card,
        .nx-qr-card {
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            0 18px 50px rgba(0, 0, 0, 0.18);
        }

        .nx-reference-panel,
        .nx-whatsapp-panel {
          background:
            linear-gradient(
              180deg,
              rgba(17, 21, 34, 0.92) 0%,
              rgba(10, 13, 23, 0.92) 100%
            );
          padding: 22px;
        }

        .nx-reference-value {
          word-break: break-word;
          font-size: 28px;
          line-height: 1.15;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-datetime-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .nx-datetime-card {
          background: rgba(255, 255, 255, 0.03);
          padding: 18px;
        }

        .nx-datetime-label {
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.62);
        }

        .nx-datetime-value {
          font-size: 18px;
          line-height: 1.5;
          font-weight: 700;
          color: #ffffff;
          word-break: break-word;
        }

        .nx-capitalize {
          text-transform: capitalize;
        }

        .nx-whatsapp-title {
          margin: 0 0 10px;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-whatsapp-copy {
          margin: 0 0 22px;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.76);
        }

        .nx-whatsapp-button {
          display: inline-flex;
          min-height: 56px;
          width: 100%;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: #25d366;
          padding: 0 24px;
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          transition:
            transform 0.18s ease,
            opacity 0.18s ease,
            box-shadow 0.18s ease;
          box-shadow: 0 0 24px rgba(37, 211, 102, 0.24);
        }

        .nx-whatsapp-button:hover {
          transform: translateY(-1px);
          opacity: 0.92;
        }

        .nx-qr-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          padding: 22px;
        }

        .nx-qr-image {
          width: 220px;
          height: 220px;
          border-radius: 20px;
          background: #ffffff;
          object-fit: cover;
        }

        .nx-qr-copy {
          margin: 16px 0 18px;
          text-align: center;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.62);
        }

        .nx-link-btn {
          text-decoration: none;
        }

        @media (min-width: 768px) {
          .nx-reference-panel,
          .nx-whatsapp-panel {
            padding: 30px;
          }

          .nx-reference-value {
            font-size: 32px;
          }

          .nx-datetime-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .nx-datetime-card {
            padding: 22px;
          }

          .nx-whatsapp-title {
            font-size: 24px;
          }

          .nx-whatsapp-copy {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}