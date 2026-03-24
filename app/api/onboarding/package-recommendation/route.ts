import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  packageRecommendationPayloadSchema,
} from "@/lib/validators/onboarding";
import { generatePackageRecommendation } from "@/lib/services/package-recommendation";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.nextUrl.searchParams.get("sessionToken") ?? "";

    if (!sessionToken) {
      return NextResponse.json(
        {
          ok: false,
          error: "La sesión es obligatoria",
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
        currentProcess: true,
        volumeOperations: true,
        recommendedPackage: true,
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

    const recommendation = await generatePackageRecommendation({
      businessProfile: session.businessProfile,
      primaryGoal: session.primaryGoal,
      currentProcess: session.currentProcess,
      volumeOperations: session.volumeOperations
        ? {
            monthlyConversations:
              session.volumeOperations.monthlyConversations ?? null,
            monthlyTickets: session.volumeOperations.monthlyTickets ?? null,
            monthlyBookings: session.volumeOperations.monthlyBookings ?? null,
            averageTicketValue: session.volumeOperations.averageTicketValue
              ? String(session.volumeOperations.averageTicketValue)
              : null,
            teamSizeOperating: session.volumeOperations.teamSizeOperating ?? null,
            peakDemandNotes: session.volumeOperations.peakDemandNotes ?? "",
          }
        : null,
      recommendedPackage: session.recommendedPackage
        ? {
            code: session.recommendedPackage.code,
            name: session.recommendedPackage.name,
            description: session.recommendedPackage.description,
            setupPrice: String(session.recommendedPackage.setupPrice),
            monthlyPrice: String(session.recommendedPackage.monthlyPrice),
          }
        : null,
    });

    return NextResponse.json({
      ok: true,
      data: recommendation,
    });
  } catch (error) {
    console.error("PACKAGE_RECOMMENDATION GET error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = packageRecommendationPayloadSchema.safeParse(body);

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

    const { sessionToken } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
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

    const updatedSession = await prisma.onboardingSession.update({
      where: {
        id: session.id,
      },
      data: {
        currentStep: "package-recommendation",
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        sessionId: updatedSession.id,
        currentStep: updatedSession.currentStep,
        status: updatedSession.status,
      },
    });
  } catch (error) {
    console.error("PACKAGE_RECOMMENDATION POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}