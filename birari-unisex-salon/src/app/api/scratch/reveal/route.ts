import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = String(body?.token ?? "");

  if (!token) {
    return NextResponse.json({ message: "Missing token." }, { status: 400 });
  }

  const scratchCard = await prisma.scratchCard.findUnique({ where: { token } });
  if (!scratchCard) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  if (scratchCard.status === "Locked") {
    return NextResponse.json({ message: "Offer is still locked." }, { status: 400 });
  }

  if (scratchCard.status === "Redeemed") {
    // Idempotent — customer may reload the page after already revealing.
    return NextResponse.json({ status: "Redeemed" }, { status: 200 });
  }

  await prisma.scratchCard.update({
    where: { token },
    data: { status: "Redeemed", redeemedAt: new Date() }
  });

  return NextResponse.json({ status: "Redeemed" }, { status: 200 });
}
