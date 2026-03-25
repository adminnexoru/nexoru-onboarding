import { prisma } from "@/lib/prisma";
import { ApiRouteError } from "@/lib/api/errors";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  businessProfileRequestSchema,
  type BusinessProfileResponse,
} from "@/lib/contracts/onboarding";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = businessProfileRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
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
      include: {
        organization: true,
      },
    });

    if (!session) {
      throw new ApiRouteError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const organization = session.organizationId
        ? await tx.organization.update({
            where: {
              id: session.organizationId,
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
          })
        : await tx.organization.create({
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

      const savedBusinessProfile = await tx.onboardingBusinessProfile.upsert({
        where: {
          sessionId: session.id,
        },
        update: {
          legalName,
          commercialName,
          industry,
          country,
          city,
          websiteOrInstagram,
          whatsapp,
          operatingHours,
        },
        create: {
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

      const updatedSession = await tx.onboardingSession.update({
        where: {
          id: session.id,
        },
        data: {
          organizationId: organization.id,
          currentStep: "business-profile",
          status: "IN_PROGRESS",
        },
      });

      const response: BusinessProfileResponse = {
        businessProfile: {
          id: savedBusinessProfile.id,
          sessionId: savedBusinessProfile.sessionId,
          legalName: savedBusinessProfile.legalName ?? "",
          commercialName: savedBusinessProfile.commercialName ?? "",
          industry: savedBusinessProfile.industry ?? "",
          country: savedBusinessProfile.country ?? "",
          city: savedBusinessProfile.city ?? "",
          websiteOrInstagram:
            savedBusinessProfile.websiteOrInstagram ?? "",
          whatsapp: savedBusinessProfile.whatsapp ?? "",
          operatingHours: savedBusinessProfile.operatingHours ?? "",
          createdAt: savedBusinessProfile.createdAt,
          updatedAt: savedBusinessProfile.updatedAt,
        },
        session: {
          id: updatedSession.id,
          currentStep: updatedSession.currentStep,
          status: updatedSession.status,
          organizationId: updatedSession.organizationId ?? null,
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