import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth";

/** Call at the top of any protected admin server component. */
export async function requireAdminPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }
}
