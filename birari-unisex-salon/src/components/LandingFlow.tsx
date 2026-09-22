"use client";

import Logo from "@/components/Logo";
import WatermarkBackground from "@/components/WatermarkBackground";
import { ChevronRightIcon } from "@/components/icons";
import { useTransitionNav } from "@/components/PageTransitionProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SalonSettings } from "@/lib/settings";

export default function LandingFlow({ settings }: { settings: SalonSettings }) {
  const router = useRouter();
  const { navigate } = useTransitionNav();

  useEffect(() => {
    router.prefetch("/register");
  }, [router]);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink">
      <WatermarkBackground />

      <div className="container-narrow flex min-h-dvh flex-col items-center justify-center py-14 text-center">
        <div className="mb-6 rounded-full bg-white/5 p-4">
          <Logo size={84} priority />
        </div>

        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.35em] text-gold-300">
          {settings.salonName}
        </p>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-cream sm:text-4xl">
          Your Next Salon Experience
          <br />
          Starts Here.
        </h1>

        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
          Pre-book your service and unlock an exclusive offer for your next visit.
        </p>

        <div className="mt-10 w-full rounded-2xl border border-gold-400/20 bg-white/[0.04] p-6 shadow-premium">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">
            Pre-Booking Charges
          </p>
          <p className="mt-2 font-display text-5xl font-bold text-cream">
            ₹{settings.prebookingAmount}
          </p>
          <p className="mt-3 text-xs text-white/50">
            Quick registration &bull; Secure booking &bull; Exclusive offer
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="btn-primary mt-8"
        >
          Book Your Appointment
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        <p className="mt-3 text-xs text-white/40">Takes less than a minute</p>
      </div>
    </main>
  );
}
