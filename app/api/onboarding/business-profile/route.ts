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

    const { sessionToken, businessProfile } = parsed.data;

    const session = await prisma.onboardingSession.findUnique({
      where: {
        sessionToken,
      },
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

    const result = await prisma.$transaction(async (tx) => {
      let organizationId = session.organizationId;

      if (organizationId) {
        await tx.organization.update({
          where: { id: organizationId },
          data: {
            legalName: businessProfile.legalName || null,
            commercialName: businessProfile.commercialName,
            industry: businessProfile.industry,
            country: businessProfile.country,
            city: businessProfile.city,
            websiteOrInstagram: businessProfile.websiteOrInstagram || null,
            whatsapp: businessProfile.whatsapp,
            operatingHours: businessProfile.operatingHours || null,
          },
        });
      } else {
        const createdOrganization = await tx.organization.create({
          data: {
            legalName: businessProfile.legalName || null,
            commercialName: businessProfile.commercialName,
            industry: businessProfile.industry,
            country: businessProfile.country,
            city: businessProfile.city,
            websiteOrInstagram: businessProfile.websiteOrInstagram || null,
            whatsapp: businessProfile.whatsapp,
            operatingHours: businessProfile.operatingHours || null,
          },
        });

        organizationId = createdOrganization.id;
      }

      const savedBusinessProfile = await tx.onboardingBusinessProfile.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          legalName: businessProfile.legalName || null,
          commercialName: businessProfile.commercialName,
          industry: businessProfile.industry,
          country: businessProfile.country,
          city: businessProfile.city,
          websiteOrInstagram: businessProfile.websiteOrInstagram || null,
          whatsapp: businessProfile.whatsapp,
          operatingHours: businessProfile.operatingHours || null,
        },
        create: {
          sessionId: session.id,
          legalName: businessProfile.legalName || null,
          commercialName: businessProfile.commercialName,
          industry: businessProfile.industry,
          country: businessProfile.country,
          city: businessProfile.city,
          websiteOrInstagram: businessProfile.websiteOrInstagram || null,
          whatsapp: businessProfile.whatsapp,
          operatingHours: businessProfile.operatingHours || null,
        },
      });

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          organizationId,
          currentStep: "business-profile",
          status: "IN_PROGRESS",
        },
        select: {
          id: true,
          sessionToken: true,
          status: true,
          currentStep: true,
          organizationId: true,
          updatedAt: true,
        },
      });

      return {
        businessProfile: savedBusinessProfile,
        session: updatedSession,
      };
    });

    return NextResponse.json(
      {
        ok: true,
        data: result,
      },
      { status: 200 }
    );
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