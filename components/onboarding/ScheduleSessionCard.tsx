"use client";

type Slot = {
  start: string;
  end: string;
  label: string;
};

type Props = {
  selectedDate: string;
  timezone: string;
  durationMinutes: number;
  slots: Slot[];
  selectedSlot: Slot | null;
  isLoadingSlots?: boolean;
  isSubmitting?: boolean;
  submitError?: string;
  onDateChange: (date: string) => void;
  onSelectSlot: (slot: Slot) => void;
  onBack: () => void;
  onSubmit: () => Promise<void>;
};

export default function ScheduleSessionCard({
  selectedDate,
  timezone,
  durationMinutes,
  slots,
  selectedSlot,
  isLoadingSlots = false,
  isSubmitting = false,
  submitError = "",
  onDateChange,
  onSelectSlot,
  onBack,
  onSubmit,
}: Props) {
  return (
    <div className="nx-page-card">
      <span className="nx-pill">Agenda sesión</span>

      <div className="nx-section" style={{ marginTop: 24 }}>
        <h1 className="nx-title">Agenda una sesión de entendimiento</h1>

        <p className="nx-subtitle">
          Selecciona una fecha y uno de los horarios disponibles para revisar tu
          caso con Nexoru. La sesión tendrá una duración de {durationMinutes}{" "}
          minutos.
        </p>
      </div>

      <div className="nx-section">
        <div className="nx-date-panel">
          <label className="nx-label">Fecha</label>

          <div className="nx-date-wrap">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="nx-input nx-date-input"
            />
            <span className="nx-date-icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M16 2V5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M3 9H21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="17"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
          </div>

          <p className="nx-meta-copy">Zona horaria: {timezone}</p>
        </div>
      </div>

      <div className="nx-section">
        <h3 className="nx-section-title">Horarios disponibles</h3>

        {isLoadingSlots ? (
          <div className="nx-slots-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="nx-slot-skeleton" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="nx-empty-state">
            No hay horarios disponibles para la fecha seleccionada.
          </div>
        ) : (
          <div className="nx-slots-grid">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.start === slot.start;

              return (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`nx-slot-button ${
                    isSelected ? "nx-slot-button-active" : ""
                  }`}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedSlot ? (
        <div className="nx-section">
          <div className="nx-confirm-panel">
            <h4 className="nx-confirm-title">Confirmación preliminar</h4>

            <div className="nx-confirm-list">
              <p>
                <span className="nx-confirm-label">Fecha:</span> {selectedDate}
              </p>
              <p>
                <span className="nx-confirm-label">Hora:</span>{" "}
                {selectedSlot.label}
              </p>
              <p>
                <span className="nx-confirm-label">Duración:</span>{" "}
                {durationMinutes} minutos
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {submitError ? (
        <div className="nx-section">
          <div className="nx-alert nx-alert--error">{submitError}</div>
        </div>
      ) : null}

      <div className="nx-actions">
        <button
          type="button"
          onClick={onBack}
          className="nx-btn nx-btn-secondary"
          style={{ minWidth: 130 }}
        >
          Atrás
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!selectedSlot || isSubmitting || isLoadingSlots}
          className={`nx-btn ${
            !selectedSlot || isSubmitting || isLoadingSlots
              ? "nx-btn-muted"
              : "nx-btn-primary"
          }`}
          style={{ minWidth: 220 }}
        >
          {isSubmitting ? (
            <span className="nx-inline-loading">
              <span className="nx-spinner" />
              Reservando...
            </span>
          ) : (
            "Confirmar agenda"
          )}
        </button>
      </div>

      <style jsx>{`
        .nx-section-title {
          margin: 0 0 16px;
          font-size: 20px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-date-panel,
        .nx-confirm-panel {
          min-width: 0;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background:
            linear-gradient(
              180deg,
              rgba(17, 21, 34, 0.92) 0%,
              rgba(10, 13, 23, 0.92) 100%
            );
          padding: 20px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.03),
            0 18px 50px rgba(0, 0, 0, 0.18);
        }

        .nx-date-wrap {
          position: relative;
          width: 100%;
          min-width: 0;
        }

        .nx-date-input {
          width: 100%;
          min-width: 0;
          padding-right: 52px;
          appearance: none;
          -webkit-appearance: none;
        }

        .nx-date-input::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          opacity: 0;
          cursor: pointer;
        }

        .nx-date-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #a78bfa;
          opacity: 0.9;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .nx-meta-copy {
          margin: 12px 0 0;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.62);
        }

        .nx-slots-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .nx-slot-skeleton {
          height: 56px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          animation: pulse 1.4s ease-in-out infinite;
        }

        .nx-slot-button {
          display: inline-flex;
          height: 56px;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          padding: 0 16px;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.88);
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .nx-slot-button:hover {
          transform: translateY(-1px);
          border-color: rgba(124, 58, 237, 0.4);
        }

        .nx-slot-button-active {
          border-color: rgba(124, 58, 237, 0.65);
          background:
            linear-gradient(
              180deg,
              rgba(124, 58, 237, 0.15) 0%,
              rgba(37, 99, 235, 0.08) 100%
            ),
            rgba(255, 255, 255, 0.03);
          color: #ddd6fe;
          box-shadow:
            0 0 0 1px rgba(124, 58, 237, 0.2),
            0 18px 44px rgba(76, 29, 149, 0.16);
        }

        .nx-empty-state {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          padding: 14px 16px;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.66);
        }

        .nx-confirm-title {
          margin: 0 0 14px;
          font-size: 16px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
        }

        .nx-confirm-list {
          display: grid;
          gap: 8px;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.76);
        }

        .nx-confirm-list p {
          margin: 0;
        }

        .nx-confirm-label {
          font-weight: 700;
          color: #ffffff;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.45;
          }
        }

        @media (min-width: 768px) {
          .nx-section-title {
            font-size: 22px;
          }

          .nx-date-panel,
          .nx-confirm-panel {
            padding: 24px;
          }

          .nx-date-wrap {
            max-width: 320px;
          }

          .nx-slots-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }

          .nx-confirm-title {
            font-size: 17px;
          }

          .nx-confirm-list {
            font-size: 16px;
          }
        }

        @media (min-width: 1100px) {
          .nx-date-wrap {
            max-width: 340px;
          }

          .nx-slots-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}