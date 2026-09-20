import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminOverviewPage() {
  await requireAdminPage();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalRegistrations,
    todaysRegistrations,
    paymentSubmitted,
    paymentVerified,
    lockedOffers,
    unlockedOffers,
    redeemedOffers
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.payment.count({ where: { paymentStatus: "Payment Submitted" } }),
    prisma.payment.count({ where: { paymentStatus: "Payment Verified" } }),
    prisma.scratchCard.count({ where: { status: "Locked" } }),
    prisma.scratchCard.count({ where: { status: "Unlocked" } }),
    prisma.scratchCard.count({ where: { status: "Redeemed" } })
  ]);

  const cards = [
    { label: "Total Registrations", value: totalRegistrations },
    { label: "Today's Registrations", value: todaysRegistrations },
    { label: "Payment Submissions", value: paymentSubmitted },
    { label: "Payments Verified", value: paymentVerified },
    { label: "Locked Offers", value: lockedOffers },
    { label: "Unlocked Offers", value: unlockedOffers },
    { label: "Redeemed Offers", value: redeemedOffers }
  ];

  return (
    <AdminShell active="/admin">
      <h1 className="font-display text-2xl font-bold text-ink">Overview</h1>
      <p className="mt-1 text-sm text-black/50">A snapshot of today&apos;s bookings and offers.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-ink">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
