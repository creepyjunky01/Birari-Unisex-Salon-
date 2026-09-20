import Link from "next/link";
import Logo from "@/components/Logo";
import { cookies } from "next/headers";
import { destroyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { redirect } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/secret-keys", label: "Secret Keys" }
];

async function logoutAction() {
  "use server";
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  await destroyAdminSession(token);
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export default function AdminShell({
  active,
  children
}: {
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-black/10 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gold-300">Admin</p>
              <p className="font-display text-sm font-semibold text-cream">Birari Unisex Salon</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/5"
            >
              Log Out
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                active === item.href
                  ? "bg-gold-gradient text-ink"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
