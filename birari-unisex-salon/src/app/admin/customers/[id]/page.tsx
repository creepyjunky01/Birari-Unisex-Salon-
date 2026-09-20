import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import { revalidatePath } from "next/cache";

async function markPaymentAction(customerId: string, status: string) {
  "use server";
  const customer = await prisma.customer.findUnique({ where: { id: customerId }, include: { payment: true } });
  if (!customer?.payment) return;
  await prisma.payment.update({ where: { id: customer.payment.id }, data: { paymentStatus: status } });
  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
}

export default async function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  await requireAdminPage();

  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { service: true, payment: true, scratchCard: { include: { offer: true } } }
  });

  if (!customer) notFound();

  const markVerified = markPaymentAction.bind(null, customer.id, "Payment Verified");
  const markFailed = markPaymentAction.bind(null, customer.id, "Payment Failed");

  return (
    <AdminShell active="/admin/customers">
      <h1 className="font-display text-2xl font-bold text-ink">{customer.name}</h1>
      <p className="mt-1 text-sm text-black/50">{customer.registrationId}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="card">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/40">
            Registration Details
          </p>
          <DetailRow label="Full Name" value={customer.name} />
          <DetailRow label="Mobile" value={customer.mobile} />
          <DetailRow label="Date of Birth" value={customer.dob || "—"} />
          <DetailRow label="Service" value={customer.service.name} />
          <DetailRow label="Registered On" value={customer.createdAt.toLocaleString("en-IN")} />
        </div>

        <div className="card">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/40">
            Payment
          </p>
          <DetailRow label="Amount" value={`₹${customer.payment?.amount ?? "—"}`} />
          <DetailRow label="Method" value={customer.payment?.paymentMethod ?? "—"} />
          <DetailRow label="Status" value={customer.payment?.paymentStatus ?? "—"} />
          <DetailRow label="Reference" value={customer.payment?.paymentReference || "—"} />

          <div className="mt-4 flex gap-2">
            <form action={markVerified}>
              <button type="submit" className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700">
                Mark as Verified
              </button>
            </form>
            <form action={markFailed}>
              <button type="submit" className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700">
                Mark as Failed
              </button>
            </form>
          </div>
        </div>

        <div className="card sm:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/40">
            Offer / Scratch Card
          </p>
          <DetailRow label="Status" value={customer.scratchCard?.status ?? "—"} />
          <DetailRow label="Assigned Offer" value={customer.scratchCard?.offer?.title ?? "—"} />
          <DetailRow label="Secret Key Used" value={customer.scratchCard?.secretKeyUsed || "—"} />
          <DetailRow
            label="Unlocked At"
            value={customer.scratchCard?.unlockedAt?.toLocaleString("en-IN") || "—"}
          />
          <DetailRow
            label="Redeemed At"
            value={customer.scratchCard?.redeemedAt?.toLocaleString("en-IN") || "—"}
          />
        </div>
      </div>
    </AdminShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 py-2 text-sm last:border-0">
      <span className="text-black/50">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
