type AppShellProps = {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  progress?: number;
  summary?: {
    businessName?: string;
    industry?: string;
    goal?: string;
    packageName?: string;
  };
};

export default function AppShell({
  children,
  step = 1,
  totalSteps = 5,
  progress = 10,
  summary,
}: AppShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F6F8",
        color: "#2B2F36",
      }}
    >
      <header
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "24px 40px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            NEXORU
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#4A4F57",
              marginTop: "4px",
            }}
          >
            Onboarding
          </div>
        </div>
      </header>

      <main
          style={{
          maxWidth: "1480px",
          margin: "0 auto",
          padding: "40px 48px 56px",
                  }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              fontSize: "14px",
              color: "#4A4F57",
            }}
          >
            <span>
              Paso {step} de {totalSteps}
            </span>
            <span>{progress}%</span>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#E5E7EB",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#3A3D91",
                borderRadius: "999px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 340px",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <section>{children}</section>

          <aside
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              position: "sticky",
              top: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              Resumen del proyecto
            </h3>

            <div
              style={{
                display: "grid",
                gap: "12px",
                fontSize: "15px",
                color: "#4A4F57",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#2B2F36" }}>Negocio:</strong>{" "}
                {summary?.businessName || "Pendiente"}
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#2B2F36" }}>Industria:</strong>{" "}
                {summary?.industry || "Pendiente"}
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#2B2F36" }}>Objetivo:</strong>{" "}
                {summary?.goal || "Pendiente"}
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#2B2F36" }}>Paquete:</strong>{" "}
                {summary?.packageName || "Pendiente"}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}