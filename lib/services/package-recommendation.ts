type SessionInput = {
  businessProfile: {
    commercialName?: string | null;
    industry?: string | null;
  } | null;
  primaryGoal: {
    primaryGoalCode: string;
    primaryGoalLabel: string;
    primaryGoalDescription?: string | null;
  } | null;
  currentProcess: {
    currentProcess?: string | null;
    manualSteps?: string | null;
    toolsUsed?: string | null;
    painPoints?: string | null;
  } | null;
  volumeOperations: {
    monthlyConversations?: number | null;
    monthlyTickets?: number | null;
    monthlyBookings?: number | null;
    averageTicketValue?: string | null;
    teamSizeOperating?: number | null;
    peakDemandNotes?: string | null;
  } | null;
  recommendedPackage: {
    code: string;
    name: string;
    description?: string | null;
    setupPrice?: string | null;
    monthlyPrice?: string | null;
  } | null;
};

export type PackageRecommendationData = {
  packageCode: string | null;
  packageName: string;
  packageDescription: string;
  setupPrice: string | null;
  monthlyPrice: string | null;
  rationale: string[];
  strategicAnalysis: string;
  notes: string;
};

function clean(value?: string | null) {
  return value?.trim() ?? "";
}

function formatCurrency(value?: string | null) {
  if (!value) return "A definir";

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "A definir";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildVolumeSummary(session: SessionInput) {
  const volume = session.volumeOperations;

  if (!volume) {
    return "Todavía no hay datos de volumen operativo suficientes.";
  }

  const parts: string[] = [];

  if (volume.monthlyConversations) {
    parts.push(`${volume.monthlyConversations} conversaciones mensuales`);
  }

  if (volume.monthlyTickets) {
    parts.push(`${volume.monthlyTickets} tickets mensuales`);
  }

  if (volume.monthlyBookings) {
    parts.push(`${volume.monthlyBookings} reservas mensuales`);
  }

  if (volume.teamSizeOperating) {
    parts.push(`${volume.teamSizeOperating} personas operando hoy`);
  }

  if (parts.length === 0) {
    return "Todavía no hay datos de volumen operativo suficientes.";
  }

  return parts.join(", ");
}

function buildRationale(session: SessionInput): string[] {
  const goal = session.primaryGoal?.primaryGoalCode ?? "";
  const goalLabel = session.primaryGoal?.primaryGoalLabel ?? "Pendiente";
  const process = clean(session.currentProcess?.currentProcess);
  const manualSteps = clean(session.currentProcess?.manualSteps);
  const painPoints = clean(session.currentProcess?.painPoints);
  const volumeSummary = buildVolumeSummary(session);

  const rationale: string[] = [];

  rationale.push(
    `Tu objetivo principal actual es: ${goalLabel}.`
  );

  if (process) {
    rationale.push(`Proceso actual detectado: ${process}.`);
  }

  if (manualSteps) {
    rationale.push(
      `Hoy todavía existen pasos manuales relevantes: ${manualSteps}.`
    );
  }

  if (painPoints) {
    rationale.push(
      `También identificamos fricciones operativas: ${painPoints}.`
    );
  }

  rationale.push(
    `El volumen capturado (${volumeSummary}) confirma que ya existe una operación real que vale la pena estructurar.`
  );

  switch (goal) {
    case "base0":
      rationale.push(
        "La necesidad está centrada en atención inicial y respuestas básicas, no en una operación comercial, loyalty o de reservas como núcleo."
      );
      break;
    case "sales":
      rationale.push(
        "La operación requiere una base comercial estructurada para responder, dar seguimiento y convertir conversaciones en ventas por WhatsApp."
      );
      break;
    case "loyalty":
      rationale.push(
        "El caso exige lógica de registro, validación y recompensas, por lo que se justifica una solución orientada a loyalty y no a atención básica."
      );
      break;
    case "booking":
      rationale.push(
        "La lógica principal depende de disponibilidad, confirmación y calendarización, por lo que una arquitectura de booking es la mejor base inicial."
      );
      break;
    default:
      rationale.push(
        "El caso no cae claramente en un paquete estándar y requiere definición adicional antes de cerrar alcance."
      );
      break;
  }

  return rationale.slice(0, 6);
}

function buildFallbackStrategicAnalysis(session: SessionInput): string {
  const businessName =
    session.businessProfile?.commercialName || "el negocio";
  const industry = session.businessProfile?.industry || "su industria";
  const goalLabel = session.primaryGoal?.primaryGoalLabel || "Pendiente";
  const process = clean(session.currentProcess?.currentProcess) || "No especificado";
  const manualSteps = clean(session.currentProcess?.manualSteps) || "No especificado";
  const toolsUsed = clean(session.currentProcess?.toolsUsed) || "No especificado";
  const painPoints = clean(session.currentProcess?.painPoints) || "No especificado";
  const volumeSummary = buildVolumeSummary(session);
  const packageName =
    session.recommendedPackage?.name || "Solución por definir";

  return [
    `Analizando el contexto de ${businessName} dentro de ${industry}, la prioridad declarada es "${goalLabel}". Esto indica que la recomendación no debe limitarse a una automatización genérica, sino alinearse con la necesidad operativa central del negocio.`,
    `Actualmente el proceso se describe como "${process}". Además, existen pasos manuales relevantes (${manualSteps}) y herramientas actuales (${toolsUsed}), lo que sugiere que parte del esfuerzo operativo todavía depende de intervención humana y coordinación manual.`,
    `Desde una perspectiva operativa, los principales puntos de fricción identificados son: ${painPoints}. Sumado al volumen observado (${volumeSummary}), existe evidencia suficiente para justificar una solución más estructurada y no únicamente una respuesta táctica.`,
    `Con base en esos factores, la mejor recomendación inicial es ${packageName}, porque permite atacar el núcleo del problema sin sobre-dimensionar la implementación en esta etapa. La lógica del paquete se alinea con el tipo de operación actual y con el nivel de madurez reportado.`,
    `Estratégicamente, esta recomendación debe entenderse como una base operativa escalable: primero ordena el flujo central del negocio, después permite ampliar alcance con add-ons o integraciones según crecimiento, complejidad y necesidad comercial real.`
  ].join("\n\n");
}

async function tryEnhanceWithAI(
  session: SessionInput,
  fallback: PackageRecommendationData
): Promise<PackageRecommendationData> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = `
Eres un consultor estratégico de Nexoru.
Debes analizar un onboarding y devolver JSON válido.

Devuelve exactamente este formato:
{
  "strategicAnalysis": "string",
  "rationale": ["string", "string", "string", "string", "string"],
  "notes": "string"
}

Reglas:
- Escribe en español.
- El análisis debe ser ejecutivo, estratégico y aterrizado.
- No inventes datos.
- No uses markdown.
- strategicAnalysis debe tener entre 3 y 5 párrafos.
- rationale debe tener entre 4 y 6 bullets cortos.
- notes debe ser una observación táctica breve.

Datos del caso:
${JSON.stringify(session, null, 2)}
    `.trim();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallback;
    }

    const result = await response.json();
    const outputText =
      typeof result?.output_text === "string" ? result.output_text : "";

    if (!outputText) {
      return fallback;
    }

    const parsed = JSON.parse(outputText) as {
      strategicAnalysis?: string;
      rationale?: string[];
      notes?: string;
    };

    return {
      ...fallback,
      strategicAnalysis:
        parsed.strategicAnalysis?.trim() || fallback.strategicAnalysis,
      rationale:
        Array.isArray(parsed.rationale) && parsed.rationale.length > 0
          ? parsed.rationale
          : fallback.rationale,
      notes: parsed.notes?.trim() || fallback.notes,
    };
  } catch {
    return fallback;
  }
}

