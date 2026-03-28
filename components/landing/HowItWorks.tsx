export default function HowItWorks() {
  const steps = [
    {
      title: "Entendemos tu operación",
      text: "Analizamos tu flujo actual, tus puntos de fricción y tu objetivo comercial principal.",
    },
    {
      title: "Diseñamos la arquitectura",
      text: "Definimos la combinación correcta de agente, pagos, agenda, automatización y seguimiento.",
    },
    {
      title: "Implementamos el sistema",
      text: "Conectamos herramientas, lógica operativa y canal comercial para que el sistema funcione de verdad.",
    },
    {
      title: "Escalas con control",
      text: "Tu negocio gana estructura para operar mejor hoy y crecer después sin rehacer todo.",
    },
  ];

  return (
    <section id="como-funciona" className="bg-white/[0.02] py-12">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <div className="mb-14 max-w-[860px]">
          <h2 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[56px]">
            Plan de Acción. Construimos sistemas que automatizan la relación completa con el cliente
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[28px] border border-white/10 bg-[#0B0F17] p-7"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/10 text-lg font-semibold text-[#DDD6FE]">
                {index + 1}
              </div>

              <div className="text-2xl font-semibold text-white">
                {step.title}
              </div>

              <p className="mt-4 text-[16px] leading-7 text-white/65">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}