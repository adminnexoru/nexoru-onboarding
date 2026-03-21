import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { createSessionToken } from "@/lib/onboarding-session";
import { createOnboardingSessionSchema } from "@/lib/validators/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = createOnboardingSessionSchema.safeParse(body);

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

    const sessionToken = createSessionToken();

    const session = await prisma.onboardingSession.create({
      data: {
        sessionToken,
        status: "STARTED",
        currentStep: "start",
      },
      select: {
        id: true,
        sessionToken: true,
        status: true,
        currentStep: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        data: session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/onboarding/session error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}