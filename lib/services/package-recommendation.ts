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
  recommendationSource: "openai" | "fallback";
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

  if (volume.monthlyConversations !== null && volume.monthlyConversations !== undefined) {
    parts.push(`${volume.monthlyConversations} conversaciones mensuales`);
  }

  if (volume.monthlyTickets !== null && volume.monthlyTickets !== undefined) {
    parts.push(`${volume.monthlyTickets} tickets mensuales`);
  }

  if (volume.monthlyBookings !== null && volume.monthlyBookings !== undefined) {
    parts.push(`${volume.monthlyBookings} reservas mensuales`);
  }

  if (volume.teamSizeOperating !== null && volume.teamSizeOperating !== undefined) {
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

  rationale.push(`Tu objetivo principal actual es: ${goalLabel}.`);

  if (process) {
    rationale.push(`Proceso actual detectado: ${process}.`);
  }

  if (manualSteps) {
    rationale.push(`Hoy todavía existen pasos manuales relevantes: ${manualSteps}.`);
  }

  if (painPoints) {
    rationale.push(`También identificamos fricciones operativas: ${painPoints}.`);
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
  const businessName = session.businessProfile?.commercialName || "el negocio";
  const industry = session.businessProfile?.industry || "su industria";
  const goalLabel = session.primaryGoal?.primaryGoalLabel || "Pendiente";
  const process = clean(session.currentProcess?.currentProcess) || "No especificado";
  const manualSteps = clean(session.currentProcess?.manualSteps) || "No especificado";
  const toolsUsed = clean(session.currentProcess?.toolsUsed) || "No especificado";
  const painPoints = clean(session.currentProcess?.painPoints) || "No especificado";
  const volumeSummary = buildVolumeSummary(session);
  const packageName = session.recommendedPackage?.name || "Solución por definir";

  return [
    `Analizando el contexto de ${businessName} dentro de ${industry}, la prioridad declarada es "${goalLabel}". Esto indica que la recomendación no debe limitarse a una automatización genérica, sino alinearse con la necesidad operativa central del negocio.`,
    `Actualmente el proceso se describe como "${process}". Además, existen pasos manuales relevantes (${manualSteps}) y herramientas actuales (${toolsUsed}), lo que sugiere que parte del esfuerzo operativo todavía depende de intervención humana y coordinación manual.`,
    `Desde una perspectiva operativa, los principales puntos de fricción identificados son: ${painPoints}. Sumado al volumen observado (${volumeSummary}), existe evidencia suficiente para justificar una solución más estructurada y no únicamente una respuesta táctica.`,
    `Con base en esos factores, la mejor recomendación inicial es ${packageName}, porque permite atacar el núcleo del problema sin sobre-dimensionar la implementación en esta etapa. La lógica del paquete se alinea con el tipo de operación actual y con el nivel de madurez reportado.`,
    `Estratégicamente, esta recomendación debe entenderse como una base operativa escalable: primero ordena el flujo central del negocio, después permite ampliar alcance con add-ons o integraciones según crecimiento, complejidad y necesidad comercial real.`,
  ].join("\n\n");
}

function extractOpenAIOutputText(result: any): string {
  if (typeof result?.output_text === "string" && result.output_text.trim()) {
    return result.output_text.trim();
  }

  const output = result?.output;

  if (!Array.isArray(output)) return "";

  const texts: string[] = [];

  for (const item of output) {
    if (!Array.isArray(item?.content)) continue;

    for (const content of item.content) {
      if (
        content?.type === "output_text" &&
        typeof content?.text === "string" &&
        content.text.trim()
      ) {
        texts.push(content.text.trim());
      }
    }
  }

  return texts.join("\n").trim();
}

function safeParseOpenAIJson(outputText: string): {
  strategicAnalysis?: string;
  rationale?: string[];
  notes?: string;
} | null {
  const cleaned = outputText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstOpen = cleaned.indexOf("{");
    const lastClose = cleaned.lastIndexOf("}");

    if (firstOpen === -1 || lastClose === -1 || lastClose <= firstOpen) {
      return null;
    }

    try {
      return JSON.parse(cleaned.slice(firstOpen, lastClose + 1));
    } catch {
      return null;
    }
  }
}

async function tryEnhanceWithAI(
  session: SessionInput,
  fallback: PackageRecommendationData
): Promise<PackageRecommendationData> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log("OPENAI_RECOMMENDATION_FALLBACK: missing OPENAI_API_KEY");
    return fallback;
  }

  try {
    const prompt = `
Eres un consultor estratégico de Nexoru.
Debes analizar un onboarding y devolver JSON válido.

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
            content: [
              {
                type: "input_text",
                text: prompt,
              },
            ],
          },
        ],
        reasoning: {
          effort: "minimal",
        },
        max_output_tokens: 4000,
        text: {
          verbosity: "low",
          format: {
            type: "json_schema",
            name: "nexoru_package_recommendation",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                strategicAnalysis: {
                  type: "string",
                },
                rationale: {
                  type: "array",
                  minItems: 4,
                  maxItems: 6,
                  items: {
                    type: "string",
                  },
                },
                notes: {
                  type: "string",
                },
              },
              required: ["strategicAnalysis", "rationale", "notes"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.log("OPENAI_RECOMMENDATION_FALLBACK: non-ok response", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return fallback;
    }

    const result = await response.json();

    console.log("OPENAI_RESPONSE_STATUS", {
    status: result?.status,
    incompleteDetails: result?.incomplete_details,
    outputText: result?.output_text,
  });
    const outputText = extractOpenAIOutputText(result);

    if (!outputText) {
      console.log(
        "OPENAI_RECOMMENDATION_FALLBACK: empty output",
        JSON.stringify(result, null, 2)
      );
      return fallback;
    }

    const parsed = safeParseOpenAIJson(outputText);

    if (!parsed) {
      console.log("OPENAI_RECOMMENDATION_FALLBACK: invalid json", outputText);
      return fallback;
    }

    const strategicAnalysis = clean(parsed.strategicAnalysis);
    const rationale = Array.isArray(parsed.rationale)
      ? parsed.rationale
          .filter((item) => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const notes = clean(parsed.notes);

    if (!strategicAnalysis || rationale.length === 0 || !notes) {
      console.log("OPENAI_RECOMMENDATION_FALLBACK: incomplete parsed data", parsed);
      return fallback;
    }

    console.log("OPENAI_RECOMMENDATION_SUCCESS");

    return {
      ...fallback,
      strategicAnalysis,
      rationale,
      notes,
      recommendationSource: "openai",
    };
  } catch (error) {
    console.log("OPENAI_RECOMMENDATION_FALLBACK: exception", error);
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
    recommendationSource: "fallback",
  };

  return tryEnhanceWithAI(session, fallback);
}

export function formatRecommendationMoney(value?: string | null) {
  return formatCurrency(value);
}