import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  packageRecommendationRequestSchema,
  packageRecommendationResponseSchema,
  type PackageRecommendationResponse,
} from "@/lib/contracts/onboarding";
import { generatePackageRecommendation } from "@/lib/services/package-recommendation";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = packageRecommendationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
    }

    const { sessionToken } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
      include: {
        businessProfile: true,
        primaryGoal: true,
        currentProcess: true,
        volumeOperations: true,
        recommendedPackage: true,
        packageRecommendation: true,
      },
    });

    if (!session) {
      throw new ApiRouteError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    if (!session.recommendedPackage) {
      throw new ApiRouteError(
        "RECOMMENDED_PACKAGE_NOT_FOUND",
        "Recommended package not found",
        404
      );
    }

    await prisma.onboardingSession.update({
      where: {
        id: session.id,
      },
      data: {
        currentStep: "package-recommendation",
        status: "IN_PROGRESS",
        recommendedPackageId: session.recommendedPackage.id,
        setupPriceSnapshot:
          session.setupPriceSnapshot ?? session.recommendedPackage.setupPrice,
        monthlyPriceSnapshot:
          session.monthlyPriceSnapshot ?? session.recommendedPackage.monthlyPrice,
      },
    });

    if (session.packageRecommendation) {
      console.log("PACKAGE_RECOMMENDATION_REHYDRATED", {
        sessionId: session.id,
      });

      const response = packageRecommendationResponseSchema.parse({
        packageCode: session.packageRecommendation.packageCode,
        packageName: session.packageRecommendation.packageName,
        packageDescription: session.packageRecommendation.packageDescription,
        setupPrice: session.packageRecommendation.setupPrice?.toString() ?? null,
        monthlyPrice:
          session.packageRecommendation.monthlyPrice?.toString() ?? null,
        rationale: session.packageRecommendation.rationale,
        strategicAnalysis: session.packageRecommendation.strategicAnalysis,
        notes: session.packageRecommendation.notes,
        recommendationSource: session.packageRecommendation.recommendationSource,
      });

      return apiOk(response);
    }

    const recommendation = await generatePackageRecommendation({
      businessProfile: session.businessProfile
        ? {
            commercialName: session.businessProfile.commercialName,
            industry: session.businessProfile.industry,
          }
        : null,
      primaryGoal: session.primaryGoal
        ? {
            primaryGoalCode: session.primaryGoal.primaryGoalCode,
            primaryGoalLabel: session.primaryGoal.primaryGoalLabel,
            primaryGoalDescription: session.primaryGoal.primaryGoalDescription,
          }
        : null,
      currentProcess: session.currentProcess
        ? {
            currentProcess: session.currentProcess.currentProcess,
            manualSteps: session.currentProcess.manualSteps,
            toolsUsed: session.currentProcess.toolsUsed,
            painPoints: session.currentProcess.painPoints,
          }
        : null,
      volumeOperations: session.volumeOperations
        ? {
            monthlyConversations: session.volumeOperations.monthlyConversations,
            monthlyTickets: session.volumeOperations.monthlyTickets,
            monthlyBookings: session.volumeOperations.monthlyBookings,
            averageTicketValue:
              session.volumeOperations.averageTicketValue?.toString() ?? null,
            teamSizeOperating: session.volumeOperations.teamSizeOperating,
            peakDemandNotes: session.volumeOperations.peakDemandNotes,
          }
        : null,
      recommendedPackage: session.recommendedPackage
        ? {
            code: session.recommendedPackage.code,
            name: session.recommendedPackage.name,
            description: session.recommendedPackage.description,
            setupPrice: session.recommendedPackage.setupPrice?.toString() ?? null,
            monthlyPrice:
              session.recommendedPackage.monthlyPrice?.toString() ?? null,
          }
        : null,
    });

    console.log("PACKAGE_RECOMMENDATION_RAW", JSON.stringify(recommendation, null, 2));

    let persisted;

    try {
      persisted = await prisma.onboardingPackageRecommendation.create({
        data: {
          sessionId: session.id,
          packageCode: recommendation.packageCode,
          packageName: recommendation.packageName,
          packageDescription: recommendation.packageDescription,
          setupPrice: recommendation.setupPrice,
          monthlyPrice: recommendation.monthlyPrice,
          rationale: recommendation.rationale,
          strategicAnalysis: recommendation.strategicAnalysis,
          notes: recommendation.notes,
          recommendationSource: recommendation.recommendationSource,
          inputTokens: recommendation.usage?.inputTokens ?? null,
          outputTokens: recommendation.usage?.outputTokens ?? null,
          totalTokens: recommendation.usage?.totalTokens ?? null,
        },
      });
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }

      // Another concurrent request for the same session already persisted a
      // recommendation first; rehydrate that one instead of generating twice.
      persisted = await prisma.onboardingPackageRecommendation.findUniqueOrThrow({
        where: { sessionId: session.id },
      });
    }

    const response = packageRecommendationResponseSchema.parse({
      packageCode: persisted.packageCode,
      packageName: persisted.packageName,
      packageDescription: persisted.packageDescription,
      setupPrice: persisted.setupPrice?.toString() ?? null,
      monthlyPrice: persisted.monthlyPrice?.toString() ?? null,
      rationale: persisted.rationale,
      strategicAnalysis: persisted.strategicAnalysis,
      notes: persisted.notes,
      recommendationSource: persisted.recommendationSource,
    });

    return apiOk(response);
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}