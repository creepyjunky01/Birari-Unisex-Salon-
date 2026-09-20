import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = String(body?.token ?? "");
  const secretKey = String(body?.secretKey ?? "")
    .trim()
    .toUpperCase();

  if (!token || !secretKey) {
    return NextResponse.json({ message: "Missing token or secret key." }, { status: 400 });
  }

  const scratchCard = await prisma.scratchCard.findUnique({ where: { token } });
  if (!scratchCard) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  if (scratchCard.status !== "Locked") {
    // Already unlocked/redeemed — treat as success so the UI can proceed.
    return NextResponse.json({ status: scratchCard.status }, { status: 200 });
  }

  const key = await prisma.secretKey.findUnique({ where: { code: secretKey } });

  if (!key || !key.isActive) {
    return NextResponse.json({ message: "Invalid Secret Key. Please check with the salon staff." }, { status: 400 });
  }

  if (key.expiresAt && key.expiresAt < new Date()) {
    return NextResponse.json({ message: "This Secret Key has expired." }, { status: 400 });
  }

  if (key.usedByCustomerId) {
    return NextResponse.json(
      { message: "This Secret Key has already been used. Please ask staff for a new one." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.scratchCard.update({
      where: { token },
      data: { status: "Unlocked", secretKeyUsed: secretKey, unlockedAt: new Date() }
    }),
    prisma.secretKey.update({
      where: { code: secretKey },
      data: { usedByCustomerId: scratchCard.customerId, usedAt: new Date() }
    })
  ]);

  return NextResponse.json({ status: "Unlocked" }, { status: 200 });
}
