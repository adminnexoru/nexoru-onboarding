import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import { sessionTokenParamsSchema } from "@/lib/validators/onboarding";
import type { SerializedOnboardingSession } from "@/lib/contracts/onboarding";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

function serializeDecimal(
  value: { toString(): string } | number | string | null | undefined
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

function serializeRequiredDecimal(
  value: { toString(): string } | number | string
): string {
  return String(value);
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const rawParams = await context.params;

    const parsedParams = sessionTokenParamsSchema.safeParse(rawParams);

    if (!parsedParams.success) {
      throw new ApiRouteError(
        "VALIDATION_ERROR",
        "Invalid session token",
        400,
        parsedParams.error.flatten()
      );
    }

    const { token } = parsedParams.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken: token,
      },
      include: {
        businessProfile: true,
        primaryGoal: true,
        secondaryNeeds: {
          orderBy: {
            createdAt: "asc",
          },
        },
        currentProcess: true,
        volumeOperations: true,
        selectedAddons: {
          include: {
            addon: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        scopeConfirmation: true,
        paymentAttempts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        recommendedPackage: {
          include: {
            includedItems: {
              orderBy: {
                sortOrder: "asc",
              },
            },
            excludedItems: {
              orderBy: {
                sortOrder: "asc",
              },
            },
            packageAddons: {
              include: {
                addon: true,
              },
              orderBy: {
                addon: {
                  name: "asc",
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new ApiRouteError("NOT_FOUND", "Session not found", 404);
    }

    const serializedSession: SerializedOnboardingSession = {
      id: session.id,
      sessionToken: session.sessionToken,
      status: session.status,
      currentStep: session.currentStep,
      organizationId: session.organizationId ?? null,
      recommendedPackageId: session.recommendedPackageId ?? null,
      setupPriceSnapshot: serializeDecimal(session.setupPriceSnapshot),
      monthlyPriceSnapshot: serializeDecimal(session.monthlyPriceSnapshot),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,

      businessProfile: session.businessProfile
        ? {
            id: session.businessProfile.id,
            sessionId: session.businessProfile.sessionId,
            legalName: session.businessProfile.legalName ?? "",
            commercialName: session.businessProfile.commercialName ?? "",
            industry: session.businessProfile.industry ?? "",
            country: session.businessProfile.country ?? "",
            city: session.businessProfile.city ?? "",
            websiteOrInstagram:
              session.businessProfile.websiteOrInstagram ?? "",
            whatsapp: session.businessProfile.whatsapp ?? "",
            operatingHours: session.businessProfile.operatingHours ?? "",
            createdAt: session.businessProfile.createdAt,
            updatedAt: session.businessProfile.updatedAt,
          }
        : null,

      primaryGoal: session.primaryGoal
        ? {
            id: session.primaryGoal.id,
            sessionId: session.primaryGoal.sessionId,
            primaryGoalCode: session.primaryGoal.primaryGoalCode,
            primaryGoalLabel: session.primaryGoal.primaryGoalLabel,
            primaryGoalDescription:
              session.primaryGoal.primaryGoalDescription ?? "",
            createdAt: session.primaryGoal.createdAt,
            updatedAt: session.primaryGoal.updatedAt,
          }
        : null,

      secondaryNeeds: session.secondaryNeeds.map((item) => ({
        id: item.id,
        sessionId: item.sessionId,
        needCode: item.needCode,
        needLabel: item.needLabel ?? "",
        createdAt: item.createdAt,
      })),

      currentProcess: session.currentProcess
        ? {
            id: session.currentProcess.id,
            sessionId: session.currentProcess.sessionId,
            currentProcess: session.currentProcess.currentProcess ?? "",
            manualSteps: session.currentProcess.manualSteps ?? "",
            toolsUsed: session.currentProcess.toolsUsed ?? "",
            painPoints: session.currentProcess.painPoints ?? "",
            createdAt: session.currentProcess.createdAt,
            updatedAt: session.currentProcess.updatedAt,
          }
        : null,

      volumeOperations: session.volumeOperations
        ? {
            id: session.volumeOperations.id,
            sessionId: session.volumeOperations.sessionId,
            monthlyConversations:
              session.volumeOperations.monthlyConversations ?? null,
            monthlyTickets: session.volumeOperations.monthlyTickets ?? null,
            monthlyBookings: session.volumeOperations.monthlyBookings ?? null,
            averageTicketValue: serializeDecimal(
              session.volumeOperations.averageTicketValue
            ),
            teamSizeOperating: session.volumeOperations.teamSizeOperating,
            peakDemandNotes: session.volumeOperations.peakDemandNotes ?? "",
            createdAt: session.volumeOperations.createdAt,
            updatedAt: session.volumeOperations.updatedAt,
          }
        : null,

      selectedAddons: session.selectedAddons.map((item) => ({
        id: item.id,
        sessionId: item.sessionId,
        addonId: item.addonId,
        createdAt: item.createdAt,
        addon: {
          id: item.addon.id,
          code: item.addon.code,
          name: item.addon.name,
          description: item.addon.description ?? "",
          setupPrice: serializeRequiredDecimal(item.addon.setupPrice),
          monthlyPrice: serializeRequiredDecimal(item.addon.monthlyPrice),
        },
      })),

      scopeConfirmation: session.scopeConfirmation
        ? {
            id: session.scopeConfirmation.id,
            sessionId: session.scopeConfirmation.sessionId,
            acceptedScope: session.scopeConfirmation.acceptedScope,
            confirmedAt: session.scopeConfirmation.confirmedAt,
          }
        : null,

      paymentAttempts: session.paymentAttempts.map((item) => ({
        id: item.id,
        sessionId: item.sessionId,
        provider: item.provider,
        status: item.status,
        setupAmount: serializeRequiredDecimal(item.setupAmount),
        paymentReference: item.paymentReference ?? null,
        paymentUrl: item.paymentUrl ?? null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),

      recommendedPackage: session.recommendedPackage
        ? {
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
            isActive: session.recommendedPackage.isActive,
            sortOrder: session.recommendedPackage.sortOrder,
            createdAt: session.recommendedPackage.createdAt,
            updatedAt: session.recommendedPackage.updatedAt,
            includedItems: session.recommendedPackage.includedItems.map(
              (item) => ({
                id: item.id,
                packageId: item.packageId,
                label: item.label,
                sortOrder: item.sortOrder,
              })
            ),
            excludedItems: session.recommendedPackage.excludedItems.map(
              (item) => ({
                id: item.id,
                packageId: item.packageId,
                label: item.label,
                sortOrder: item.sortOrder,
              })
            ),
            packageAddons: session.recommendedPackage.packageAddons.map(
              (item) => ({
                id: item.id,
                packageId: item.packageId,
                addonId: item.addonId,
                addon: {
                  id: item.addon.id,
                  code: item.addon.code,
                  name: item.addon.name,
                  description: item.addon.description ?? "",
                  setupPrice: serializeRequiredDecimal(item.addon.setupPrice),
                  monthlyPrice: serializeRequiredDecimal(item.addon.monthlyPrice),
                },
              })
            ),
          }
        : null,
    };

    return apiOk(serializedSession);
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}