import { requireAdminPage } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";
import { revalidatePath } from "next/cache";

async function addService(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const count = await prisma.service.count();
  await prisma.service.create({ data: { name, isActive: true, sortOrder: count } });
  revalidatePath("/admin/services");
}

async function toggleService(serviceId: string, isActive: boolean) {
  "use server";
  await prisma.service.update({ where: { id: serviceId }, data: { isActive } });
  revalidatePath("/admin/services");
}

async function renameService(serviceId: string, formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.service.update({ where: { id: serviceId }, data: { name } });
  revalidatePath("/admin/services");
}

export default async function AdminServicesPage() {
  await requireAdminPage();
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <AdminShell active="/admin/services">
      <h1 className="font-display text-2xl font-bold text-ink">Services</h1>
      <p className="mt-1 text-sm text-black/50">
        Active services automatically appear on the customer registration form.
      </p>

      <form action={addService} className="card mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="name" className="label-text">
            New Service Name
          </label>
          <input id="name" name="name" type="text" required className="input-field" placeholder="e.g. Beard Trim" />
        </div>
        <button type="submit" className="btn-secondary sm:w-40">
          Add Service
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {services.map((service) => {
          const toggle = toggleService.bind(null, service.id, !service.isActive);
          const rename = renameService.bind(null, service.id);
          return (
            <div key={service.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <form action={rename} className="flex flex-1 items-center gap-2">
                <input
                  name="name"
                  defaultValue={service.name}
                  className="input-field !py-2 text-sm"
                />
                <button type="submit" className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/5">
                  Save
                </button>
              </form>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    service.isActive ? "bg-green-100 text-green-700" : "bg-black/5 text-black/40"
                  }`}
                >
                  {service.isActive ? "Active" : "Disabled"}
                </span>
                <form action={toggle}>
                  <button type="submit" className="btn-secondary !w-auto !py-2 !px-4 text-xs">
                    {service.isActive ? "Disable" : "Enable"}
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
