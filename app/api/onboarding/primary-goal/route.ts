import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  primaryGoalRequestSchema,
  type PrimaryGoalResponse,
} from "@/lib/contracts/onboarding";

function serializeDecimal(
  value: { toString(): string } | number | string | null | undefined
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = primaryGoalRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
    }

    const { sessionToken, primaryGoalCode } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
    });

    if (!session) {
      throw new ApiRouteError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    const primaryGoalOption = await prisma.goalOption.findFirst({
      where: {
        code: primaryGoalCode,
        optionType: "primary",
        isActive: true,
      },
    });

    if (!primaryGoalOption) {
      throw new ApiRouteError(
        "NOT_FOUND",
        "Primary goal option not found",
        404
      );
    }

    const recommendedPackage = await prisma.packageRecommendationRule.findFirst({
      where: {
        goalCode: primaryGoalCode,
      },
      include: {
        package: true,
      },
      orderBy: {
        priority: "asc",
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      const savedPrimaryGoal = await tx.onboardingPrimaryGoal.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          primaryGoalCode: primaryGoalOption.code,
          primaryGoalLabel: primaryGoalOption.name,
          primaryGoalDescription: primaryGoalOption.description ?? "",
        },
        create: {
          sessionId: session.id,
          primaryGoalCode: primaryGoalOption.code,
          primaryGoalLabel: primaryGoalOption.name,
          primaryGoalDescription: primaryGoalOption.description ?? "",
        },
      });

      await tx.onboardingSecondaryNeed.deleteMany({
        where: {
          sessionId: session.id,
        },
      });

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "IN_PROGRESS",
          currentStep: "primary-goal",
          recommendedPackageId: recommendedPackage?.packageId ?? null,
          setupPriceSnapshot: recommendedPackage?.package?.setupPrice ?? null,
          monthlyPriceSnapshot:
            recommendedPackage?.package?.monthlyPrice ?? null,
        },
      });

      const response: PrimaryGoalResponse = {
        primaryGoal: {
          id: savedPrimaryGoal.id,
          sessionId: savedPrimaryGoal.sessionId,
          primaryGoalCode: savedPrimaryGoal.primaryGoalCode,
          primaryGoalLabel: savedPrimaryGoal.primaryGoalLabel,
          primaryGoalDescription: savedPrimaryGoal.primaryGoalDescription ?? "",
          createdAt: savedPrimaryGoal.createdAt,
          updatedAt: savedPrimaryGoal.updatedAt,
        },
        recommendedPackage: recommendedPackage?.package
          ? {
              id: recommendedPackage.package.id,
              code: recommendedPackage.package.code,
              name: recommendedPackage.package.name,
              description: recommendedPackage.package.description ?? null,
              setupPrice: serializeDecimal(
                recommendedPackage.package.setupPrice
              ),
              monthlyPrice: serializeDecimal(
                recommendedPackage.package.monthlyPrice
              ),
            }
          : null,
        session: {
          id: updatedSession.id,
          currentStep: updatedSession.currentStep,
          status: updatedSession.status,
          recommendedPackageId: updatedSession.recommendedPackageId ?? null,
          setupPriceSnapshot: serializeDecimal(updatedSession.setupPriceSnapshot),
          monthlyPriceSnapshot: serializeDecimal(
            updatedSession.monthlyPriceSnapshot
          ),
          updatedAt: updatedSession.updatedAt,
        },
      };

      return response;
    });

    return apiOk(result);
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}