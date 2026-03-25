import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  currentProcessRequestSchema,
  type CurrentProcessResponse,
} from "@/lib/contracts/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = currentProcessRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
    }

    const {
      sessionToken,
      currentProcess,
      manualSteps,
      toolsUsed,
      painPoints,
    } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
    });

    if (!session) {
      throw new ApiRouteError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const savedCurrentProcess = await tx.onboardingCurrentProcess.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          currentProcess,
          manualSteps,
          toolsUsed,
          painPoints,
        },
        create: {
          sessionId: session.id,
          currentProcess,
          manualSteps,
          toolsUsed,
          painPoints,
        },
      });

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "IN_PROGRESS",
          currentStep: "current-process",
        },
      });

      const response: CurrentProcessResponse = {
        currentProcess: {
          id: savedCurrentProcess.id,
          sessionId: savedCurrentProcess.sessionId,
          currentProcess: savedCurrentProcess.currentProcess,
          manualSteps: savedCurrentProcess.manualSteps ?? "",
          toolsUsed: savedCurrentProcess.toolsUsed ?? "",
          painPoints: savedCurrentProcess.painPoints ?? "",
          createdAt: savedCurrentProcess.createdAt,
          updatedAt: savedCurrentProcess.updatedAt,
        },
        session: {
          id: updatedSession.id,
          currentStep: updatedSession.currentStep,
          status: updatedSession.status,
          updatedAt: updatedSession.updatedAt,
        },
      };

      return response;
    });

    return apiOk(result);
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}