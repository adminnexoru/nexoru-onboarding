import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentProcessPayloadSchema } from "@/lib/validators/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = currentProcessPayloadSchema.safeParse(body);

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
      currentProcess,
      manualSteps,
      toolsUsed,
      painPoints,
    } = parsed.data;

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
      const savedCurrentProcess = await tx.onboardingCurrentProcess.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          currentProcess,
          manualSteps: manualSteps || "",
          toolsUsed: toolsUsed || "",
          painPoints: painPoints || "",
        },
        create: {
          sessionId: session.id,
          currentProcess,
          manualSteps: manualSteps || "",
          toolsUsed: toolsUsed || "",
          painPoints: painPoints || "",
        },
      });

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "IN_PROGRESS",
          currentStep: "current-process",
        },
      });

      return {
        currentProcess: savedCurrentProcess,
        session: updatedSession,
      };
    });

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/onboarding/current-process error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}