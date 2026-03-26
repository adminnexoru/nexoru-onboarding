import { google } from "googleapis";

export function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId) {
    throw new Error("Missing GOOGLE_OAUTH_CLIENT_ID");
  }

  if (!clientSecret) {
    throw new Error("Missing GOOGLE_OAUTH_CLIENT_SECRET");
  }

  if (!redirectUri) {
    throw new Error("Missing GOOGLE_OAUTH_REDIRECT_URI");
  }

  if (!refreshToken) {
    throw new Error("Missing GOOGLE_OAUTH_REFRESH_TOKEN");
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  auth.setCredentials({
    refresh_token: refreshToken,
  });

  return auth;
}

export function getGoogleCalendarClient() {
  const auth = getGoogleOAuthClient();

  return google.calendar({
    version: "v3",
    auth,
  });
}

type CreateGoogleCalendarMeetingInput = {
  title: string;
  description: string;
  start: string;
  end: string;
  timezone: string;
  attendees?: string[];
};

export async function createGoogleCalendarMeeting(
  input: CreateGoogleCalendarMeetingInput
) {
  const calendar = getGoogleCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: input.title,
      description: input.description,
      start: {
        dateTime: input.start,
        timeZone: input.timezone,
      },
      end: {
        dateTime: input.end,
        timeZone: input.timezone,
      },
      attendees:
        input.attendees?.map((email) => ({
          email,
        })) || [],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const event = response.data;

  return {
    eventId: event.id ?? null,
    htmlLink: event.htmlLink ?? null,
    meetLink:
      event.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === "video"
      )?.uri ?? null,
  };
}