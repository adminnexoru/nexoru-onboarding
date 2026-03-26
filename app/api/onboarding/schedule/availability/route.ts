import { apiError, apiErrorFromUnknown, apiOk } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import { getOnboardingTimezone } from "@/lib/services/onboarding-meeting";
import { z } from "zod";

const availabilityQuerySchema = z.object({
  sessionToken: z.string().min(1, "La sesión es obligatoria"),
  date: z.string().min(1, "La fecha es obligatoria"),
});

type Slot = {
  start: string;
  end: string;
  label: string;
};

function buildDaySlots(date: string, timezone: string): Slot[] {
  // MVP: slots fijos cada 1 hora, duración 45 min
  // Luego en Fase 2 esto lo cambiaremos por Google Calendar real.
  const hours = [10, 11, 12, 13, 16, 17, 18];
  const slots: Slot[] = [];

  for (const hour of hours) {
    const start = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00-06:00`);
    const end = new Date(start.getTime() + 45 * 60 * 1000);

    slots.push({
      start: start.toISOString(),
      end: end.toISOString(),
      label: `${String(hour).padStart(2, "0")}:00`,
    });
  }

  return slots;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const parsed = availabilityQuerySchema.safeParse({
      sessionToken: searchParams.get("sessionToken"),
      date: searchParams.get("date"),
    });

    if (!parsed.success) {
      return apiError("INVALID_QUERY", "Query inválida", 400, {
        details: parsed.error.flatten(),
      });
    }

    const { sessionToken, date } = parsed.data;
    const timezone = getOnboardingTimezone();

    const session = await prisma.onboardingSession.findUnique({
      where: { sessionToken },
      select: { id: true },
    });

    if (!session) {
      return apiError("SESSION_NOT_FOUND", "Session not found", 404);
    }

    const allSlots = buildDaySlots(date, timezone);

    const existingMeetings = await prisma.onboardingMeeting.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          gte: new Date(`${date}T00:00:00-06:00`),
          lte: new Date(`${date}T23:59:59-06:00`),
        },
      },
      select: {
        scheduledAt: true,
        scheduledEndAt: true,
      },
    });

    const availableSlots = allSlots.filter((slot) => {
      const slotStart = new Date(slot.start).getTime();
      const slotEnd = new Date(slot.end).getTime();

      const overlaps = existingMeetings.some((meeting) => {
        const meetingStart = new Date(meeting.scheduledAt).getTime();
        const meetingEnd = new Date(meeting.scheduledEndAt).getTime();

        return slotStart < meetingEnd && slotEnd > meetingStart;
      });

      return !overlaps;
    });

    return apiOk({
      date,
      timezone,
      durationMinutes: 45,
      slots: availableSlots,
    });
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}