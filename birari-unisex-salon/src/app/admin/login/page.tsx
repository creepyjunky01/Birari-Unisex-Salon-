import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { verifyAdminCredentials, createAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const admin = await verifyAdminCredentials(username, password);
  if (!admin) {
    redirect("/admin/login?error=1");
  }

  const token = await createAdminSession();
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  redirect("/admin");
}

export default function AdminLoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size={64} priority />
          <p className="mt-4 text-xs uppercase tracking-widest text-gold-300">Admin Access</p>
          <h1 className="font-display text-xl font-bold text-cream">Birari Unisex Salon</h1>
        </div>

        <form action={loginAction} className="card bg-white text-ink">
          <div className="mb-4">
            <label htmlFor="username" className="label-text">
              Username
            </label>
            <input id="username" name="username" type="text" required className="input-field" autoComplete="username" />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="label-text">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              autoComplete="current-password"
            />
          </div>

          {searchParams.error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              Invalid username or password.
            </p>
          )}

          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
