import "dotenv/config";
import { PrismaClient, AddonPriceType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 🔥 IMPORTANTE: usar DIRECT_URL para seed
const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL or DIRECT_URL");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // limpiar
  await prisma.packageAddon.deleteMany();
  await prisma.packageIncludedItem.deleteMany();
  await prisma.packageExcludedItem.deleteMany();
  await prisma.packageRecommendationRule.deleteMany();
  await prisma.onboardingSelectedAddon.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.package.deleteMany();

  // paquetes
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

  // addons
  const addons = await Promise.all([
    prisma.addon.create({
      data: { code: "payments", name: "Pagos", priceType: AddonPriceType.CUSTOM },
    }),
    prisma.addon.create({
      data: { code: "dashboard", name: "Dashboard", priceType: AddonPriceType.CUSTOM },
    }),
    prisma.addon.create({
      data: { code: "agenda", name: "Agenda", priceType: AddonPriceType.CUSTOM },
    }),
    prisma.addon.create({
      data: { code: "delivery", name: "Delivery", priceType: AddonPriceType.CUSTOM },
    }),
    prisma.addon.create({
      data: { code: "campaigns", name: "Campañas", priceType: AddonPriceType.CUSTOM },
    }),
  ]);

  await prisma.packageAddon.createMany({
    data: addons.map((addon) => ({
      packageId: sales.id,
      addonId: addon.id,
    })),
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
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });