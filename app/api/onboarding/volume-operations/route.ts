import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  volumeOperationsRequestSchema,
  type VolumeOperationsResponse,
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

    const parsed = volumeOperationsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
    }

    const {
      sessionToken,
      monthlyConversations,
      monthlyTickets,
      monthlyBookings,
      averageTicketValue,
      teamSizeOperating,
      peakDemandNotes,
    } = parsed.data;

    const hasAtLeastOneVolume =
      monthlyConversations !== null ||
      monthlyTickets !== null ||
      monthlyBookings !== null;

    if (!hasAtLeastOneVolume) {
      return apiError(
        "VALIDATION_ERROR",
        "Debes capturar al menos un volumen mensual relevante.",
        400
      );
    }

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
    });

    if (!session) {
      throw new ApiRouteError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const savedVolumeOperations =
        await tx.onboardingVolumeOperations.upsert({
          where: {
            sessionId: session.id,
          },
          update: {
            monthlyConversations,
            monthlyTickets,
            monthlyBookings,
            averageTicketValue,
            teamSizeOperating,
            peakDemandNotes,
          },
          create: {
            sessionId: session.id,
            monthlyConversations,
            monthlyTickets,
            monthlyBookings,
            averageTicketValue,
            teamSizeOperating,
            peakDemandNotes,
          },
        });

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "IN_PROGRESS",
          currentStep: "volume-operations",
        },
      });

      const response: VolumeOperationsResponse = {
        volumeOperations: {
          id: savedVolumeOperations.id,
          sessionId: savedVolumeOperations.sessionId,
          monthlyConversations: savedVolumeOperations.monthlyConversations,
          monthlyTickets: savedVolumeOperations.monthlyTickets,
          monthlyBookings: savedVolumeOperations.monthlyBookings,
          averageTicketValue: serializeDecimal(
            savedVolumeOperations.averageTicketValue
          ),
          teamSizeOperating: savedVolumeOperations.teamSizeOperating,
          peakDemandNotes: savedVolumeOperations.peakDemandNotes ?? "",
          createdAt: savedVolumeOperations.createdAt,
          updatedAt: savedVolumeOperations.updatedAt,
        },
        session: {
          id: updatedSession.id,
          currentStep: updatedSession.currentStep,
          status: updatedSession.status,
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