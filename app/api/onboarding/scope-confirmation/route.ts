import { prisma } from "@/lib/prisma";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import { ApiRouteError } from "@/lib/api/errors";
import {
  scopeConfirmationRequestSchema,
  type ScopeConfirmationResponse,
} from "@/lib/contracts/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = scopeConfirmationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
    }

    const { sessionToken, acceptedScope, selectedAddonIds } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
      include: {
        recommendedPackage: {
          include: {
            packageAddons: {
              include: {
                addon: true,
              },
            },
          },
        },
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

    const enabledAddonIds = new Set(
      session.recommendedPackage.packageAddons.map((item) => item.addonId)
    );

    const invalidAddonIds = selectedAddonIds.filter(
      (addonId) => !enabledAddonIds.has(addonId)
    );

    if (invalidAddonIds.length > 0) {
      return apiError(
        "INVALID_ADDONS",
        "Uno o más add-ons no pertenecen al paquete recomendado",
        400,
        {
          invalidAddonIds,
        }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const savedScopeConfirmation = await tx.scopeConfirmation.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          acceptedScope,
          confirmedAt: new Date(),
        },
        create: {
          sessionId: session.id,
          acceptedScope,
        },
      });

      await tx.onboardingSelectedAddon.deleteMany({
        where: {
          sessionId: session.id,
        },
      });

      if (selectedAddonIds.length > 0) {
        await tx.onboardingSelectedAddon.createMany({
          data: selectedAddonIds.map((addonId) => ({
            sessionId: session.id,
            addonId,
          })),
          skipDuplicates: true,
        });
      }

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          currentStep: "scope-confirmation",
          status: "SCOPE_CONFIRMED",
        },
      });

      const savedSelectedAddons = await tx.onboardingSelectedAddon.findMany({
        where: {
          sessionId: session.id,
        },
        include: {
          addon: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const response: ScopeConfirmationResponse = {
        scopeConfirmation: {
          id: savedScopeConfirmation.id,
          sessionId: savedScopeConfirmation.sessionId,
          acceptedScope: savedScopeConfirmation.acceptedScope,
          confirmedAt: savedScopeConfirmation.confirmedAt,
        },
        selectedAddons: savedSelectedAddons.map((item) => ({
          id: item.id,
          sessionId: item.sessionId,
          addonId: item.addonId,
          createdAt: item.createdAt,
          addon: {
            id: item.addon.id,
            code: item.addon.code,
            name: item.addon.name,
            description: item.addon.description ?? "",
            setupPrice: String(item.addon.setupPrice),
            monthlyPrice: String(item.addon.monthlyPrice),
          },
        })),
        session: {
          id: updatedSession.id,
          status: updatedSession.status,
          currentStep: updatedSession.currentStep,
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