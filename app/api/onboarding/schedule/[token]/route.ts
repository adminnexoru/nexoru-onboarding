import { prisma } from "@/lib/prisma";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { token } = await context.params;

    if (!token) {
      return apiError("INVALID_TOKEN", "Token inválido", 400);
    }

    const session = await prisma.onboardingSession.findUnique({
      where: { sessionToken: token },
      include: {
        businessProfile: true,
        primaryGoal: true,
        recommendedPackage: true,
        meeting: true,
      },
    });

    if (!session) {
      return apiError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    if (!session.meeting) {
      return apiError("MEETING_NOT_FOUND", "Meeting not found", 404);
    }

    return apiOk({
      meeting: {
        id: session.meeting.id,
        sessionId: session.meeting.sessionId,
        meetingReference: session.meeting.meetingReference,
        status: session.meeting.status,
        scheduledAt: session.meeting.scheduledAt,
        scheduledEndAt: session.meeting.scheduledEndAt,
        timezone: session.meeting.timezone,
        calendarEventId: session.meeting.calendarEventId,
        calendarHtmlLink: session.meeting.calendarHtmlLink,
        googleMeetLink: session.meeting.googleMeetLink,
        contactNameSnapshot: session.meeting.contactNameSnapshot,
        contactWhatsappSnapshot: session.meeting.contactWhatsappSnapshot,
        contactEmailSnapshot: session.meeting.contactEmailSnapshot,
        notes: session.meeting.notes,
        createdAt: session.meeting.createdAt,
        updatedAt: session.meeting.updatedAt,
      },
      session: {
        id: session.id,
        sessionToken: session.sessionToken,
        status: session.status,
        currentStep: session.currentStep,
      },
      summary: {
        businessName: session.businessProfile?.commercialName || "Pendiente",
        industry: session.businessProfile?.industry || "Pendiente",
        goal: session.primaryGoal?.primaryGoalLabel || "Pendiente",
        packageName: session.recommendedPackage?.name || "Pendiente",
      },
    });
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}