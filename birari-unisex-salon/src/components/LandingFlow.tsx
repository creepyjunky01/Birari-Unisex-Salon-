"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import WatermarkBackground from "@/components/WatermarkBackground";
import CopyField from "@/components/CopyField";
import { ChevronRightIcon, SparkleIcon } from "@/components/icons";
import type { SalonSettings } from "@/lib/settings";

type Step = "hero" | "prebooking";

export default function LandingFlow({ settings }: { settings: SalonSettings }) {
  const [step, setStep] = useState<Step>("hero");

  const upiLink = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(
    settings.salonName
  )}&am=${settings.prebookingAmount}&cu=INR&tn=${encodeURIComponent("Birari Salon Pre-Booking")}`;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink">
      <WatermarkBackground />

      {step === "hero" ? (
        <HeroSection
          settings={settings}
          onBook={() => setStep("prebooking")}
        />
      ) : (
        <PreBookingSection
          settings={settings}
          upiLink={upiLink}
          onBack={() => setStep("hero")}
        />
      )}
    </main>
  );
}

function HeroSection({
  settings,
  onBook
}: {
  settings: SalonSettings;
  onBook: () => void;
}) {
  return (
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

      <button type="button" onClick={onBook} className="btn-primary mt-8">
        Book Your Appointment
        <ChevronRightIcon className="h-4 w-4" />
      </button>

      <p className="mt-3 text-xs text-white/40">Takes less than a minute</p>
    </div>
  );
}

function PreBookingSection({
  settings,
  upiLink,
  onBack
}: {
  settings: SalonSettings;
  upiLink: string;
  onBack: () => void;
}) {
  const [screenshotConfirmed, setScreenshotConfirmed] = useState(false);

  return (
    <div className="container-narrow flex min-h-dvh flex-col py-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-1 self-start text-xs font-medium text-white/50 hover:text-white/80"
      >
        <ChevronRightIcon className="h-3.5 w-3.5 rotate-180" />
        Back
      </button>

      <div className="flex-1">
        <div className="mb-6 flex items-center gap-3">
          <Logo size={40} />
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-300">
              {settings.salonName}
            </p>
            <h2 className="font-display text-xl font-bold text-cream">Pre-Booking Amount</h2>
          </div>
        </div>

        <div className="card mb-5 bg-white text-ink">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Amount Payable
          </p>
          <p className="mt-1 font-display text-4xl font-bold">₹{settings.prebookingAmount}</p>
          <p className="mt-3 text-sm text-black/60">
            Pay ₹{settings.prebookingAmount} to continue with your appointment registration.
          </p>
        </div>

        <div className="card mb-5 bg-white text-ink">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-600">
            Pay Using Any UPI App
          </p>

          <a href={upiLink} className="btn-primary mb-4">
            Pay ₹{settings.prebookingAmount} via UPI App
          </a>

          <div className="space-y-3">
            <CopyField label="UPI ID" value={settings.upiId} />
            {settings.phonepeNumber && (
              <CopyField label="PhonePe Number" value={settings.phonepeNumber} />
            )}
            {settings.googlepayNumber && (
              <CopyField label="Google Pay Number" value={settings.googlepayNumber} />
            )}
            {settings.paytmNumber && <CopyField label="Paytm Number" value={settings.paytmNumber} />}
          </div>
        </div>

        <div className="card mb-6 border-gold-300/60 bg-gold-50 text-ink">
          <p className="font-display text-base font-semibold">Payment Completed?</p>
          <p className="mt-1 text-sm text-black/60">
            Please keep your payment screenshot ready — you&apos;ll share it on WhatsApp after
            registration for verification.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={screenshotConfirmed}
              onChange={(e) => setScreenshotConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
            />
            <span>I have completed the payment and saved the screenshot.</span>
          </label>
        </div>
      </div>

      <Link
        href="/register"
        aria-disabled={!screenshotConfirmed}
        className={`btn-primary ${!screenshotConfirmed ? "pointer-events-none opacity-50" : ""}`}
      >
        <SparkleIcon className="h-4 w-4" />
        Continue to Registration
      </Link>
    </div>
  );
}
