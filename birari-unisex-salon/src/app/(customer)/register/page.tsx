import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import RegistrationForm from "@/components/RegistrationForm";

export default async function RegisterPage() {
  const [services, settings] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    }),
    getSettings()
  ]);

  return <RegistrationForm services={services} prebookingAmount={settings.prebookingAmount} />;
}
