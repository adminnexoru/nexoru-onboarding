import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

function serializeDecimal(value: unknown) {
  if (value === null || value === undefined) return null;
  return String(value);
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { token } = await context.params;

    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          error: "Session token is required",
        },
        { status: 400 }
      );
    }

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
        scopeConfirmation: true,
        paymentAttempts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        recommendedPackage: {
          include: {
            includedItems: true,
            excludedItems: true,
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
      return NextResponse.json(
        {
          ok: false,
          error: "Session not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: session.id,
        sessionToken: session.sessionToken,
        status: session.status,
        currentStep: session.currentStep,
        organizationId: session.organizationId,
        recommendedPackageId: session.recommendedPackageId,
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
        scopeConfirmation: session.scopeConfirmation,
        paymentAttempts: session.paymentAttempts,

        recommendedPackage: session.recommendedPackage
          ? {
              id: session.recommendedPackage.id,
              code: session.recommendedPackage.code,
              name: session.recommendedPackage.name,
              description: session.recommendedPackage.description,
              setupPrice: serializeDecimal(
                session.recommendedPackage.setupPrice
              ),
              monthlyPrice: serializeDecimal(
                session.recommendedPackage.monthlyPrice
              ),
              isActive: session.recommendedPackage.isActive,
              sortOrder: session.recommendedPackage.sortOrder,
              createdAt: session.recommendedPackage.createdAt,
              updatedAt: session.recommendedPackage.updatedAt,
              includedItems: session.recommendedPackage.includedItems,
              excludedItems: session.recommendedPackage.excludedItems,
              packageAddons: session.recommendedPackage.packageAddons,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("GET /api/onboarding/session/[token] error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}