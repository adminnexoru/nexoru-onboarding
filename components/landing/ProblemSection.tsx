export default function ProblemSection() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10">
      <div className="mb-14 max-w-[860px]">
        <h2 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[56px]">
          El problema que resolvemos. La mayoría de los negocios no necesitan más herramientas. Necesitan un sistema que opere solo.
        </h2>

        <p className="mt-6 max-w-[820px] text-[18px] leading-8 text-white/70 md:text-[20px] md:leading-9">
          Venden por WhatsApp, cobran en links externos, coordinan por mensajes, revisan agenda manualmente y pierden control cuando el volumen crece. Nexoru convierte esa fragmentación en una operación integrada.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-7">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#7DD3FC]">
            Antes
          </div>
          <div className="text-2xl font-semibold text-white">
            Conversaciones sin estructura
          </div>
          <p className="mt-4 text-[16px] leading-7 text-white/65">
            Leads, pedidos, pagos y seguimiento viven en lugares distintos y dependen de operación manual.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-7">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#A78BFA]">
            Fricción
          </div>
          <div className="text-2xl font-semibold text-white">
            Más volumen, más caos
          </div>
          <p className="mt-4 text-[16px] leading-7 text-white/65">
            Cuando crece la demanda, crecen también los errores, tiempos muertos, fugas comerciales y dependencia humana.
          </p>
        </div>

        <div className="rounded-[28px] border border-[#7C3AED]/20 bg-[linear-gradient(180deg,rgba(124,58,237,0.18),rgba(255,255,255,0.04))] p-7">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#DDD6FE]">
            Después
          </div>
          <div className="text-2xl font-semibold text-white">
            Un sistema que ejecuta
          </div>
          <p className="mt-4 text-[16px] leading-7 text-white/75">
            Nexoru diseña la lógica operativa que responde, vende, valida, agenda y da seguimiento con estructura real.
          </p>
        </div>
      </div>
    </section>
  );
}