"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppConfirmModal({
  ownerWhatsappNumber,
  customerName,
  mobile,
  service,
  registrationId,
  prebookingAmount
}: {
  ownerWhatsappNumber: string;
  customerName: string;
  mobile: string;
  service: string;
  registrationId: string;
  prebookingAmount: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const message = buildWhatsAppMessage({
    customerName,
    mobile,
    service,
    registrationId,
    prebookingAmount
  });
  const whatsappUrl = buildWhatsAppUrl(ownerWhatsappNumber, message);

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="btn-whatsapp">
          <WhatsAppIcon className="h-5 w-5" />
          Confirm Booking on WhatsApp
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-confirm-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-ink shadow-premium"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2 text-[#25D366]">
              <WhatsAppIcon className="h-6 w-6" />
              <p id="whatsapp-confirm-title" className="font-display text-lg font-semibold text-ink">
                Confirm Your Booking
              </p>
            </div>

            <p className="text-sm text-black/60">
              Almost done — send your booking details to the salon on WhatsApp with your payment
              screenshot attached, and you&apos;re confirmed.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-5"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon className="h-5 w-5" />
              Share on WhatsApp
            </a>

            <p className="mt-3 text-center text-xs text-black/40">
              WhatsApp will open with your booking details already filled in. Please attach your
              payment screenshot before sending.
            </p>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center text-xs font-medium text-black/40 hover:text-black/60"
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
