"use client";

import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton({
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
  const message = buildWhatsAppMessage({
    customerName,
    mobile,
    service,
    registrationId,
    prebookingAmount
  });
  const whatsappUrl = buildWhatsAppUrl(ownerWhatsappNumber, message);

  return (
    <div className="card border-[#25D366]/25 bg-white text-ink">
      <p className="font-display text-base font-semibold">Send Booking Details on WhatsApp</p>
      <p className="mt-1 text-sm text-black/60">
        Please attach your payment screenshot in WhatsApp before sending the message.
      </p>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-4"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Share on WhatsApp
      </a>

      <p className="mt-3 text-center text-xs text-black/40">
        WhatsApp will open with your booking details already filled in. Please attach your
        payment screenshot before sending.
      </p>
    </div>
  );
}
