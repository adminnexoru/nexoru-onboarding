import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(76,29,149,0.35),transparent_35%),radial-gradient(circle_at_right,rgba(37,99,235,0.18),transparent_30%)]" />
      <div className="mx-auto grid w-full max-w-[1280px] gap-14 px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative z-10">
          <h1 className="max-w-[760px] text-[44px] font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-[68px] lg:text-[74px]">
            Sistemas inteligentes que operan la relación entre tu negocio y tus clientes
          </h1>

          <p className="mt-8 max-w-[720px] text-[19px] leading-8 text-white/72 md:text-[22px] md:leading-9">
            Nexoru diseña agentes, automatizaciones y flujos operativos que convierten WhatsApp, pagos, agenda y seguimiento en una sola operación comercial automatizada.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="https://app.nexoru.ai/onboarding/start"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#7C3AED] px-7 text-base font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] transition hover:bg-[#6D28D9]"
            >
              Diseñar mi sistema
            </Link>

            <a
              href="#como-funciona"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Ver cómo funciona
            </a>
          </div>

          <div className="mt-12 grid max-w-[720px] grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/50">Canal principal</div>
              <div className="mt-2 text-lg font-semibold text-white">WhatsApp</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/50">Core operativo</div>
              <div className="mt-2 text-lg font-semibold text-white">Automatización</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-white/50">Resultado</div>
              <div className="mt-2 text-lg font-semibold text-white">Más control y conversión</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_0_60px_rgba(59,130,246,0.12)]">
            <div className="rounded-[28px] border border-white/10 bg-[#0A0D14] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/45">Sistema visual</div>
                  <div className="mt-1 text-xl font-semibold text-white">
                    Nexoru OS
                  </div>
                </div>
                <div className="rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/10 px-3 py-1 text-xs font-semibold text-[#67E8F9]">
                  Live system
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 p-5">
                  <div className="text-sm text-[#C4B5FD]">Agente comercial</div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    Responde, califica y vende por WhatsApp
                  </div>
                </div>

                <div className="rounded-2xl border border-[#38BDF8]/20 bg-[#0F172A] p-5">
                  <div className="text-sm text-[#7DD3FC]">Operación</div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    Agenda + pago + validación + seguimiento
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm text-white/50">Arquitectura</div>
                  <div className="mt-2 text-base leading-7 text-white/75">
                    WhatsApp + IA + pagos + agenda + CRM + automatización
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}