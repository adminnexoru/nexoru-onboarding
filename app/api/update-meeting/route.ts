import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const internalKey = request.headers.get("x-nexoru-internal-key");

    if (internalKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const meetingReference = String(body.meetingReference || "").trim();
    const manychatSubscriberId = String(body.manychatSubscriberId || "").trim();

    if (!meetingReference) {
      return NextResponse.json(
        { ok: false, error: "meetingReference es obligatorio" },
        { status: 400 }
      );
    }

    if (!manychatSubscriberId) {
      return NextResponse.json(
        { ok: false, error: "manychatSubscriberId es obligatorio" },
        { status: 400 }
      );
    }

    const meeting = await prisma.onboardingMeeting.findUnique({
      where: {
        meetingReference,
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { ok: false, error: "Sesión no encontrada" },
        { status: 404 }
      );
    }

    const updated = await prisma.onboardingMeeting.update({
      where: {
        meetingReference,
      },
      data: {
        manychatSubscriberId,
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        meetingReference: updated.meetingReference,
        manychatSubscriberId: updated.manychatSubscriberId,
      },
    });
  } catch (error) {
    console.error("update-meeting error", error);

    return NextResponse.json(
      { ok: false, error: "No fue posible actualizar la sesión" },
      { status: 500 }
    );
  }
}