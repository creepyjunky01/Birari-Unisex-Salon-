import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { validateRegistration, normalizeMobile } from "@/lib/validators";
import { generateRegistrationId, generateSecureToken } from "@/lib/ids";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const input = {
    name: String(body.name ?? ""),
    mobile: String(body.mobile ?? ""),
    dob: body.dob ? String(body.dob) : undefined,
    serviceId: String(body.serviceId ?? "")
  };

  const { valid, errors } = validateRegistration(input);
  if (!valid) {
    return NextResponse.json({ message: "Please fix the errors below.", errors }, { status: 422 });
  }

  const service = await prisma.service.findUnique({ where: { id: input.serviceId } });
  if (!service || !service.isActive) {
    return NextResponse.json(
      { message: "Selected service is no longer available.", errors: { serviceId: "Invalid service." } },
      { status: 422 }
    );
  }

  const settings = await getSettings();
  const activeOffers = await prisma.offer.findMany({ where: { isActive: true } });
  const chosenOffer =
    activeOffers.length > 0 ? activeOffers[Math.floor(Math.random() * activeOffers.length)] : null;

  const mobile = normalizeMobile(input.mobile);

  // Retry loop guards against the rare registration-ID collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const existingCount = await prisma.customer.count();
    const registrationId = generateRegistrationId(existingCount + 1 + attempt);
    const token = generateSecureToken(16);

    try {
      const customer = await prisma.$transaction(async (tx) => {
        const created = await tx.customer.create({
          data: {
            registrationId,
            name: input.name.trim(),
            mobile,
            dob: input.dob,
            serviceId: input.serviceId
          }
        });

        await tx.payment.create({
          data: {
            registrationId,
            customerId: created.id,
            amount: settings.prebookingAmount,
            paymentMethod: "UPI",
            paymentStatus: "Pending"
          }
        });

        await tx.scratchCard.create({
          data: {
            customerId: created.id,
            offerId: chosenOffer?.id,
            token,
            status: "Locked"
          }
        });

        return created;
      });

      return NextResponse.json({ registrationId: customer.registrationId }, { status: 201 });
    } catch (err: any) {
      // Unique constraint collision on registrationId — retry with next attempt.
      if (err?.code === "P2002") continue;
      console.error("Registration error", err);
      return NextResponse.json(
        { message: "We couldn't save your registration. Please try again." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: "We couldn't generate a unique registration ID. Please try again." },
    { status: 500 }
  );
}
