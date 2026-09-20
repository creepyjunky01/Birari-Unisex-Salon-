import { prisma } from "@/lib/db";

export type SalonSettings = {
  salonName: string;
  salonLogo: string;
  ownerWhatsappNumber: string;
  upiId: string;
  phonepeNumber: string | null;
  googlepayNumber: string | null;
  paytmNumber: string | null;
  prebookingAmount: number;
};

/**
 * Central place the whole app reads salon configuration from.
 * Falls back to environment variables if a Settings row does not exist yet
 * (e.g. before the seed script has run), so the app never crashes.
 */
export async function getSettings(): Promise<SalonSettings> {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });

  if (settings) {
    return settings;
  }

  return {
    salonName: process.env.SALON_NAME || "Birari Unisex Salon",
    salonLogo: process.env.SALON_LOGO_PATH || "/assets/birari-unisex-salon-logo.png",
    ownerWhatsappNumber: process.env.OWNER_WHATSAPP_NUMBER || "919999999999",
    upiId: process.env.UPI_ID || "birarisalon@upi",
    phonepeNumber: process.env.PHONEPE_NUMBER || null,
    googlepayNumber: process.env.GOOGLEPAY_NUMBER || null,
    paytmNumber: process.env.PAYTM_NUMBER || null,
    prebookingAmount: parseInt(process.env.PREBOOKING_AMOUNT || "100", 10)
  };
}
