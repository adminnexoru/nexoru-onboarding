import "dotenv/config";
import { PrismaClient, AddonPriceType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL or DIRECT_URL");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(
  pool as unknown as ConstructorParameters<typeof PrismaPg>[0]
);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.goalOption.deleteMany();  
  await prisma.packageAddon.deleteMany();
  await prisma.packageIncludedItem.deleteMany();
  await prisma.packageExcludedItem.deleteMany();
  await prisma.packageRecommendationRule.deleteMany();
  await prisma.onboardingSelectedAddon.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.package.deleteMany();

  const base0 = await prisma.package.create({
    data: {
      code: "base0",
      name: "Nexoru Base 0",
      description: "Automatización básica de atención inicial",
      setupPrice: 7000,
      monthlyPrice: 2000,
      sortOrder: 1,
    },
  });

  const sales = await prisma.package.create({
    data: {
      code: "sales_os",
      name: "Nexoru Sales OS",
      description: "Automatización comercial",
      setupPrice: 28000,
      monthlyPrice: 9000,
      sortOrder: 2,
    },
  });

  const loyalty = await prisma.package.create({
    data: {
      code: "loyalty_os",
      name: "Nexoru Loyalty OS",
      description: "Programa de puntos",
      setupPrice: 72000,
      monthlyPrice: 18000,
      sortOrder: 3,
    },
  });

  const booking = await prisma.package.create({
    data: {
      code: "booking_os",
      name: "Nexoru Booking OS",
      description: "Reservas",
      setupPrice: 25000,
      monthlyPrice: 8000,
      sortOrder: 4,
    },
  });

  const addons = await Promise.all([
    prisma.addon.create({
      data: {
        code: "payments",
        name: "Pagos",
        priceType: AddonPriceType.CUSTOM,
      },
    }),
    prisma.addon.create({
      data: {
        code: "dashboard",
        name: "Dashboard",
        priceType: AddonPriceType.CUSTOM,
      },
    }),
    prisma.addon.create({
      data: {
        code: "agenda",
        name: "Agenda",
        priceType: AddonPriceType.CUSTOM,
      },
    }),
    prisma.addon.create({
      data: {
        code: "delivery",
        name: "Delivery",
        priceType: AddonPriceType.CUSTOM,
      },
    }),
    prisma.addon.create({
      data: {
        code: "campaigns",
        name: "Campañas",
        priceType: AddonPriceType.CUSTOM,
      },
    }),
  ]);

  await prisma.packageAddon.createMany({
    data: addons.map((addon) => ({
      packageId: sales.id,
      addonId: addon.id,
    })),
  });
await prisma.goalOption.deleteMany({});

await prisma.goalOption.createMany({
  data: [
    {
      code: "base0",
      name: "Responder mensajes automáticamente",
      description:
        "Automatizar respuestas básicas, FAQs y atención inicial sin procesos complejos.",
      optionType: "primary",
      sortOrder: 1,
      isActive: true,
    },
    {
      code: "sales",
      name: "Vender / cobrar por WhatsApp",
      description:
        "Capturar leads, responder con IA, generar pagos y automatizar seguimiento comercial.",
      optionType: "primary",
      sortOrder: 2,
      isActive: true,
    },
    {
      code: "loyalty",
      name: "Registrar tickets y puntos",
      description:
        "Implementar un sistema de loyalty con validación de tickets, puntos y redenciones.",
      optionType: "primary",
      sortOrder: 3,
      isActive: true,
    },
    {
      code: "booking",
      name: "Agendar reservas, cursos o citas",
      description:
        "Gestionar disponibilidad, reservas, recordatorios y confirmaciones automáticas.",
      optionType: "primary",
      sortOrder: 4,
      isActive: true,
    },
    {
      code: "other",
      name: "Otro",
      description:
        "Tengo una necesidad diferente y quiero que Nexoru me ayude a estructurarla.",
      optionType: "primary",
      sortOrder: 5,
      isActive: true,
    },
    {
      code: "agenda",
      name: "Agenda",
      description: "Gestión de agenda y calendarización.",
      optionType: "secondary",
      sortOrder: 101,
      isActive: true,
    },
    {
      code: "campaigns",
      name: "Campañas",
      description: "Automatización y seguimiento de campañas.",
      optionType: "secondary",
      sortOrder: 102,
      isActive: true,
    },
    {
      code: "dashboard",
      name: "Dashboard",
      description: "Visualización de métricas y reportes.",
      optionType: "secondary",
      sortOrder: 103,
      isActive: true,
    },
    {
      code: "delivery",
      name: "Delivery",
      description: "Seguimiento y coordinación de entregas.",
      optionType: "secondary",
      sortOrder: 104,
      isActive: true,
    },
    {
      code: "payments",
      name: "Pagos",
      description: "Cobros, confirmación y trazabilidad de pagos.",
      optionType: "secondary",
      sortOrder: 105,
      isActive: true,
    },
  ]
});

  await prisma.packageRecommendationRule.createMany({
    data: [
      { goalCode: "base0", packageId: base0.id, priority: 1 },
      { goalCode: "sales", packageId: sales.id, priority: 1 },
      { goalCode: "loyalty", packageId: loyalty.id, priority: 1 },
      { goalCode: "booking", packageId: booking.id, priority: 1 },
    ],
  });

  console.log("✅ Seed completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });