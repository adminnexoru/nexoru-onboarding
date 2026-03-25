import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  paymentRequestSchema,
  type PaymentResponse,
} from "@/lib/contracts/onboarding";

function buildPaymentReference(sessionId: string) {
  return `NXR-${sessionId}-${Date.now()}`;
}

function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function serializeMoney(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "0";
  return String(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = paymentRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
    }

    const { sessionToken } = parsed.data;

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
          orderBy: {
            createdAt: "asc",
          },
        },
        scopeConfirmation: true,
      },
    });

    if (!session) {
      throw new ApiRouteError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    if (!session.scopeConfirmation?.acceptedScope) {
      throw new ApiRouteError(
        "BAD_REQUEST",
        "Scope must be confirmed before payment",
        400
      );
    }

    if (!session.recommendedPackage) {
      throw new ApiRouteError(
        "RECOMMENDED_PACKAGE_NOT_FOUND",
        "Recommended package not found",
        404
      );
    }

    const packageSetup = decimalToNumber(
      session.setupPriceSnapshot ?? session.recommendedPackage.setupPrice
    );

    const selectedAddons = session.selectedAddons.map((item) => ({
      addonId: item.addon.id,
      code: item.addon.code,
      name: item.addon.name,
      setupPrice:
        item.addon.setupPrice === null || item.addon.setupPrice === undefined
          ? null
          : String(item.addon.setupPrice),
      monthlyPrice:
        item.addon.monthlyPrice === null || item.addon.monthlyPrice === undefined
          ? null
          : String(item.addon.monthlyPrice),
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

      const response: PaymentResponse = {
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
          packageSetup: serializeMoney(packageSetup),
          addonsSetupTotal: serializeMoney(addonsSetupTotal),
          totalSetupAmount: serializeMoney(totalSetupAmount),
        },
        selectedAddons,
      };

      return response;
    });

    return apiOk(result);
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}