export async function generatePackageRecommendation(
  session: SessionInput
): Promise<PackageRecommendationData> {
  const packageName =
    session.recommendedPackage?.name ||
    (session.primaryGoal?.primaryGoalCode === "other"
      ? "Solución por definir"
      : "Pendiente");

  const packageCode = session.recommendedPackage?.code ?? null;
  const setupPrice = session.recommendedPackage?.setupPrice ?? null;
  const monthlyPrice = session.recommendedPackage?.monthlyPrice ?? null;
  const packageDescription =
    session.recommendedPackage?.description ||
    "Recomendación preliminar construida con base en la operación actual.";

  const fallback: PackageRecommendationData = {
    packageCode,
    packageName,
    packageDescription,
    setupPrice,
    monthlyPrice,
    rationale: buildRationale(session),
    strategicAnalysis: buildFallbackStrategicAnalysis(session),
    notes:
      session.primaryGoal?.primaryGoalCode === "other"
        ? "Este caso requiere discovery adicional antes de confirmar paquete, alcance y pricing final."
        : "Esta recomendación organiza la primera fase de implementación y puede ampliarse después con add-ons o mayor complejidad operativa.",
  };

  return tryEnhanceWithAI(session, fallback);
}

export function formatRecommendationMoney(value?: string | null) {
  return formatCurrency(value);
}