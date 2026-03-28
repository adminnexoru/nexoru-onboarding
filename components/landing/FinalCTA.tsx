import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10">
      <div className="rounded-[36px] border border-white/10 bg-[#0B0F17] p-8 text-center md:p-14">
        <div className="mx-auto max-w-[860px]">
          <h2 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[56px]">
            Diseña el sistema que tu operación realmente necesita
          </h2>

          <p className="mt-6 text-[18px] leading-8 text-white/72 md:text-[20px] md:leading-9">
            Completa el onboarding y recibe una recomendación inicial de arquitectura Nexoru para tu negocio.
          </p>

          <div className="mt-10">
            <Link
              href="https://app.nexoru.ai/onboarding/start"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#7C3AED] px-8 text-base font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9]"
            >
              Iniciar onboarding
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}