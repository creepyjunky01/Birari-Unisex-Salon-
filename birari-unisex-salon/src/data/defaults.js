/**
 * Default demo data — used by prisma/seed.js on first setup.
 * Editing this file does NOT change an already-seeded database; use the
 * Admin Dashboard (/admin/services, /admin/offers) to manage live data,
 * or re-run `npm run db:seed` after editing this file for a fresh setup.
 */

module.exports = {
  defaultServices: ["Haircut", "Hair Spa", "Hair Color", "Facial", "Styling", "Other"],

  defaultOffers: [
    { title: "10% OFF", description: "10% off your next service" },
    { title: "20% OFF", description: "20% off your next service" },
    { title: "₹100 OFF", description: "₹100 off on services above ₹500" },
    { title: "Free Add-on", description: "A complimentary add-on service on your next visit" }
  ],

  demoSecretKey: "BIRARI25"
};
