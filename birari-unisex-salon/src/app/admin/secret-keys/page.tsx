import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

function randomKeyCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

async function generateKey(formData: FormData) {
  "use server";
  const customCode = String(formData.get("code") ?? "").trim().toUpperCase();
  const expiryDays = Number(formData.get("expiryDays") ?? 0);

  const code = customCode || randomKeyCode();
  const expiresAt = expiryDays > 0 ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000) : null;

  await prisma.secretKey.create({ data: { code, expiresAt, isActive: true } });
  revalidatePath("/admin/secret-keys");
}

async function toggleKey(keyId: string, isActive: boolean) {
  "use server";
  await prisma.secretKey.update({ where: { id: keyId }, data: { isActive } });
  revalidatePath("/admin/secret-keys");
}

export default async function AdminSecretKeysPage() {
  await requireAdminPage();
  const keys = await prisma.secretKey.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell active="/admin/secret-keys">
      <h1 className="font-display text-2xl font-bold text-ink">Secret Keys</h1>
      <p className="mt-1 text-sm text-black/50">
        Give a key to a customer in-person so they can unlock their scratch card.
      </p>

      <form action={generateKey} className="card mt-6 grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="code" className="label-text">
            Custom Code <span className="normal-case text-black/30">(optional)</span>
          </label>
          <input id="code" name="code" type="text" className="input-field" placeholder="Auto-generated if blank" />
        </div>
        <div>
          <label htmlFor="expiryDays" className="label-text">
            Expires In (days)
          </label>
          <input
            id="expiryDays"
            name="expiryDays"
            type="number"
            min={0}
            defaultValue={0}
            className="input-field"
          />
          <p className="mt-1 text-[11px] text-black/40">0 = never expires</p>
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-secondary">
            Generate Key
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full divide-y divide-black/5 text-sm">
          <thead className="bg-black/[0.02] text-left text-xs uppercase tracking-wide text-black/40">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {keys.map((key) => {
              const toggle = toggleKey.bind(null, key.id, !key.isActive);
              const isUsed = !!key.usedByCustomerId;
              const isExpired = !!key.expiresAt && key.expiresAt < new Date();
              return (
                <tr key={key.id} className="hover:bg-gold-50/40">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{key.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        !key.isActive
                          ? "bg-black/5 text-black/40"
                          : isUsed
                            ? "bg-black/5 text-black/40"
                            : isExpired
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {!key.isActive ? "Disabled" : isUsed ? "Used" : isExpired ? "Expired" : "Available"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {key.expiresAt ? key.expiresAt.toLocaleDateString("en-IN") : "Never"}
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {key.usedAt ? key.usedAt.toLocaleString("en-IN") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggle}>
                      <button className="btn-secondary !w-auto !py-2 !px-4 text-xs">
                        {key.isActive ? "Disable" : "Enable"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {keys.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-black/40">
                  No secret keys generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
