import { getSettings } from "@/lib/settings";
import MaintenancePage from "@/components/MaintenancePage";
import PageTransitionProvider from "@/components/PageTransitionProvider";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  if (settings.maintenanceMode) {
    return <MaintenancePage salonName={settings.salonName} />;
  }

  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}
