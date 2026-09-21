"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import WatermarkBackground from "@/components/WatermarkBackground";
import WhatsAppConfirmModal from "@/components/WhatsAppConfirmModal";
import OfferUnlock from "@/components/OfferUnlock";
import { CheckCircleIcon } from "@/components/icons";
import type { SalonSettings } from "@/lib/settings";

type Props = {
  settings: SalonSettings;
  customer: { name: string; mobile: string; registrationId: string; serviceName: string; createdAt: string; };
  payment: { amount: number; status: string };
  scratchCard: { token: string; status: string; offerTitle: string | null; offerDescription: string | null; };
  qrDataUrl: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SuccessView({ settings, customer, payment, scratchCard, qrDataUrl }: Props) {
  const [currentStatus, setCurrentStatus] = useState(scratchCard.status);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink pb-14">
      <WatermarkBackground />
      <div className="container-narrow pt-10">
        <div className="flex flex-col items-center text-center">
          <Logo size={64} priority />
          <div className="mt-5 flex items-center gap-2 text-gold-300">
            <CheckCircleIcon className="h-6 w-6" />
            <h1 className="font-display text-2xl font-bold text-cream">Booking Registered Successfully</h1>
          </div>
          <p className="mt-2 text-sm text-white/60">Thank you, <span className="font-medium text-white">{customer.name}</span>.</p>
        </div>

        <section className="card mt-8 bg-white text-ink">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-600">Booking Summary</p>
          <dl className="space-y-3 text-sm">
            <Row label="Registration ID" value={customer.registrationId} emphasise />
            <Row label="Selected Service" value={customer.serviceName} />
            <Row label="Pre-Booking Amount" value={`₹${payment.amount}`} />
            <Row label="Payment Status" value={payment.status} statusPill />
            <Row label="Registration Date" value={formatDate(customer.createdAt)} />
          </dl>
        </section>

        <section className="mt-6">
          <OfferUnlock token={scratchCard.token} initialStatus={currentStatus} offerTitle={scratchCard.offerTitle} offerDescription={scratchCard.offerDescription} qrDataUrl={qrDataUrl} registrationId={customer.registrationId} onStatusChange={setCurrentStatus} />
        </section>

        <section className="mt-8">
          <WhatsAppConfirmModal
            ownerWhatsappNumber={settings.ownerWhatsappNumber}
            customerName={customer.name}
            mobile={customer.mobile}
            service={customer.serviceName}
            registrationId={customer.registrationId}
            prebookingAmount={payment.amount}
          />
        </section>
      </div>
    </main>
  );
}

function Row({ label, value, emphasise, statusPill }: { label: string; value: string; emphasise?: boolean; statusPill?: boolean; }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 pb-3 last:border-0 last:pb-0">
      <dt className="text-black/50">{label}</dt>
      <dd className={statusPill ? "rounded-full bg-gold-100 px-2.5 py-1 text-xs font-semibold text-gold-700" : emphasise ? "font-semibold text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}
