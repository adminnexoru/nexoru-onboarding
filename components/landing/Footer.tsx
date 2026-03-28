export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#05060A]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[1fr_auto_auto]">
        <div>
          <div className="text-xl font-semibold tracking-[0.18em] text-white">
            NEXORU
          </div>
          <p className="mt-4 max-w-[360px] text-[15px] leading-7 text-white/55">
            Sistemas inteligentes que automatizan la relación entre tu negocio y tus clientes.
          </p>
        </div>

        <div className="grid gap-3 text-[15px] text-white/60">
          <a href="#soluciones" className="transition hover:text-white">
            Soluciones
          </a>
          <a href="#como-funciona" className="transition hover:text-white">
            Cómo funciona
          </a>
          <a href="#casos" className="transition hover:text-white">
            Casos de uso
          </a>
        </div>

        <div className="grid gap-3 text-[15px] text-white/60">
          <a href="https://app.nexoru.ai/onboarding/start" target="_blank" className="transition hover:text-white">
            Iniciar onboarding
          </a>
          <span>admin@nexoru.ai</span>
        </div>
      </div>
    </footer>
  );
}