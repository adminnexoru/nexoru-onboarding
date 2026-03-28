export default function TrustBar() {
  return (
    <section className="border-y border-white/8 bg-white/[0.02]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-white/40">
          Diseñado para operaciones modernas
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-white/55 md:gap-10">
          <span>WhatsApp-first</span>
          <span>Automatización comercial</span>
          <span>Pagos integrados</span>
          <span>Agenda inteligente</span>
          <span>Operación escalable</span>
        </div>
      </div>
    </section>
  );
}