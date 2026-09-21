import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import PaymentConfirm from "@/components/PaymentConfirm";

export default async function PayPage({
  params
}: {
  params: { registrationId: string };
}) {
  const customer = await prisma.customer.findUnique({
    where: { registrationId: params.registrationId },
    include: { payment: true }
  });

  if (!customer || !customer.payment) {
    notFound();
  }

  if (customer.payment.paymentStatus !== "Pending") {
    redirect(`/success/${customer.registrationId}`);
  }

  const settings = await getSettings();

  return (
    <PaymentConfirm
      settings={settings}
      registrationId={customer.registrationId}
      customerName={customer.name}
      amount={customer.payment.amount}
    />
  );
}
