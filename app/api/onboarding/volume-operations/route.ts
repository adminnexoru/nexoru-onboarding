import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { volumeOperationsPayloadSchema } from "@/lib/validators/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = volumeOperationsPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
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
      return NextResponse.json(
        {
          ok: false,
          error:
            "Debes capturar al menos un volumen mensual relevante.",
        },
        { status: 400 }
      );
    }

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
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
            peakDemandNotes: peakDemandNotes ?? "",
          },
          create: {
            sessionId: session.id,
            monthlyConversations,
            monthlyTickets,
            monthlyBookings,
            averageTicketValue,
            teamSizeOperating,
            peakDemandNotes: peakDemandNotes ?? "",
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

      return {
        volumeOperations: savedVolumeOperations,
        session: updatedSession,
      };
    });

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/onboarding/volume-operations error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}