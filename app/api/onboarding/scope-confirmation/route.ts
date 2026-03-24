import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ScopeConfirmationPayload = {
  sessionToken: string;
  acceptedScope: boolean;
  selectedAddonIds?: string[];
};

function serializeDecimal(value: unknown) {
  if (value === null || value === undefined) return null;
  return String(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as ScopeConfirmationPayload | null;

    if (!body) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    const sessionToken =
      typeof body.sessionToken === "string" ? body.sessionToken.trim() : "";

    const acceptedScope = body.acceptedScope === true;
    const selectedAddonIds = Array.isArray(body.selectedAddonIds)
      ? body.selectedAddonIds.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0
        )
      : [];

    if (!sessionToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "sessionToken is required",
        },
        { status: 400 }
      );
    }

    if (!acceptedScope) {
      return NextResponse.json(
        {
          ok: false,
          error: "Debes confirmar que entiendes el alcance para continuar.",
        },
        { status: 400 }
      );
    }

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
          error: "Recommended package not found",
        },
        { status: 400 }
      );
    }

    const allowedAddonIds = new Set(
      session.recommendedPackage.packageAddons.map((item) => item.addonId)
    );

    const validSelectedAddonIds = selectedAddonIds.filter((addonId) =>
      allowedAddonIds.has(addonId)
    );

    const result = await prisma.$transaction(async (tx) => {
      const scopeConfirmation = await tx.scopeConfirmation.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          acceptedScope: true,
          confirmedAt: new Date(),
        },
        create: {
          sessionId: session.id,
          acceptedScope: true,
        },
      });

      await tx.onboardingSelectedAddon.deleteMany({
        where: {
          sessionId: session.id,
        },
      });

      if (validSelectedAddonIds.length > 0) {
        await tx.onboardingSelectedAddon.createMany({
          data: validSelectedAddonIds.map((addonId) => ({
            sessionId: session.id,
            addonId,
          })),
          skipDuplicates: true,
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

      const selectedAddons = validSelectedAddonIds.length
        ? await tx.onboardingSelectedAddon.findMany({
            where: {
              sessionId: session.id,
            },
            include: {
              addon: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          })
        : [];

      return {
        scopeConfirmation: {
          id: scopeConfirmation.id,
          sessionId: scopeConfirmation.sessionId,
          acceptedScope: scopeConfirmation.acceptedScope,
          confirmedAt: scopeConfirmation.confirmedAt,
        },
        selectedAddons: selectedAddons.map((item) => ({
          id: item.id,
          sessionId: item.sessionId,
          addonId: item.addonId,
          createdAt: item.createdAt,
          addon: {
            id: item.addon.id,
            code: item.addon.code,
            name: item.addon.name,
            description: item.addon.description ?? "",
            setupPrice: serializeDecimal(item.addon.setupPrice),
            monthlyPrice: serializeDecimal(item.addon.monthlyPrice),
          },
        })),
        session: {
          id: updatedSession.id,
          currentStep: updatedSession.currentStep,
          status: updatedSession.status,
        },
      };
    });

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("SCOPE_CONFIRMATION POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}