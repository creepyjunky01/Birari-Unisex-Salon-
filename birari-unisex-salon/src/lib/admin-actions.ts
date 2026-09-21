"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth";

export async function deleteCustomerAction(customerId: string) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  await prisma.customer.delete({ where: { id: customerId } }).catch(() => {});

  revalidatePath("/admin/customers");
  revalidatePath("/admin");
  redirect("/admin/customers");
}
