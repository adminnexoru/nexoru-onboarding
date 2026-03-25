"use client";

import { formatRecommendationMoney } from "@/lib/services/package-recommendation";

type Recommendation = {
  packageCode: string | null;
  packageName: string;
  packageDescription: string;
  setupPrice: string | null;
  monthlyPrice: string | null;
  rationale: string[];
  strategicAnalysis: string;
  notes: string;
};

type Props = {
  recommendation: Recommendation;
  isSubmitting?: boolean;
  submitError?: string;
  onBack: () => void;
  onContinue: () => Promise<void>;
};

export default function PackageRecommendationCard({
  recommendation,
  isSubmitting = false,
  submitError = "",
  onBack,
  onContinue,
}: Props) {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-sm sm:rounded-[32px] sm:px-8 sm:py-9 md:px-12 md:py-12">
    <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-4 py-2 text-[13px] font-medium text-[#4F46E5] sm:px-5 sm:py-3 sm:text-sm">
        Recomendación preliminar
      </span>

      <h1 className="mb-8 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#202430] sm:mb-9 sm:text-[38px] md:mb-8 md:text-[60px] md:leading-[1.04]">
        Este es el paquete recomendado para tu caso
      </h1>

      <p className="mb-10 max-w-4xl text-[16px] leading-7 text-[#4B5563] sm:mb-12 sm:text-[17px] sm:leading-8 md:mb-12 md:text-[20px] md:leading-9">
        Con base en la información de tu negocio, objetivo, proceso actual y
        volumen operativo, esta es la configuración Nexoru que mejor encaja en
        esta etapa.
      </p>

      <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] p-5 sm:rounded-[28px] sm:p-8">
        <div className="mb-3 text-[15px] font-semibold text-[#4F46E5]">
          Paquete sugerido
        </div>

        <div className="mb-6 text-[28px] font-semibold leading-tight text-[#202430] sm:mb-8 sm:text-[34px]">
          {recommendation.packageName}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="mb-3 text-[15px] text-[#6B7280]">Setup estimado</div>
            <div className="break-words text-[24px] font-semibold text-[#202430] sm:text-[26px]">
              {formatRecommendationMoney(recommendation.setupPrice)}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
            <div className="mb-3 text-[15px] text-[#6B7280]">
              Mensualidad estimada
            </div>
            <div className="break-words text-[24px] font-semibold text-[#202430] sm:text-[26px]">
              {formatRecommendationMoney(recommendation.monthlyPrice)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-5 text-[24px] font-semibold text-[#202430] sm:text-[28px]">
          ¿Por qué esta recomendación?
        </h3>

        <div className="grid gap-4">
          {recommendation.rationale.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="rounded-3xl border border-[#E5E7EB] bg-white px-5 py-4 text-[16px] leading-7 break-words text-[#4B5563] sm:px-6 sm:py-5 sm:text-[17px] sm:leading-8"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-[24px] border border-[#FDE68A] bg-[#FFF8E7] p-5 sm:rounded-[28px] sm:p-8">
        <div className="mb-3 text-[15px] font-semibold text-[#B45309]">
          Análisis estratégico asistido por IA
        </div>

        <div className="whitespace-pre-line break-words text-[16px] leading-7 text-[#78350F] sm:text-[17px] sm:leading-8">
          {recommendation.strategicAnalysis}
        </div>
      </div>

      {recommendation.notes ? (
        <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] px-5 py-4 text-[15px] leading-7 break-words text-[#4B5563] sm:px-6 sm:py-5 sm:text-[16px] sm:leading-8">
          {recommendation.notes}
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
          onClick={onContinue}
          disabled={isSubmitting}
          className={`inline-flex h-14 w-full items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition sm:w-auto sm:min-w-[180px] ${
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