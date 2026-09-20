import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { generateQrDataUrl } from "@/lib/qr";
import SuccessView from "@/components/SuccessView";

export default async function SuccessPage({
  params
}: {
  params: { registrationId: string };
}) {
  const customer = await prisma.customer.findUnique({
    where: { registrationId: params.registrationId },
    include: { service: true, payment: true, scratchCard: { include: { offer: true } } }
  });

  if (!customer || !customer.payment || !customer.scratchCard) {
    notFound();
  }

  const settings = await getSettings();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const qrTarget = `${siteUrl}/success/${customer.registrationId}`;
  const qrDataUrl = await generateQrDataUrl(qrTarget);

  return (
    <SuccessView
      settings={settings}
      customer={{
        name: customer.name,
        mobile: customer.mobile,
        registrationId: customer.registrationId,
        serviceName: customer.service.name,
        createdAt: customer.createdAt.toISOString()
      }}
      payment={{
        amount: customer.payment.amount,
        status: customer.payment.paymentStatus
      }}
      scratchCard={{
        token: customer.scratchCard.token,
        status: customer.scratchCard.status,
        offerTitle: customer.scratchCard.offer?.title ?? null,
        offerDescription: customer.scratchCard.offer?.description ?? null
      }}
      qrDataUrl={qrDataUrl}
    />
  );
}
