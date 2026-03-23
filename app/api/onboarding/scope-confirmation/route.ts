import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const scopeConfirmationPayloadSchema = z.object({
  sessionToken: z.string().min(1, "Session token is required"),
  acceptedScope: z.literal(true),
  selectedAddonIds: z.array(z.string().min(1)).default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = scopeConfirmationPayloadSchema.safeParse(body);

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

    const { sessionToken, acceptedScope, selectedAddonIds } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
      include: {
        recommendedPackage: {
          include: {
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

    if (!session.recommendedPackage) {
      return NextResponse.json(
        {
          ok: false,
          error: "Recommended package not found for this session",
        },
        { status: 400 }
      );
    }

    const availableAddonIds = session.recommendedPackage.packageAddons.map(
      (item) => item.addonId
    );

    const invalidAddonIds = selectedAddonIds.filter(
      (addonId) => !availableAddonIds.includes(addonId)
    );

    if (invalidAddonIds.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "One or more selected addons are invalid for this package",
        },
        { status: 400 }
      );
    }

    const selectedAddons =
      selectedAddonIds.length > 0
        ? session.recommendedPackage.packageAddons
            .filter((item) => selectedAddonIds.includes(item.addonId))
            .map((item) => item.addon)
        : [];

    const result = await prisma.$transaction(async (tx) => {
      const savedScopeConfirmation = await tx.scopeConfirmation.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          acceptedScope,
          confirmedAt: new Date(),
        },
        create: {
          sessionId: session.id,
          acceptedScope,
          confirmedAt: new Date(),
        },
      });

      await tx.onboardingSelectedAddon.deleteMany({
        where: {
          sessionId: session.id,
        },
      });

      if (selectedAddonIds.length > 0) {
        await tx.onboardingSelectedAddon.createMany({
          data: selectedAddonIds.map((addonId) => ({
            sessionId: session.id,
            addonId,
          })),
        });
      }

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          currentStep: "scope-confirmation",
          status: "SCOPE_CONFIRMED",
        },
      });

      return {
        scopeConfirmation: savedScopeConfirmation,
        selectedAddons: selectedAddons.map((addon) => ({
          id: addon.id,
          code: addon.code,
          name: addon.name,
          description: addon.description ?? "",
          priceType: addon.priceType,
          priceAmount: addon.priceAmount ? String(addon.priceAmount) : null,
        })),
        session: updatedSession,
      };
    });

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/onboarding/scope-confirmation error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}