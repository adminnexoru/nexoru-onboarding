import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const packageRecommendationPayloadSchema = z.object({
  sessionToken: z.string().min(1, "Session token is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = packageRecommendationPayloadSchema.safeParse(body);

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

    const { sessionToken } = parsed.data;

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

    const updatedSession = await prisma.onboardingSession.update({
      where: {
        id: session.id,
      },
      data: {
        currentStep: "package-recommendation",
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: updatedSession.id,
        currentStep: updatedSession.currentStep,
        status: updatedSession.status,
      },
    });
  } catch (error) {
    console.error("POST /api/onboarding/package-recommendation error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}