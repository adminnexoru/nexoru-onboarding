import Link from "next/link";

export default function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10">
      <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(124,58,237,0.16),rgba(255,255,255,0.03))] p-8 md:p-12">
        <div className="max-w-[860px]">
          <h2 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[56px]">
            El precio de cada sistema se define según tu operación, no con paquetes genéricos.
          </h2>

          <p className="mt-6 max-w-[760px] text-[18px] leading-8 text-white/72 md:text-[20px] md:leading-9">
            Primero entendemos tu caso, después diseñamos la arquitectura correcta y te mostramos la recomendación exacta con alcance, inversión y siguiente paso comercial.
          </p>
        </div>
      </div>
    </section>
  );
}