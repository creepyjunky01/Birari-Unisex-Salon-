import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import DeleteCustomerButton from "@/components/admin/DeleteCustomerButton";
import { deleteCustomerAction } from "@/lib/admin-actions";

type SearchParams = {
  q?: string;
  payment?: string;
  offer?: string;
  sort?: "newest" | "oldest";
};

export default async function AdminCustomersPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  await requireAdminPage();

  const { q, payment, offer, sort = "newest" } = searchParams;

  const customers = await prisma.customer.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q } },
                { mobile: { contains: q } },
                { registrationId: { contains: q } }
              ]
            }
          : {},
        payment ? { payment: { paymentStatus: payment } } : {},
        offer ? { scratchCard: { status: offer } } : {}
      ]
    },
    include: { service: true, payment: true, scratchCard: true },
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" }
  });

  return (
    <AdminShell active="/admin/customers">
      <h1 className="font-display text-2xl font-bold text-ink">Customers</h1>
      <p className="mt-1 text-sm text-black/50">{customers.length} registration(s) found.</p>

      <form className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name, mobile, ID"
          className="input-field sm:col-span-2"
        />
        <select name="payment" defaultValue={payment ?? ""} className="input-field">
          <option value="">All Payment Status</option>
          <option value="Payment Submitted">Payment Submitted</option>
          <option value="Payment Verified">Payment Verified</option>
          <option value="Payment Failed">Payment Failed</option>
        </select>
        <select name="offer" defaultValue={offer ?? ""} className="input-field">
          <option value="">All Offer Status</option>
          <option value="Locked">Locked</option>
          <option value="Unlocked">Unlocked</option>
          <option value="Redeemed">Redeemed</option>
        </select>
        <div className="sm:col-span-4 flex gap-2">
          <button type="submit" className="btn-secondary sm:w-40">
            Apply Filters
          </button>
          <Link href="/admin/customers" className="btn-secondary sm:w-40 flex items-center justify-center">
            Reset
          </Link>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full divide-y divide-black/5 text-sm">
          <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-black/40">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Registration ID</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Offer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gold-50/40">
                <td className="px-4 py-3 font-medium text-ink">
                  <Link href={`/admin/customers/${c.id}`} className="hover:text-gold-700">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-black/60">{c.mobile}</td>
                <td className="px-4 py-3 text-black/60">{c.service.name}</td>
                <td className="px-4 py-3 text-black/60">{c.registrationId}</td>
                <td className="px-4 py-3">
                  <StatusPill value={c.payment?.paymentStatus ?? "Pending"} />
                </td>
                <td className="px-4 py-3">
                  <StatusPill value={c.scratchCard?.status ?? "Locked"} />
                </td>
                <td className="px-4 py-3 text-black/50">
                  {c.createdAt.toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <DeleteCustomerButton customerId={c.id} action={deleteCustomerAction} />
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-black/40">
                  No customers match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function StatusPill({ value }: { value: string }) {
  const tone =
    value === "Payment Verified" || value === "Redeemed"
      ? "bg-green-100 text-green-700"
      : value === "Payment Failed"
        ? "bg-red-100 text-red-700"
        : "bg-gold-100 text-gold-700";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}
