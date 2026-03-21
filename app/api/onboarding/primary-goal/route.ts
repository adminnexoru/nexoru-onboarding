import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { primaryGoalPayloadSchema } from "@/lib/validators/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    console.log("PRIMARY_GOAL raw body:", body);

    const parsed = primaryGoalPayloadSchema.safeParse(body);

    if (!parsed.success) {
      console.log("PRIMARY_GOAL validation error:", parsed.error.flatten());

      return NextResponse.json(
        {
          ok: false,
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { sessionToken, primaryGoalCode, secondaryNeedCodes } = parsed.data;

    console.log("PRIMARY_GOAL parsed sessionToken:", sessionToken);
    console.log("PRIMARY_GOAL parsed primaryGoalCode:", primaryGoalCode);
    console.log("PRIMARY_GOAL parsed secondaryNeedCodes:", secondaryNeedCodes);

    const session = await prisma.onboardingSession.findUnique({
      where: { sessionToken },
      include: {
        organization: true,
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

    const secondaryOptions =
      secondaryNeedCodes.length > 0
        ? await prisma.goalOption.findMany({
            where: {
                optionType: "secondary",
                isActive: true,
              code: {
                in: secondaryNeedCodes,
              },
            },
          })
        : [];

    console.log(
      "PRIMARY_GOAL secondaryOptions found:",
      secondaryOptions.map((item) => ({
        code: item.code,
        name: item.name,
      }))
    );

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

      if (secondaryOptions.length > 0) {
        const createManyResult = await tx.onboardingSecondaryNeed.createMany({
          data: secondaryOptions.map((item) => ({
            sessionId: session.id,
            needCode: item.code,
            needLabel: item.name,
          })),
        });

        console.log("PRIMARY_GOAL createMany result:", createManyResult);
      } else {
        console.log("PRIMARY_GOAL no secondary options to insert");
      }

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
        secondaryNeeds: secondaryOptions.map((item) => ({
          code: item.code,
          label: item.name,
        })),
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