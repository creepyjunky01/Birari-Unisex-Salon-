import Logo from "@/components/Logo";
import WatermarkBackground from "@/components/WatermarkBackground";

export default function MaintenancePage({ salonName }: { salonName: string }) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
      <WatermarkBackground />

      <div className="mb-6 rounded-full bg-white/5 p-4">
        <Logo size={84} priority />
      </div>

      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">
        {salonName}
      </p>

      <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">
        We&apos;ll Be Right Back
      </h1>

      <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
        We&apos;re making a few improvements behind the scenes. Pre-booking will be open again
        shortly — thank you for your patience.
      </p>
    </main>
  );
}
