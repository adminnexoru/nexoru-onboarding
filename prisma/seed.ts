import "dotenv/config";
import { PrismaClient, AddonPriceType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

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
  await prisma.goalOption.deleteMany({});
  await prisma.packageAddon.deleteMany({});
  await prisma.packageIncludedItem.deleteMany({});
  await prisma.packageExcludedItem.deleteMany({});
  await prisma.packageRecommendationRule.deleteMany({});
  await prisma.onboardingSelectedAddon.deleteMany({});
  await prisma.addon.deleteMany({});
  await prisma.package.deleteMany({});

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
        description: "Cobros, confirmación y trazabilidad de pagos.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 4500,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "dashboard",
        name: "Dashboard",
        description: "Visualización de métricas y reportes.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 3500,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "agenda",
        name: "Agenda",
        description: "Gestión de agenda y calendarización.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 3000,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "delivery",
        name: "Delivery",
        description: "Seguimiento y coordinación de entregas.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 4000,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "campaigns",
        name: "Campañas",
        description: "Automatización y seguimiento de campañas.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 5000,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "reminders",
        name: "Recordatorios avanzados",
        description: "Recordatorios automáticos adicionales para reservas o citas.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 4500,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "location",
        name: "Ubicación",
        description: "Validación o captura de ubicación para operación o entrega.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 4500,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "shipping",
        name: "Envíos",
        description: "Soporte operativo para coordinación de envíos.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 4500,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "extra_automation",
        name: "Automatización adicional",
        description: "Capas adicionales de automatización fuera del flujo base.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 4500,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "database",
        name: "Base de datos",
        description: "Estructura adicional de base de datos para operación.",
        priceType: AddonPriceType.ONE_TIME,
        priceAmount: 4500,
        isActive: true,
      },
    }),
  ]);

  const addonMap = Object.fromEntries(addons.map((addon) => [addon.code, addon]));

  await prisma.packageIncludedItem.createMany({
    data: [
      {
        packageId: base0.id,
        label: "Automatización básica de respuestas",
        sortOrder: 1,
      },
      {
        packageId: base0.id,
        label: "Menú inicial de opciones",
        sortOrder: 2,
      },
      {
        packageId: base0.id,
        label: "Flujos básicos de atención",
        sortOrder: 3,
      },
      {
        packageId: base0.id,
        label: "Registro simple de leads o contactos",
        sortOrder: 4,
      },
      {
        packageId: base0.id,
        label: "Base operativa mínima para crecer después",
        sortOrder: 5,
      },

      {
        packageId: sales.id,
        label: "Automatización del flujo comercial principal",
        sortOrder: 1,
      },
      {
        packageId: sales.id,
        label: "Base estructurada para leads o clientes",
        sortOrder: 2,
      },
      {
        packageId: sales.id,
        label: "Seguimiento automatizado del proceso",
        sortOrder: 3,
      },
      {
        packageId: sales.id,
        label: "Configuración operativa inicial de ventas",
        sortOrder: 4,
      },
      {
        packageId: sales.id,
        label: "Lógica base para escalar a una operación comercial más robusta",
        sortOrder: 5,
      },

      {
        packageId: loyalty.id,
        label: "Flujo base de registro de usuarios",
        sortOrder: 1,
      },
      {
        packageId: loyalty.id,
        label: "Operación central del programa de loyalty",
        sortOrder: 2,
      },
      {
        packageId: loyalty.id,
        label: "Base de datos estructurada para puntos y actividad",
        sortOrder: 3,
      },
      {
        packageId: loyalty.id,
        label: "Redención base",
        sortOrder: 4,
      },
      {
        packageId: loyalty.id,
        label: "Lógica inicial de operación loyalty",
        sortOrder: 5,
      },

      {
        packageId: booking.id,
        label: "Flujo base de reservas o sesiones",
        sortOrder: 1,
      },
      {
        packageId: booking.id,
        label: "Control de disponibilidad inicial",
        sortOrder: 2,
      },
      {
        packageId: booking.id,
        label: "Registro estructurado de reservas",
        sortOrder: 3,
      },
      {
        packageId: booking.id,
        label: "Base operativa para confirmaciones",
        sortOrder: 4,
      },
      {
        packageId: booking.id,
        label: "Arquitectura inicial de booking",
        sortOrder: 5,
      },
    ],
  });

  await prisma.packageExcludedItem.createMany({
    data: [
      {
        packageId: base0.id,
        label: "IA conversacional avanzada",
        sortOrder: 1,
      },
      {
        packageId: base0.id,
        label: "Integraciones complejas",
        sortOrder: 2,
      },
      {
        packageId: base0.id,
        label: "Pagos automatizados",
        sortOrder: 3,
      },
      {
        packageId: base0.id,
        label: "Lógica de loyalty o booking",
        sortOrder: 4,
      },

      {
        packageId: sales.id,
        label: "ERP o integraciones empresariales complejas",
        sortOrder: 1,
      },
      {
        packageId: sales.id,
        label: "Personalizaciones fuera del flujo definido",
        sortOrder: 2,
      },
      {
        packageId: sales.id,
        label: "Campañas masivas avanzadas",
        sortOrder: 3,
      },
      {
        packageId: sales.id,
        label: "Desarrollos totalmente a medida fuera del catálogo",
        sortOrder: 4,
      },

      {
        packageId: loyalty.id,
        label: "Integración ERP",
        sortOrder: 1,
      },
      {
        packageId: loyalty.id,
        label: "Motor promocional complejo",
        sortOrder: 2,
      },
      {
        packageId: loyalty.id,
        label: "Campañas avanzadas",
        sortOrder: 3,
      },
      {
        packageId: loyalty.id,
        label: "Customizaciones fuera del diseño del sistema",
        sortOrder: 4,
      },

      {
        packageId: booking.id,
        label: "Integraciones enterprise",
        sortOrder: 1,
      },
      {
        packageId: booking.id,
        label: "Reglas avanzadas de pricing dinámico",
        sortOrder: 2,
      },
      {
        packageId: booking.id,
        label: "Marketplaces externos",
        sortOrder: 3,
      },
      {
        packageId: booking.id,
        label: "Desarrollos fuera del alcance estandarizado",
        sortOrder: 4,
      },
    ],
  });

  await prisma.packageAddon.createMany({
    data: [
      {
        packageId: base0.id,
        addonId: addonMap.database.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.dashboard.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.payments.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.campaigns.id,
      },

      {
        packageId: sales.id,
        addonId: addonMap.payments.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.dashboard.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.agenda.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.delivery.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.campaigns.id,
      },

      {
        packageId: loyalty.id,
        addonId: addonMap.dashboard.id,
      },
      {
        packageId: loyalty.id,
        addonId: addonMap.campaigns.id,
      },
      {
        packageId: loyalty.id,
        addonId: addonMap.payments.id,
      },
      {
        packageId: loyalty.id,
        addonId: addonMap.shipping.id,
      },
      {
        packageId: loyalty.id,
        addonId: addonMap.extra_automation.id,
      },

      {
        packageId: booking.id,
        addonId: addonMap.payments.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.reminders.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.dashboard.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.location.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.campaigns.id,
      },
    ],
    skipDuplicates: true,
  });

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
    ],
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