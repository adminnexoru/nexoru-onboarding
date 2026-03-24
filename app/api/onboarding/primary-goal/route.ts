import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { primaryGoalPayloadSchema } from "@/lib/validators/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = primaryGoalPayloadSchema.safeParse(body);

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

    const { sessionToken, primaryGoalCode } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: { sessionToken },
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

    const primaryGoalOption = await prisma.goalOption.findFirst({
      where: {
        code: primaryGoalCode,
        optionType: "primary",
        isActive: true,
      },
    });

    if (!primaryGoalOption) {
      return NextResponse.json(
        {
          ok: false,
          error: "Primary goal option not found",
        },
        { status: 404 }
      );
    }

    const recommendedPackage = await prisma.packageRecommendationRule.findFirst({
      where: {
        goalCode: primaryGoalCode,
      },
      include: {
        package: true,
      },
      orderBy: {
        priority: "asc",
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      const savedPrimaryGoal = await tx.onboardingPrimaryGoal.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          primaryGoalCode: primaryGoalOption.code,
          primaryGoalLabel: primaryGoalOption.name,
          primaryGoalDescription: primaryGoalOption.description,
        },
        create: {
          sessionId: session.id,
          primaryGoalCode: primaryGoalOption.code,
          primaryGoalLabel: primaryGoalOption.name,
          primaryGoalDescription: primaryGoalOption.description,
        },
      });

      await tx.onboardingSecondaryNeed.deleteMany({
        where: {
          sessionId: session.id,
        },
      });

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "IN_PROGRESS",
          currentStep: "primary-goal",
          recommendedPackageId: recommendedPackage?.packageId ?? null,
          setupPriceSnapshot: recommendedPackage?.package?.setupPrice ?? null,
          monthlyPriceSnapshot:
            recommendedPackage?.package?.monthlyPrice ?? null,
        },
      });

      return {
        primaryGoal: savedPrimaryGoal,
        recommendedPackage: recommendedPackage?.package
          ? {
              id: recommendedPackage.package.id,
              code: recommendedPackage.package.code,
              name: recommendedPackage.package.name,
              setupPrice: recommendedPackage.package.setupPrice,
              monthlyPrice: recommendedPackage.package.monthlyPrice,
            }
          : null,
        session: updatedSession,
      };
    });

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("PRIMARY_GOAL POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}