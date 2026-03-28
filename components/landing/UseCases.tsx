export default function UseCases() {
  const cases = [
    "Negocios que venden por WhatsApp",
    "Marcas con pagos y confirmación manual",
    "Operaciones con agenda o reservas",
    "Programas de loyalty y recompensas",
    "Equipos que quieren escalar sin perder control",
  ];

  return (
    <section id="casos" className="bg-white/[0.02] py-12">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-white md:text-[56px]">
              Diseñado para negocios que ya venden y necesitan operar mejor
            </h2>
          </div>

          <div className="grid gap-4">
            {cases.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-white/10 bg-[#0B0F17] px-6 py-5 text-[18px] font-medium text-white/85"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}