"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import WatermarkBackground from "@/components/WatermarkBackground";
import CopyField from "@/components/CopyField";
import { SparkleIcon, AlertIcon } from "@/components/icons";
import type { SalonSettings } from "@/lib/settings";

export default function PaymentConfirm({
  settings,
  registrationId,
  customerName,
  amount
}: {
  settings: SalonSettings;
  registrationId: string;
  customerName: string;
  amount: number;
}) {
  const router = useRouter();
  const [screenshotConfirmed, setScreenshotConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upiLink = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.salonName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Birari Salon Pre-Booking ${registrationId}`)}`;

  async function handleContinue() {
    if (!screenshotConfirmed || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId })
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(`/success/${registrationId}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink">
      <WatermarkBackground />

      <div className="container-narrow flex min-h-dvh flex-col py-10">
        <div className="mb-6 flex items-center gap-3">
          <Logo size={40} priority />
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-300">{settings.salonName}</p>
            <h1 className="font-display text-xl font-bold text-cream">You&apos;re Registered!</h1>
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-1 text-sm text-white/60">Thanks, {customerName} — one last step.</p>

          <div className="card mb-5 bg-white text-ink">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Registration ID</p>
            <p className="mt-1 font-display text-2xl font-bold">{registrationId}</p>
            <p className="mt-3 text-sm text-black/60">
              Pay ₹{amount} to confirm your pre-booking. Keep hold of your payment screenshot —
              you&apos;ll share it on WhatsApp next.
            </p>
          </div>

          <div className="card mb-5 bg-white text-ink">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">Amount Payable</p>
            <p className="mt-1 font-display text-4xl font-bold">₹{amount}</p>
          </div>

          <div className="card mb-5 bg-white text-ink">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-600">Pay Using Any UPI App</p>
            <a href={upiLink} className="btn-primary mb-4">Pay ₹{amount} via UPI App</a>
            <div className="space-y-3">
              <CopyField label="UPI ID" value={settings.upiId} />
              {settings.phonepeNumber && <CopyField label="PhonePe Number" value={settings.phonepeNumber} />}
              {settings.googlepayNumber && <CopyField label="Google Pay Number" value={settings.googlepayNumber} />}
              {settings.paytmNumber && <CopyField label="Paytm Number" value={settings.paytmNumber} />}
            </div>
          </div>

          <div className="card mb-6 border-gold-300/60 bg-gold-50 text-ink">
            <p className="font-display text-base font-semibold">Payment Completed?</p>
            <p className="mt-1 text-sm text-black/60">
              Please keep your payment screenshot ready — you&apos;ll share it on WhatsApp right
              after this to confirm your booking.
            </p>
            <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm">
              <input type="checkbox" checked={screenshotConfirmed} onChange={(e) => setScreenshotConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500" />
              <span>I have completed the payment and saved the screenshot.</span>
            </label>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
            </div>
          )}
        </div>

        <button type="button" onClick={handleContinue} disabled={!screenshotConfirmed || submitting} className="btn-primary">
          <SparkleIcon className="h-4 w-4" />
          {submitting ? "Confirming..." : "Confirm Payment & Continue"}
        </button>
      </div>
    </main>
  );
}
