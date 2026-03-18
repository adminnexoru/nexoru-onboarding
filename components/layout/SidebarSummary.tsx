type SidebarSummaryProps = {
  businessName?: string;
  industry?: string;
  goal?: string;
  packageName?: string;
};

export default function SidebarSummary({
  businessName,
  industry,
  goal,
  packageName,
}: SidebarSummaryProps) {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-[#2B2F36]">
        Resumen del proyecto
      </h3>

      <div className="space-y-3 text-sm text-[#4A4F57]">
        <p>
          <span className="font-medium text-[#2B2F36]">Negocio:</span>{" "}
          {businessName || "Pendiente"}
        </p>

        <p>
          <span className="font-medium text-[#2B2F36]">Industria:</span>{" "}
          {industry || "Pendiente"}
        </p>

        <p>
          <span className="font-medium text-[#2B2F36]">Objetivo:</span>{" "}
          {goal || "Pendiente"}
        </p>

        <p>
          <span className="font-medium text-[#2B2F36]">Paquete:</span>{" "}
          {packageName || "Pendiente"}
        </p>
      </div>
    </aside>
  );
}