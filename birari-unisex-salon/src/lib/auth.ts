import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { generateSecureToken } from "@/lib/ids";

export const ADMIN_SESSION_COOKIE = "birari_admin_session";
const SESSION_TTL_HOURS = 12;

export async function verifyAdminCredentials(username: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  return ok ? admin : null;
}

export async function createAdminSession(): Promise<string> {
  const token = generateSecureToken(24);
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);
  await prisma.adminSession.create({ data: { token, expiresAt } });
  return token;
}

export async function destroyAdminSession(token: string | undefined) {
  if (!token) return;
  await prisma.adminSession.deleteMany({ where: { token } });
}

export async function getAdminSessionFromCookies() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAdminSessionFromCookies();
  return session !== null;
}
