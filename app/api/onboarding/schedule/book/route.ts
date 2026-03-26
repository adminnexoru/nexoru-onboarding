import { prisma } from "@/lib/prisma";
import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import {
  generateMeetingReference,
  getOnboardingTimezone,
} from "@/lib/services/onboarding-meeting";
import { createGoogleCalendarMeeting } from "@/lib/google/calendar";
import { z } from "zod";

const bookMeetingSchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  start: z.string().min(1, "La fecha/hora de inicio es obligatoria"),
  end: z.string().min(1, "La fecha/hora de fin es obligatoria"),
  timezone: z.string().min(1).default("America/Mexico_City"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const parsed = bookMeetingSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("INVALID_BODY", "Payload inválido", 400, {
        details: parsed.error.flatten(),
      });
    }

    const { sessionToken, start, end } = parsed.data;
    const timezone = getOnboardingTimezone();

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return apiError("INVALID_DATETIME", "Fecha/hora inválida", 400);
    }

    if (endDate <= startDate) {
      return apiError("INVALID_RANGE", "El rango de horario es inválido", 400);
    }

    const session = await prisma.onboardingSession.findUnique({
      where: { sessionToken },
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

    if (session.meeting && session.meeting.status === "SCHEDULED") {
      return apiError(
        "MEETING_ALREADY_EXISTS",
        "La sesión ya tiene una agenda activa",
        409
      );
    }

    const overlappingMeeting = await prisma.onboardingMeeting.findFirst({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lt: endDate },
        scheduledEndAt: { gt: startDate },
      },
      select: { id: true },
    });

    if (overlappingMeeting) {
      return apiError(
        "SLOT_NOT_AVAILABLE",
        "El horario seleccionado ya no está disponible",
        409
      );
    }

    let meetingReference = generateMeetingReference();
    let exists = await prisma.onboardingMeeting.findUnique({
      where: { meetingReference },
      select: { id: true },
    });

    while (exists) {
      meetingReference = generateMeetingReference();
      exists = await prisma.onboardingMeeting.findUnique({
        where: { meetingReference },
        select: { id: true },
      });
    }

    const businessName =
      session.businessProfile?.commercialName ||
      session.businessProfile?.legalName ||
      "Prospecto Nexoru";

    const industry = session.businessProfile?.industry || "No especificada";

    const contactNameSnapshot =
      session.businessProfile?.commercialName ||
      session.businessProfile?.legalName ||
      "Prospecto Nexoru";

    const contactWhatsappSnapshot = session.businessProfile?.whatsapp || "";

    // Por ahora el onboarding no captura email.
    // Dejamos el campo preparado para futuras fases.
    const contactEmailSnapshot: string | null = null;

    const notes = "Reserva creada desde onboarding Nexoru";

    const goal = session.primaryGoal?.primaryGoalLabel || "No especificado";
    const packageName = session.recommendedPackage?.name || "No especificado";

    const meetingTitle = `Sesión Nexoru — ${businessName}`;

    const meetingDescription = [
      `Referencia del caso: ${meetingReference}`,
      `Negocio: ${businessName}`,
      `Industria: ${industry}`,
      `Objetivo principal: ${goal}`,
      `Paquete recomendado: ${packageName}`,
      `Contacto: ${contactNameSnapshot || "No especificado"}`,
      `WhatsApp: ${contactWhatsappSnapshot || "No especificado"}`,
      notes,
    ].join("\n");

    let calendarResult: {
      eventId: string | null;
      htmlLink: string | null;
      meetLink: string | null;
    };

    try {
      calendarResult = await createGoogleCalendarMeeting({
        title: meetingTitle,
        description: meetingDescription,
        start,
        end,
        timezone,
        attendees: contactEmailSnapshot ? [contactEmailSnapshot] : [],
      });
    } catch (error) {
      console.error("SCHEDULE_BOOK_CALENDAR_ERROR", error);

      return apiError(
        "CALENDAR_BOOKING_FAILED",
        "No fue posible reservar la sesión en Google Calendar.",
        500
      );
    }

    const meeting = await prisma.onboardingMeeting.create({
      data: {
        sessionId: session.id,
        organizationId: session.organizationId ?? null,
        meetingReference,
        status: "SCHEDULED",
        scheduledAt: startDate,
        scheduledEndAt: endDate,
        timezone,
        calendarEventId: calendarResult.eventId,
        calendarHtmlLink: calendarResult.htmlLink,
        googleMeetLink: calendarResult.meetLink,
        contactNameSnapshot,
        contactWhatsappSnapshot,
        contactEmailSnapshot,
        notes,
      },
    });

    await prisma.onboardingSession.update({
      where: { id: session.id },
      data: {
        currentStep: "schedule-confirmation",
        status: "IN_PROGRESS",
      },
    });

    return apiOk({
      meeting: {
        id: meeting.id,
        sessionId: meeting.sessionId,
        meetingReference: meeting.meetingReference,
        status: meeting.status,
        scheduledAt: meeting.scheduledAt,
        scheduledEndAt: meeting.scheduledEndAt,
        timezone: meeting.timezone,
        calendarEventId: meeting.calendarEventId,
        calendarHtmlLink: meeting.calendarHtmlLink,
        googleMeetLink: meeting.googleMeetLink,
        contactNameSnapshot: meeting.contactNameSnapshot,
        contactWhatsappSnapshot: meeting.contactWhatsappSnapshot,
        contactEmailSnapshot: meeting.contactEmailSnapshot,
        notes: meeting.notes,
        createdAt: meeting.createdAt,
        updatedAt: meeting.updatedAt,
      },
    });
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}