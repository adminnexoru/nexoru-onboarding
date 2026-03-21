import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const primaryGoals = await prisma.goalOption.findMany({
      where: {
        optionType: "primary",
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        code: true,
        name: true,
        description: true,
      },
    });

    const secondaryNeeds = await prisma.goalOption.findMany({
      where: {
        optionType: "secondary",
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        code: true,
        name: true,
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        primaryGoals,
        secondaryNeeds,
      },
    });
  } catch (error) {
    console.error("CATALOG_ONBOARDING_OPTIONS_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        error: "No fue posible cargar el catálogo de onboarding",
      },
      { status: 500 }
    );
  }
}