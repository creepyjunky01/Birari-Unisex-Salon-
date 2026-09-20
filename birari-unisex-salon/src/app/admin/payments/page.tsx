import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import { revalidatePath } from "next/cache";

async function setPaymentStatus(paymentId: string, status: string) {
  "use server";
  await prisma.payment.update({ where: { id: paymentId }, data: { paymentStatus: status } });
  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  revalidatePath("/admin/customers");
}

export default async function AdminPaymentsPage() {
  await requireAdminPage();

  const payments = await prisma.payment.findMany({
    include: { customer: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell active="/admin/payments">
      <h1 className="font-display text-2xl font-bold text-ink">Payment Verification</h1>
      <p className="mt-1 text-sm text-black/50">
        This zero-cost demo never auto-verifies a payment — confirm each one manually after checking
        the customer&apos;s WhatsApp screenshot.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full divide-y divide-black/5 text-sm">
          <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-black/40">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Registration ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {payments.map((p) => {
              const markVerified = setPaymentStatus.bind(null, p.id, "Payment Verified");
              const markFailed = setPaymentStatus.bind(null, p.id, "Payment Failed");
              return (
                <tr key={p.id} className="hover:bg-gold-50/40">
                  <td className="px-4 py-3 font-medium text-ink">{p.customer.name}</td>
                  <td className="px-4 py-3 text-black/60">{p.registrationId}</td>
                  <td className="px-4 py-3 text-black/60">₹{p.amount}</td>
                  <td className="px-4 py-3 text-black/60">{p.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.paymentStatus === "Payment Verified"
                          ? "bg-green-100 text-green-700"
                          : p.paymentStatus === "Payment Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gold-100 text-gold-700"
                      }`}
                    >
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <form action={markVerified}>
                        <button className="rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                          Verify
                        </button>
                      </form>
                      <form action={markFailed}>
                        <button className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
                          Fail
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-black/40">
                  No payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
