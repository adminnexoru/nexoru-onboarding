export default function SolutionsGrid() {
  const items = [
    {
      title: "WhatsApp Sales OS",
      text: "Vende, responde, cobra y da seguimiento desde una operación comercial automatizada.",
    },
    {
      title: "Loyalty OS",
      text: "Registra tickets, acumula puntos, valida reglas y activa recompensas con control operativo.",
    },
    {
      title: "Booking OS",
      text: "Automatiza disponibilidad, agenda, confirmación y coordinación de sesiones o servicios.",
    },
    {
      title: "Agentes de atención",
      text: "Resuelven preguntas, capturan datos y filtran conversaciones antes de escalar a humano.",
    },
    {
      title: "Pagos y validaciones",
      text: "Integra lógica de cobro, estados de pago y confirmaciones dentro del flujo comercial.",
    },
    {
      title: "Operación conectada",
      text: "Centraliza CRM, automatización, agenda y seguimiento en una arquitectura diseñada para crecer.",
    },
  ];

  return (
    <section id="soluciones" className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10">
      <div className="mb-14 max-w-[860px]">
        <h2 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[56px]">
          Nexoru no vende piezas sueltas. Diseña sistemas operativos por caso.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7 transition hover:border-[#7C3AED]/30 hover:bg-[linear-gradient(180deg,rgba(124,58,237,0.08),rgba(255,255,255,0.03))]"
          >
            <div className="text-2xl font-semibold text-white">{item.title}</div>
            <p className="mt-4 text-[16px] leading-7 text-white/65">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}