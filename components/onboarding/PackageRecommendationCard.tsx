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
    <div className="rounded-[32px] border border-[#E5E7EB] bg-white px-12 py-12 shadow-sm">
      <span className="mb-6 inline-flex rounded-full bg-[#EEF2FF] px-5 py-3 text-sm font-medium text-[#4F46E5]">
        Recomendación preliminar
      </span>

      <h1 className="mb-4 text-[56px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#202430]">
        Este es el paquete recomendado para tu caso
      </h1>

      <p className="mb-10 max-w-5xl text-[20px] leading-9 text-[#4B5563]">
        Con base en la información de tu negocio, objetivo, proceso actual y
        volumen operativo, esta es la configuración Nexoru que mejor encaja en
        esta etapa.
      </p>

      <div className="mb-8 rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] p-8">
        <div className="mb-3 text-[15px] font-semibold text-[#4F46E5]">
          Paquete sugerido
        </div>

        <div className="mb-8 text-[34px] font-semibold leading-tight text-[#202430]">
          {recommendation.packageName}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <div className="mb-3 text-[15px] text-[#6B7280]">Setup estimado</div>
            <div className="text-[26px] font-semibold text-[#202430]">
              {formatRecommendationMoney(recommendation.setupPrice)}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <div className="mb-3 text-[15px] text-[#6B7280]">
              Mensualidad estimada
            </div>
            <div className="text-[26px] font-semibold text-[#202430]">
              {formatRecommendationMoney(recommendation.monthlyPrice)}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-5 text-[28px] font-semibold text-[#202430]">
          ¿Por qué esta recomendación?
        </h3>

        <div className="grid gap-4">
          {recommendation.rationale.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="rounded-3xl border border-[#E5E7EB] bg-white px-6 py-5 text-[17px] leading-8 text-[#4B5563]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-[28px] border border-[#FDE68A] bg-[#FFF8E7] p-8">
        <div className="mb-3 text-[15px] font-semibold text-[#B45309]">
          Análisis estratégico asistido por IA
        </div>

        <div className="whitespace-pre-line text-[17px] leading-8 text-[#78350F]">
          {recommendation.strategicAnalysis}
        </div>
      </div>

      {recommendation.notes ? (
        <div className="mb-8 rounded-[24px] border border-[#E5E7EB] bg-[#F8FAFC] px-6 py-5 text-[16px] leading-8 text-[#4B5563]">
          {recommendation.notes}
        </div>
      ) : null}

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
          className={`inline-flex h-14 min-w-[180px] items-center justify-center rounded-2xl px-8 text-[16px] font-semibold text-white transition ${
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