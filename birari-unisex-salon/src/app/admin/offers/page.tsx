import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import { revalidatePath } from "next/cache";

async function addOffer(formData: FormData) {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!title) return;
  await prisma.offer.create({ data: { title, description: description || null, isActive: true } });
  revalidatePath("/admin/offers");
}

async function toggleOffer(offerId: string, isActive: boolean) {
  "use server";
  await prisma.offer.update({ where: { id: offerId }, data: { isActive } });
  revalidatePath("/admin/offers");
}

export default async function AdminOffersPage() {
  await requireAdminPage();
  const offers = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell active="/admin/offers">
      <h1 className="font-display text-2xl font-bold text-ink">Offers</h1>
      <p className="mt-1 text-sm text-black/50">
        A random active offer is assigned to each new customer&apos;s locked scratch card.
      </p>

      <form action={addOffer} className="card mt-6 grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="title" className="label-text">
            Offer Title
          </label>
          <input id="title" name="title" type="text" required className="input-field" placeholder="e.g. 15% OFF" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="label-text">
            Description <span className="normal-case text-black/30">(optional)</span>
          </label>
          <input id="description" name="description" type="text" className="input-field" placeholder="Short description" />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" className="btn-secondary sm:w-48">
            Add Offer
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {offers.map((offer) => {
          const toggle = toggleOffer.bind(null, offer.id, !offer.isActive);
          return (
            <div key={offer.id} className="card flex items-center justify-between">
              <div>
                <p className="font-display text-base font-semibold text-ink">{offer.title}</p>
                {offer.description && <p className="text-sm text-black/50">{offer.description}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    offer.isActive ? "bg-green-100 text-green-700" : "bg-black/5 text-black/40"
                  }`}
                >
                  {offer.isActive ? "Active" : "Disabled"}
                </span>
                <form action={toggle}>
                  <button type="submit" className="btn-secondary !w-auto !py-2 !px-4 text-xs">
                    {offer.isActive ? "Disable" : "Enable"}
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
