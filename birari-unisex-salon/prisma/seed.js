/**
 * Birari Unisex Salon — Database seed script.
 * Run with: npm run db:seed
 * Populates default settings, services, offers, an admin user, and a demo
 * secret key ("BIRARI25") so the app is usable immediately after setup.
 */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { defaultServices, defaultOffers, demoSecretKey } = require("../src/data/defaults");

const prisma = new PrismaClient();

async function main() {
  const ownerWhatsappNumber = process.env.OWNER_WHATSAPP_NUMBER || "919999999999";
  const upiId = process.env.UPI_ID || "birarisalon@upi";
  const phonepeNumber = process.env.PHONEPE_NUMBER || "9999999999";
  const googlepayNumber = process.env.GOOGLEPAY_NUMBER || "9999999999";
  const paytmNumber = process.env.PAYTM_NUMBER || "9999999999";
  const prebookingAmount = parseInt(process.env.PREBOOKING_AMOUNT || "100", 10);
  const salonName = process.env.SALON_NAME || "Birari Unisex Salon";
  const salonLogo = process.env.SALON_LOGO_PATH || "/assets/birari-unisex-salon-logo.png";

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      salonName,
      salonLogo,
      ownerWhatsappNumber,
      upiId,
      phonepeNumber,
      googlepayNumber,
      paytmNumber,
      prebookingAmount
    }
  });
  console.log("✓ Settings seeded");

  for (let i = 0; i < defaultServices.length; i++) {
    const existing = await prisma.service.findFirst({ where: { name: defaultServices[i] } });
    if (!existing) {
      await prisma.service.create({
        data: { name: defaultServices[i], isActive: true, sortOrder: i }
      });
    }
  }
  console.log("✓ Services seeded");

  for (const offer of defaultOffers) {
    const existing = await prisma.offer.findFirst({ where: { title: offer.title } });
    if (!existing) {
      await prisma.offer.create({ data: { ...offer, isActive: true } });
    }
  }
  console.log("✓ Offers seeded");

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: { username: adminUsername, passwordHash }
  });
  console.log(`✓ Admin user ready (username: ${adminUsername})`);

  const existingKey = await prisma.secretKey.findFirst({ where: { code: demoSecretKey } });
  if (!existingKey) {
    await prisma.secretKey.create({
      data: { code: demoSecretKey, isActive: true }
    });
  }
  console.log(`✓ Demo secret key ready (${demoSecretKey})`);

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
