import { getSettings } from "@/lib/settings";
import LandingFlow from "@/components/LandingFlow";

export default async function HomePage() {
  const settings = await getSettings();

  return <LandingFlow settings={settings} />;
}
