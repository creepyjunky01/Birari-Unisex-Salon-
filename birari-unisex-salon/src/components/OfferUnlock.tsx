"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { LockIcon, AlertIcon } from "@/components/icons";
import ScratchCard from "@/components/ScratchCard";

type Props = {
  token: string;
  initialStatus: string;
  offerTitle: string | null;
  offerDescription: string | null;
  qrDataUrl: string;
  registrationId: string;
  onStatusChange: (status: string) => void;
};

export default function OfferUnlock({
  token,
  initialStatus,
  offerTitle,
  offerDescription,
  qrDataUrl,
  registrationId,
  onStatusChange
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (!secretKey.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, secretKey: secretKey.trim() })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid Secret Key. Please try again.");
        setSubmitting(false);
        return;
      }

      setStatus("Unlocked");
      onStatusChange("Unlocked");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "Locked") {
    return (
      <div className="card bg-white text-ink">
        <div className="flex items-center gap-2 text-gold-700">
          <LockIcon className="h-5 w-5" />
          <p className="font-display text-base font-semibold">Your Exclusive Offer</p>
        </div>

        <div className="my-5 flex flex-col items-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-black/50">
            <LockIcon className="h-3.5 w-3.5" /> Locked
          </div>
          <div className="rounded-2xl border border-black/10 bg-cream p-4">
            <Image src={qrDataUrl} alt="Your unique booking QR code" width={200} height={200} />
          </div>
          <p className="mt-4 text-center text-sm font-medium text-black/70">
            Scan it to unlock this QR
          </p>
          <p className="mt-1 max-w-[260px] text-center text-xs text-black/50">
            To unlock the scratch code, you have to visit the shop and get the Secret Key.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3">
          <div>
            <label htmlFor="secretKey" className="label-text">
              Enter Secret Key
            </label>
            <input
              id="secretKey"
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value.toUpperCase())}
              placeholder="e.g. BIRARI25"
              className="input-field text-center tracking-widest"
              autoCapitalize="characters"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting || !secretKey.trim()} className="btn-secondary">
            {submitting ? "Checking..." : "Unlock Offer"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card bg-white text-ink">
      <p className="mb-1 text-center font-display text-base font-semibold text-gold-700">
        Your Offer Is Unlocked
      </p>
      <p className="mb-5 text-center text-xs text-black/50">Scratch to Reveal</p>
      <ScratchCard
        offerTitle={offerTitle ?? "Special Offer"}
        offerDescription={offerDescription}
        registrationId={registrationId}
        alreadyRedeemed={status === "Redeemed"}
        onRevealed={() => {
          setStatus("Redeemed");
          onStatusChange("Redeemed");
        }}
        token={token}
      />
    </div>
  );
}
