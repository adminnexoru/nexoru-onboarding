import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "MISSING_GOOGLE_OAUTH_CONFIG",
          message: "Falta configuración OAuth de Google.",
        },
      },
      { status: 500 }
    );
  }

  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "MISSING_AUTH_CODE",
          message: "Google no devolvió code.",
        },
      },
      { status: 400 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const { tokens } = await oauth2Client.getToken(code);

  return NextResponse.json({
    ok: true,
    data: {
      accessToken: tokens.access_token ?? null,
      refreshToken: tokens.refresh_token ?? null,
      expiryDate: tokens.expiry_date ?? null,
      scope: tokens.scope ?? null,
      tokenType: tokens.token_type ?? null,
    },
  });
}