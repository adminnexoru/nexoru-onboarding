import "dotenv/config";
import { PrismaClient } from "@prisma/client";
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
  console.log("🌱 Seeding catalog V2...");

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
      name: "Nexoru WhatsApp Siempre Responde",
      description: "Automatización básica de atención inicial",
      setupPrice: 4000,
      monthlyPrice: 2000,
      isActive: true,
      sortOrder: 1,
    },
  });

  const sales = await prisma.package.create({
    data: {
      code: "sales_os",
      name: "Nexoru WhatsApp Sales OS",
      description: "Automatización comercial",
      setupPrice: 28000,
      monthlyPrice: 9000,
      isActive: true,
      sortOrder: 2,
    },
  });

  const loyalty = await prisma.package.create({
    data: {
      code: "loyalty_os",
      name: "Nexoru Loyalty OS",
      description: "Programa de recompensas con puntos",
      setupPrice: 72000,
      monthlyPrice: 18000,
      isActive: true,
      sortOrder: 3,
    },
  });

  const booking = await prisma.package.create({
    data: {
      code: "booking_os",
      name: "Nexoru Booking OS",
      description: "Gestión automatizada de reservas",
      setupPrice: 10000,
      monthlyPrice: 3000,
      isActive: true,
      sortOrder: 4,
    },
  });

  const addons = await Promise.all([
    prisma.addon.create({
      data: {
        code: "database_contacts_sheet",
        name: "Base de Datos",
        description: "Documento google sheets mensual de contactos",
        setupPrice: 1200,
        monthlyPrice: 350,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "email_reporting_basic",
        name: "Envío de reportes por email",
        description: "Reporte básico consolidado de métricas en PDF",
        setupPrice: 1500,
        monthlyPrice: 350,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "campaigns_massive_templates",
        name: "Envío de campañas de marketing automatizadas",
        description:
          "Campañas salientes automatizadas por WhatsApp con templates aprobados por Meta. Sujeto a aprobación de templates por parte de Meta (1,000 envíos mensuales)",
        setupPrice: 1200,
        monthlyPrice: 350,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "channel_instagram",
        name: "Canal adicional Instagram",
        description:
          "Automatiza la atención inicial o respuestas básicas en Instagram Messenger",
        setupPrice: 1000,
        monthlyPrice: 200,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "channel_facebook",
        name: "Canal adicional Facebook",
        description:
          "Automatiza la atención inicial o respuestas básicas en Facebook Messenger",
        setupPrice: 1000,
        monthlyPrice: 200,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "channel_tiktok",
        name: "Canal adicional TikTok",
        description:
          "Activa la conversación automatizada en Facebook Messenger cuando un usuario escribe en TikTok Messaging Ads",
        setupPrice: 1000,
        monthlyPrice: 200,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "dashboard_basic",
        name: "Dashboard Web Tiempo Real (Analítica Básica)",
        description:
          "Dashboard Web con métricas generales de clientes, conversaciones y ventas",
        setupPrice: 4500,
        monthlyPrice: 1000,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "dashboard_advanced",
        name: "Dashboard Ejecutivo Web Tiempo Real (Analítica Avanzada)",
        description:
          "Dashboard Ejecutivo Web con métricas avanzadas, ticket promedio, cálculos, gráficos mensuales y segmentación de clientes",
        setupPrice: 7500,
        monthlyPrice: 2000,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "delivery_logic",
        name: "Lógica y Proceso de Delivery",
        description:
          "Definición e implementación del proceso de delivery para seguimiento",
        setupPrice: 4500,
        monthlyPrice: 1000,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "integrations_1500",
        name: "Ampliación de Integraciones con sistemas (1,500 tareas/mes)",
        description:
          "Incrementar la capacidad de integraciones para soportar hasta 1,500 tareas mensuales adicionales sobre la capa base del paquete",
        setupPrice: 0,
        monthlyPrice: 2000,
        isActive: true,
      },
    }),
    prisma.addon.create({
      data: {
        code: "ai_advanced",
        name: "IA conversacional avanzada",
        description:
          "Automatiza la atención y respuesta con OpenAI entrenando al prompt con la información precisa del negocio y productos",
        setupPrice: 4000,
        monthlyPrice: 1500,
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
        label: "Menú inicial con opciones",
        sortOrder: 2,
      },
      {
        packageId: base0.id,
        label: "Flujos básicos de atención",
        sortOrder: 3,
      },
      {
        packageId: base0.id,
        label: "Registro básico de contacto",
        sortOrder: 4,
      },
      {
        packageId: base0.id,
        label: "Base operativa mínima para crecer después",
        sortOrder: 5,
      },

      {
        packageId: sales.id,
        label: "IA conversacional avanzada",
        sortOrder: 1,
      },
      {
        packageId: sales.id,
        label: "Registro de usuarios (Datos básicos, fecha de nacimiento, sexo)",
        sortOrder: 2,
      },
      {
        packageId: sales.id,
        label: "Integraciones con sistemas (5,000 tareas/mes)",
        sortOrder: 3,
      },
      {
        packageId: sales.id,
        label: "Base de Datos Clientes",
        sortOrder: 4,
      },
      {
        packageId: sales.id,
        label: "Automatización del flujo comercial principal",
        sortOrder: 5,
      },
      {
        packageId: sales.id,
        label: "Base de datos estructurada para leads o clientes",
        sortOrder: 6,
      },
      {
        packageId: sales.id,
        label: "Lógica de conversación comercial",
        sortOrder: 7,
      },
      {
        packageId: sales.id,
        label: "Seguimiento automatizado del proceso comercial",
        sortOrder: 8,
      },
      {
        packageId: sales.id,
        label: "Configuración operativa inicial de ventas",
        sortOrder: 9,
      },
      {
        packageId: sales.id,
        label: "Lógica base para escalar a una operación comercial más robusta",
        sortOrder: 10,
      },
      {
        packageId: sales.id,
        label: "Proceso de cobro del flujo comercial base con Mercado Pago",
        sortOrder: 11,
      },
      {
        packageId: sales.id,
        label: "Trazabilidad mínima de oportunidad / venta",
        sortOrder: 12,
      },

      {
        packageId: loyalty.id,
        label: "IA conversacional avanzada",
        sortOrder: 1,
      },
      {
        packageId: loyalty.id,
        label: "Registro de usuarios (Datos básicos, fecha de nacimiento, sexo)",
        sortOrder: 2,
      },
      {
        packageId: loyalty.id,
        label: "Integraciones con sistemas (5,000 tareas/mes)",
        sortOrder: 3,
      },
      {
        packageId: loyalty.id,
        label: "Lectura OCR de tickets",
        sortOrder: 4,
      },
      {
        packageId: loyalty.id,
        label: "Validación antifraude",
        sortOrder: 5,
      },
      {
        packageId: loyalty.id,
        label: "Sistema de puntos (Lógica base de acumulación/redención)",
        sortOrder: 6,
      },
      {
        packageId: loyalty.id,
        label: "Redención de recompensas",
        sortOrder: 7,
      },
      {
        packageId: loyalty.id,
        label: "Base de datos estructurada para clientes",
        sortOrder: 8,
      },
      {
        packageId: loyalty.id,
        label: "Seguimiento automatizado del proceso de recompensas",
        sortOrder: 9,
      },
      {
        packageId: loyalty.id,
        label: "Configuración operativa inicial de recompensas",
        sortOrder: 10,
      },
      {
        packageId: loyalty.id,
        label:
          "Dashboard Ejecutivo Web Tiempo Real (Analítica Avanzada). Dashboard Ejecutivo Web con métricas avanzadas, ticket promedio, cálculos, gráficos mensuales y segmentación de clientes",
        sortOrder: 11,
      },
      {
        packageId: loyalty.id,
        label: "Envío de reportes por email",
        sortOrder: 12,
      },
      {
        packageId: loyalty.id,
        label:
          "Lógica base para escalar a una operación de recompensas más robusta",
        sortOrder: 13,
      },

      {
        packageId: booking.id,
        label: "Administración de 1 calendario",
        sortOrder: 1,
      },
      {
        packageId: booking.id,
        label: "Registro de usuarios (Datos básicos, fecha de nacimiento, sexo)",
        sortOrder: 2,
      },
      {
        packageId: booking.id,
        label: "Automatización básica de respuestas (orientada a reservas)",
        sortOrder: 3,
      },
      {
        packageId: booking.id,
        label: "Menú inicial con opciones",
        sortOrder: 4,
      },
      {
        packageId: booking.id,
        label:
          "Gestión de Agenda y Disponibilidad de cursos mensuales (Agregar, modificar y eliminar oferta de cursos)",
        sortOrder: 5,
      },
      {
        packageId: booking.id,
        label: "Confirmación automatizada",
        sortOrder: 6,
      },
      {
        packageId: booking.id,
        label: "Recordatorios programados",
        sortOrder: 7,
      },
      {
        packageId: booking.id,
        label: "Integraciones con sistemas (5,000 tareas/mes)",
        sortOrder: 8,
      },
      {
        packageId: booking.id,
        label: "Proceso de cobro de reserva con Mercado Pago",
        sortOrder: 9,
      },
      {
        packageId: booking.id,
        label: "Base de Datos de participantes",
        sortOrder: 10,
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
        label: "Integraciones con sistemas",
        sortOrder: 2,
      },
      {
        packageId: base0.id,
        label: "Base de Datos",
        sortOrder: 3,
      },
      {
        packageId: base0.id,
        label: "Envío de reportes por email",
        sortOrder: 4,
      },
      {
        packageId: base0.id,
        label: "Canal adicional Instagram",
        sortOrder: 5,
      },
      {
        packageId: base0.id,
        label: "Canal adicional Facebook",
        sortOrder: 6,
      },
      {
        packageId: base0.id,
        label: "Canal adicional TikTok",
        sortOrder: 7,
      },
      {
        packageId: base0.id,
        label: "Motor comercial",
        sortOrder: 8,
      },
      {
        packageId: base0.id,
        label: "Sistema de loyalty",
        sortOrder: 9,
      },
      {
        packageId: base0.id,
        label: "Reservas/citas",
        sortOrder: 10,
      },
      {
        packageId: base0.id,
        label: "Lógica y Proceso de Delivery",
        sortOrder: 11,
      },
      {
        packageId: base0.id,
        label: "Dashboard Web Tiempo Real (Analítica Básica)",
        sortOrder: 12,
      },
      {
        packageId: base0.id,
        label: "Dashboard Ejecutivo Web Tiempo Real (Analítica Avanzada)",
        sortOrder: 13,
      },
      {
        packageId: base0.id,
        label: "Proceso de cobro del flujo comercial base con Mercado Pago",
        sortOrder: 14,
      },
      {
        packageId: base0.id,
        label: "Envío de campañas de marketing masivas automatizadas",
        sortOrder: 15,
      },
      {
        packageId: base0.id,
        label: "Administración y Actualización de Agenda en tiempo real",
        sortOrder: 16,
      },
      {
        packageId: base0.id,
        label: "Personalizaciones fuera del alcance estándar",
        sortOrder: 17,
      },
      {
        packageId: base0.id,
        label: "Anuncios pagados en Meta",
        sortOrder: 18,
      },
      {
        packageId: base0.id,
        label: "Anuncios pagados en TikTok",
        sortOrder: 19,
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
        label: "Desarrollos totalmente a medida fuera del catálogo",
        sortOrder: 3,
      },
      {
        packageId: sales.id,
        label: "Lógica y Proceso de Delivery",
        sortOrder: 4,
      },
      {
        packageId: sales.id,
        label: "Administración y Actualización de Agenda en tiempo real",
        sortOrder: 5,
      },
      {
        packageId: sales.id,
        label: "Envío de reportes por email",
        sortOrder: 6,
      },
      {
        packageId: sales.id,
        label: "Sistema de Loyalty",
        sortOrder: 7,
      },
      {
        packageId: sales.id,
        label: "Reservas/citas",
        sortOrder: 8,
      },
      {
        packageId: sales.id,
        label: "Dashboard Web Tiempo Real (Analítica Básica)",
        sortOrder: 9,
      },
      {
        packageId: sales.id,
        label: "Dashboard Ejecutivo Web Tiempo Real (Analítica Avanzada)",
        sortOrder: 10,
      },
      {
        packageId: sales.id,
        label: "Envío de campañas de marketing masivas automatizadas",
        sortOrder: 11,
      },
      {
        packageId: sales.id,
        label: "Personalizaciones fuera del alcance estándar",
        sortOrder: 12,
      },
      {
        packageId: sales.id,
        label: "Anuncios pagados en Meta",
        sortOrder: 13,
      },
      {
        packageId: sales.id,
        label: "Anuncios pagados en TikTok",
        sortOrder: 14,
      },

      {
        packageId: loyalty.id,
        label: "ERP o integraciones empresariales complejas",
        sortOrder: 1,
      },
      {
        packageId: loyalty.id,
        label: "Personalizaciones fuera del flujo definido",
        sortOrder: 2,
      },
      {
        packageId: loyalty.id,
        label: "Automatización del flujo comercial principal",
        sortOrder: 3,
      },
      {
        packageId: loyalty.id,
        label: "Desarrollos totalmente a medida fuera del catálogo",
        sortOrder: 4,
      },
      {
        packageId: loyalty.id,
        label: "Administración y Actualización de Agenda en tiempo real",
        sortOrder: 5,
      },
      {
        packageId: loyalty.id,
        label: "Lógica de conversación comercial",
        sortOrder: 6,
      },
      {
        packageId: loyalty.id,
        label: "Lógica y Proceso de Delivery",
        sortOrder: 7,
      },
      {
        packageId: loyalty.id,
        label: "Reservas/citas",
        sortOrder: 8,
      },
      {
        packageId: loyalty.id,
        label: "Motor promocional",
        sortOrder: 9,
      },
      {
        packageId: loyalty.id,
        label: "Envío de campañas de marketing masivas automatizadas",
        sortOrder: 10,
      },
      {
        packageId: loyalty.id,
        label: "Proceso de cobro del flujo comercial base con Mercado Pago",
        sortOrder: 11,
      },
      {
        packageId: loyalty.id,
        label: "Personalizaciones fuera del alcance estándar",
        sortOrder: 12,
      },
      {
        packageId: loyalty.id,
        label: "Anuncios pagados en Meta",
        sortOrder: 13,
      },
      {
        packageId: loyalty.id,
        label: "Anuncios pagados en TikTok",
        sortOrder: 14,
      },

      {
        packageId: booking.id,
        label: "IA conversacional avanzada",
        sortOrder: 1,
      },
      {
        packageId: booking.id,
        label: "ERP o integraciones empresariales complejas",
        sortOrder: 2,
      },
      {
        packageId: booking.id,
        label: "Personalizaciones fuera del flujo definido",
        sortOrder: 3,
      },
      {
        packageId: booking.id,
        label: "Desarrollos totalmente a medida fuera del catálogo",
        sortOrder: 4,
      },
      {
        packageId: booking.id,
        label: "Lógica y Proceso de Delivery",
        sortOrder: 5,
      },
      {
        packageId: booking.id,
        label: "Envío de reportes por email",
        sortOrder: 6,
      },
      {
        packageId: booking.id,
        label: "Sistema de Loyalty",
        sortOrder: 7,
      },
      {
        packageId: booking.id,
        label: "Dashboard Web Tiempo Real (Analítica Básica)",
        sortOrder: 8,
      },
      {
        packageId: booking.id,
        label: "Dashboard Ejecutivo Web Tiempo Real (Analítica Avanzada)",
        sortOrder: 9,
      },
      {
        packageId: booking.id,
        label: "Envío de campañas de marketing masivas automatizadas",
        sortOrder: 10,
      },
      {
        packageId: booking.id,
        label: "Personalizaciones fuera del alcance estándar",
        sortOrder: 11,
      },
      {
        packageId: booking.id,
        label: "Anuncios pagados en Meta",
        sortOrder: 12,
      },
      {
        packageId: booking.id,
        label: "Anuncios pagados en TikTok",
        sortOrder: 13,
      },
    ],
  });

  await prisma.packageAddon.createMany({
    data: [
      {
        packageId: base0.id,
        addonId: addonMap.database_contacts_sheet.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.email_reporting_basic.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.campaigns_massive_templates.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.channel_instagram.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.channel_facebook.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.channel_tiktok.id,
      },
      {
        packageId: base0.id,
        addonId: addonMap.ai_advanced.id,
      },

      {
        packageId: sales.id,
        addonId: addonMap.email_reporting_basic.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.campaigns_massive_templates.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.dashboard_basic.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.dashboard_advanced.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.delivery_logic.id,
      },
      {
        packageId: sales.id,
        addonId: addonMap.integrations_1500.id,
      },

      {
        packageId: loyalty.id,
        addonId: addonMap.campaigns_massive_templates.id,
      },
      {
        packageId: loyalty.id,
        addonId: addonMap.delivery_logic.id,
      },
      {
        packageId: loyalty.id,
        addonId: addonMap.integrations_1500.id,
      },

      {
        packageId: booking.id,
        addonId: addonMap.email_reporting_basic.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.campaigns_massive_templates.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.channel_instagram.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.channel_facebook.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.channel_tiktok.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.dashboard_basic.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.dashboard_advanced.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.integrations_1500.id,
      },
      {
        packageId: booking.id,
        addonId: addonMap.ai_advanced.id,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.goalOption.createMany({
    data: [
      {
        code: "base0",
        name: "Responder Mensajes Automáticamente",
        description:
          "Automatizar respuestas básicas, FAQs y atención inicial sin procesos complejos",
        optionType: "primary",
        isActive: true,
        sortOrder: 1,
      },
      {
        code: "sales",
        name: "Vender / cobrar por WhatsApp",
        description:
          "Capturar leads, responder con IA, generar pagos y automatizar seguimiento comercial.",
        optionType: "primary",
        isActive: true,
        sortOrder: 2,
      },
      {
        code: "loyalty",
        name: "Registrar tickets y puntos",
        description:
          "Implementar un sistema de loyalty con validación de tickets, puntos y redenciones.",
        optionType: "primary",
        isActive: true,
        sortOrder: 3,
      },
      {
        code: "booking",
        name: "Agendar reservas, cursos o citas",
        description:
          "Gestionar disponibilidad, reservas, recordatorios y confirmaciones automáticas.",
        optionType: "primary",
        isActive: true,
        sortOrder: 4,
      },
      {
        code: "other",
        name: "Otro",
        description:
          "Tengo una necesidad diferente y quiero que Nexoru me ayude a estructurarla.",
        optionType: "primary",
        isActive: true,
        sortOrder: 5,
      },
    ],
  });

  await prisma.packageRecommendationRule.createMany({
    data: [
      {
        goalCode: "base0",
        packageId: base0.id,
        priority: 1,
      },
      {
        goalCode: "sales",
        packageId: sales.id,
        priority: 1,
      },
      {
        goalCode: "loyalty",
        packageId: loyalty.id,
        priority: 1,
      },
      {
        goalCode: "booking",
        packageId: booking.id,
        priority: 1,
      },
    ],
  });

  console.log("✅ Catalog V2 seed completed");
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