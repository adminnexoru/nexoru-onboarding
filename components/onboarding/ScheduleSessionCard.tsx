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
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
      <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#4F46E5] sm:px-5 sm:py-3 sm:text-sm">
        Agenda sesión
      </span>

      <h1 className="mb-8 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#202430] sm:mb-9 sm:text-[38px] md:mb-8 md:text-[60px] md:leading-[1.04]">
        Agenda una sesión de entendimiento
      </h1>

      <p className="mb-10 max-w-4xl text-[16px] leading-7 text-[#4B5563] sm:mb-12 sm:text-[17px] sm:leading-8 md:mb-12 md:text-[20px] md:leading-9">
        Selecciona una fecha y uno de los horarios disponibles para revisar tu
        caso con Nexoru. La sesión tendrá una duración de {durationMinutes}{" "}
        minutos.
      </p>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6">
        <label className="mb-3 block text-[15px] font-semibold text-[#202430]">
          Fecha
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 text-[16px] text-[#202430] outline-none transition focus:border-[#4F46E5] sm:max-w-[260px]"
        />

        <p className="mt-3 text-sm leading-6 text-[#6B7280]">
          Zona horaria: {timezone}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-[18px] font-semibold text-[#202430]">
          Horarios disponibles
        </h3>

        {isLoadingSlots ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-2xl bg-[#E5E7EB]"
              />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 text-[15px] text-[#6B7280]">
            No hay horarios disponibles para la fecha seleccionada.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.start === slot.start;

              return (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`inline-flex h-14 items-center justify-center rounded-2xl border px-4 text-[15px] font-semibold transition ${
                    isSelected
                      ? "border-[#4F46E5] bg-[#EEF2FF] text-[#312E81]"
                      : "border-[#D1D5DB] bg-white text-[#202430] hover:border-[#A5B4FC]"
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
        <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:p-6">
          <h4 className="mb-3 text-[16px] font-semibold text-[#202430]">
            Confirmación preliminar
          </h4>

          <div className="space-y-2 text-[15px] leading-7 text-[#4B5563]">
            <p>
              <span className="font-semibold text-[#202430]">Fecha:</span>{" "}
              {selectedDate}
            </p>
            <p>
              <span className="font-semibold text-[#202430]">Hora:</span>{" "}
              {selectedSlot.label}
            </p>
            <p>
              <span className="font-semibold text-[#202430]">Duración:</span>{" "}
              {durationMinutes} minutos
            </p>
          </div>
        </div>
      ) : null}

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
          onClick={onSubmit}
          disabled={!selectedSlot || isSubmitting || isLoadingSlots}
          className={`inline-flex h-14 w-full items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition sm:w-auto sm:min-w-[220px] ${
            !selectedSlot || isSubmitting || isLoadingSlots
              ? "cursor-not-allowed bg-[#A7AFBE]"
              : "bg-[#202430] hover:bg-[#111827]"
          }`}
        >
          {isSubmitting ? "Reservando..." : "Confirmar agenda"}
        </button>
      </div>
    </div>
  );
}