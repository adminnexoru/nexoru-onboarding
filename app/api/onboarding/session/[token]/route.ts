import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionTokenParamsSchema } from "@/lib/validators/onboarding";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const parsedParams = sessionTokenParamsSchema.safeParse(params);

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid token",
          details: parsedParams.error.flatten(),
        },
        { status: 400 }
      );
    }

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken: parsedParams.data.token,
      },
      include: {
        businessProfile: true,
        primaryGoal: true,
        secondaryNeeds: true,
        currentProcess: true,
        volumeOperations: true,
        scopeConfirmation: true,
        paymentAttempts: true,
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

    return NextResponse.json(
      {
        ok: true,
        data: session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/onboarding/session/[token] error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}