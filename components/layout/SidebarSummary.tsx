export default function SidebarSummary() {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-[#2B2F36]">
        Resumen del proyecto
      </h3>

      <div className="space-y-3 text-sm text-[#4A4F57]">
        <p>
          <span className="font-medium text-[#2B2F36]">Negocio:</span> Pendiente
        </p>
        <p>
          <span className="font-medium text-[#2B2F36]">Objetivo:</span> Pendiente
        </p>
        <p>
          <span className="font-medium text-[#2B2F36]">Paquete:</span> Pendiente
        </p>
      </div>
    </aside>
  );
}