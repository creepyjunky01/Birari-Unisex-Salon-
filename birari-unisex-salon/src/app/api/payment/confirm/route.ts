import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const registrationId = String(body?.registrationId ?? "");

  if (!registrationId) {
    return NextResponse.json({ message: "Missing registration ID." }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { registrationId } });
  if (!payment) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  if (payment.paymentStatus === "Pending") {
    await prisma.payment.update({
      where: { registrationId },
      data: { paymentStatus: "Payment Submitted" }
    });
  }

  return NextResponse.json({ status: "Payment Submitted" }, { status: 200 });
}
