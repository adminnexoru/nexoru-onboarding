import { beforeEach, describe, expect, it, vi } from "vitest";

const baseSession = {
  id: "session-1",
  sessionToken: "token-1",
  setupPriceSnapshot: null,
  monthlyPriceSnapshot: null,
  businessProfile: {
    commercialName: "Acme",
    industry: "Retail",
  },
  primaryGoal: {
    primaryGoalCode: "sales",
    primaryGoalLabel: "Vender más por WhatsApp",
    primaryGoalDescription: null,
  },
  currentProcess: null,
  volumeOperations: null,
  recommendedPackage: {
    id: "pkg-1",
    code: "sales-core",
    name: "Sales Core",
    description: "Paquete comercial base",
    setupPrice: "1000",
    monthlyPrice: "500",
  },
};

let storedRecommendation: Record<string, unknown> | null = null;

const onboardingSessionUpdate = vi.fn(async () => ({}));
const onboardingPackageRecommendationCreate = vi.fn(
  async ({ data }: { data: Record<string, unknown> }) => {
    storedRecommendation = { ...data };
    return storedRecommendation;
  }
);
const onboardingPackageRecommendationFindUniqueOrThrow = vi.fn(async () => {
  if (!storedRecommendation) {
    throw new Error("no stored recommendation");
  }
  return storedRecommendation;
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    onboardingSession: {
      findUnique: vi.fn(async () => ({
        ...baseSession,
        packageRecommendation: storedRecommendation,
      })),
      update: onboardingSessionUpdate,
    },
    onboardingPackageRecommendation: {
      create: onboardingPackageRecommendationCreate,
      findUniqueOrThrow: onboardingPackageRecommendationFindUniqueOrThrow,
    },
  },
}));

const fetchMock = vi.fn(async () => ({
  ok: true,
  json: async () => ({
    output_text: JSON.stringify({
      strategicAnalysis: "Párrafo uno.\n\nPárrafo dos.\n\nPárrafo tres.",
      rationale: ["Punto uno", "Punto dos", "Punto tres", "Punto cuatro"],
      notes: "Nota táctica breve.",
    }),
    usage: {
      input_tokens: 120,
      output_tokens: 80,
      total_tokens: 200,
    },
  }),
}));

function makeRequest() {
  return new Request("http://localhost/api/onboarding/package-recommendation", {
    method: "POST",
    body: JSON.stringify({ sessionToken: "token-1" }),
  });
}

describe("POST /api/onboarding/package-recommendation", () => {
  beforeEach(() => {
    storedRecommendation = null;
    fetchMock.mockClear();
    onboardingSessionUpdate.mockClear();
    onboardingPackageRecommendationCreate.mockClear();
    onboardingPackageRecommendationFindUniqueOrThrow.mockClear();
    vi.stubGlobal("fetch", fetchMock);
    process.env.OPENAI_API_KEY = "test-key";
  });

  it("generates the recommendation once per session and rehydrates on later visits without calling OpenAI again", async () => {
    const { POST } = await import("./route");

    const first = await POST(makeRequest());
    expect(first.status).toBe(200);

    const second = await POST(makeRequest());
    expect(second.status).toBe(200);

    // This is the assertion that must fail if the same session ever fires two
    // OpenAI calls: the recommendation is only generated once per session.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onboardingPackageRecommendationCreate).toHaveBeenCalledTimes(1);

    const firstBody = await first.json();
    const secondBody = await second.json();

    expect(secondBody.data).toEqual(firstBody.data);
    expect(secondBody.data.recommendationSource).toBe("openai");
  });

  it("persists token usage from the OpenAI call alongside the recommendation", async () => {
    const { POST } = await import("./route");

    await POST(makeRequest());

    expect(onboardingPackageRecommendationCreate).toHaveBeenCalledTimes(1);
    expect(onboardingPackageRecommendationCreate.mock.calls[0][0].data).toMatchObject({
      inputTokens: 120,
      outputTokens: 80,
      totalTokens: 200,
    });
  });
});
