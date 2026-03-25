import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  packageRecommendationRequestSchema,
  type PackageRecommendationResponse,
} from "@/lib/contracts/onboarding";

function serializeRequiredDecimal(
  value: { toString(): string } | number | string
): string {
  return String(value);
}

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
        recommendedPackage: true,
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

    const updatedSession = await prisma.onboardingSession.update({
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

    const response: PackageRecommendationResponse = {
      recommendedPackage: {
        id: session.recommendedPackage.id,
        code: session.recommendedPackage.code,
        name: session.recommendedPackage.name,
        description: session.recommendedPackage.description ?? null,
        setupPrice: serializeRequiredDecimal(
          session.recommendedPackage.setupPrice
        ),
        monthlyPrice: serializeRequiredDecimal(
          session.recommendedPackage.monthlyPrice
        ),
      },
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

    return apiOk(response);
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}