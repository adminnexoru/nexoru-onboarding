import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessProfilePayloadSchema } from "@/lib/validators/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = businessProfilePayloadSchema.safeParse(body);

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

    const {
      sessionToken,
      legalName,
      commercialName,
      industry,
      country,
      city,
      websiteOrInstagram,
      whatsapp,
      operatingHours,
    } = parsed.data;

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

    const result = await prisma.$transaction(async (tx) => {
      let organizationId = session.organizationId;

      if (organizationId) {
        await tx.organization.update({
          where: { id: organizationId },
          data: {
            legalName,
            commercialName,
            industry,
            country,
            city,
            websiteOrInstagram,
            whatsapp,
            operatingHours,
          },
        });
      } else {
        const organization = await tx.organization.create({
          data: {
            legalName,
            commercialName,
            industry,
            country,
            city,
            websiteOrInstagram,
            whatsapp,
            operatingHours,
          },
        });

        organizationId = organization.id;
      }

      const existingBusinessProfile =
        await tx.onboardingBusinessProfile.findUnique({
          where: {
            sessionId: session.id,
          },
        });

      if (existingBusinessProfile) {
        await tx.onboardingBusinessProfile.update({
          where: {
            sessionId: session.id,
          },
          data: {
            legalName,
            commercialName,
            industry,
            country,
            city,
            websiteOrInstagram,
            whatsapp,
            operatingHours,
          },
        });
      } else {
        await tx.onboardingBusinessProfile.create({
          data: {
            sessionId: session.id,
            legalName,
            commercialName,
            industry,
            country,
            city,
            websiteOrInstagram,
            whatsapp,
            operatingHours,
          },
        });
      }

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          status: "IN_PROGRESS",
          currentStep: "business-profile",
          organizationId,
        },
      });

      return updatedSession;
    });

    return NextResponse.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/onboarding/business-profile error", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}