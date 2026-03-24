import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function buildPaymentReference(sessionId: string) {
  return `NXR-${sessionId}-${Date.now()}`;
}

function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const sessionToken = body?.sessionToken;

    if (!sessionToken || typeof sessionToken !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error: "sessionToken is required",
        },
        { status: 400 }
      );
    }

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
      include: {
        businessProfile: true,
        primaryGoal: true,
        recommendedPackage: true,
        selectedAddons: {
          include: {
            addon: true,
          },
        },
        scopeConfirmation: true,
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

    if (!session.scopeConfirmation?.acceptedScope) {
      return NextResponse.json(
        {
          ok: false,
          error: "Scope must be confirmed before payment",
        },
        { status: 400 }
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

    const packageSetup = decimalToNumber(
      session.setupPriceSnapshot ?? session.recommendedPackage.setupPrice
    );

    const selectedAddons = session.selectedAddons.map((item) => ({
      addonId: item.addon.id,
      code: item.addon.code,
      name: item.addon.name,
      setupPrice: item.addon.setupPrice ? String(item.addon.setupPrice) : null,
      monthlyPrice: item.addon.monthlyPrice
        ? String(item.addon.monthlyPrice)
        : null,
    }));

    const addonsSetupTotal = selectedAddons.reduce((sum, addon) => {
      return sum + decimalToNumber(addon.setupPrice);
    }, 0);

    const totalSetupAmount = packageSetup + addonsSetupTotal;

    const paymentReference = buildPaymentReference(session.id);
    const paymentUrl = `/onboarding/executive-summary?payment_ref=${paymentReference}`;

    const result = await prisma.$transaction(async (tx) => {
      const paymentAttempt = await tx.paymentAttempt.create({
        data: {
          sessionId: session.id,
          provider: "INTERNAL_MOCK",
          status: "INITIATED",
          setupAmount: totalSetupAmount,
          paymentReference,
          paymentUrl,
        },
      });

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          currentStep: "payment",
          status: "PAYMENT_INITIATED",
        },
      });

      return {
        paymentAttempt: {
          id: paymentAttempt.id,
          provider: paymentAttempt.provider,
          status: paymentAttempt.status,
          setupAmount: String(paymentAttempt.setupAmount),
          paymentReference: paymentAttempt.paymentReference,
          paymentUrl: paymentAttempt.paymentUrl,
          createdAt: paymentAttempt.createdAt,
        },
        session: {
          id: updatedSession.id,
          currentStep: updatedSession.currentStep,
          status: updatedSession.status,
        },
        pricing: {
          packageSetup: String(packageSetup),
          addonsSetupTotal: String(addonsSetupTotal),
          totalSetupAmount: String(totalSetupAmount),
        },
        selectedAddons,
      };
    });

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("PAYMENT POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}