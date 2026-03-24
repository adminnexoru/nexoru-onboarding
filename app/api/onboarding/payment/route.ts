import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PaymentAddon = {
  addonId: string;
  name: string;
  priceType: string;
  priceAmount: string | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const sessionToken = body?.sessionToken;

    if (!sessionToken || typeof sessionToken !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error: "Session token is required",
        },
        { status: 400 }
      );
    }

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
      include: {
        recommendedPackage: true,
        selectedAddons: {
          include: {
            addon: true,
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

    const setupAmountNumber =
      Number(session.setupPriceSnapshot ?? session.recommendedPackage.setupPrice ?? 0);

    const addonsForResponse: PaymentAddon[] = session.selectedAddons.map((item) => ({
      addonId: item.addon.id,
      name: item.addon.name,
      priceType: item.addon.priceType,
      priceAmount: item.addon.priceAmount ? String(item.addon.priceAmount) : null,
    }));

    const pricedAddonsTotal = session.selectedAddons.reduce((acc, item) => {
      if (item.addon.priceAmount) {
        return acc + Number(item.addon.priceAmount);
      }

      return acc;
    }, 0);

    const totalSetupAmount = setupAmountNumber + pricedAddonsTotal;

    const paymentReference = `NXR-${session.id}-${Date.now()}`;
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
        paymentAttempt,
        session: updatedSession,
      };
    });

    return NextResponse.json({
      ok: true,
      data: {
        paymentAttempt: {
          id: result.paymentAttempt.id,
          provider: result.paymentAttempt.provider,
          status: result.paymentAttempt.status,
          setupAmount: String(result.paymentAttempt.setupAmount),
          paymentReference: result.paymentAttempt.paymentReference,
          paymentUrl: result.paymentAttempt.paymentUrl,
          createdAt: result.paymentAttempt.createdAt,
        },
        session: {
          id: result.session.id,
          currentStep: result.session.currentStep,
          status: result.session.status,
        },
        addons: addonsForResponse,
      },
    });
  } catch (error) {
    console.error("POST /api/onboarding/payment error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}