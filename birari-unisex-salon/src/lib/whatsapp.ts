export type WhatsAppMessageInput = {
  customerName: string;
  mobile: string;
  service: string;
  registrationId: string;
  prebookingAmount: number;
};

/**
 * Builds the professionally formatted pre-filled WhatsApp message.
 * This uses the standard WhatsApp "click-to-chat" link format
 * (https://wa.me/<number>?text=<encoded message>), which is completely
 * free and requires no WhatsApp Business API or paid service.
 */
export function buildWhatsAppMessage(input: WhatsAppMessageInput): string {
  return [
    "Hello Birari Unisex Salon,",
    "",
    "I would like to confirm my appointment/pre-booking.",
    "",
    "Customer Details:",
    `Name: ${input.customerName}`,
    `Mobile: ${input.mobile}`,
    `Service: ${input.service}`,
    `Registration ID: ${input.registrationId}`,
    "",
    `Pre-Booking Amount: ₹${input.prebookingAmount}`,
    "",
    `I have made the ₹${input.prebookingAmount} payment through UPI.`,
    "",
    "Please kindly find my payment screenshot attached below for verification.",
    "",
    "Thank you."
  ].join("\n");
}

/**
 * Builds the wa.me click-to-chat URL. `ownerNumber` must be digits only,
 * including country code (e.g. 919876543210).
 */
export function buildWhatsAppUrl(ownerNumber: string, message: string): string {
  const digitsOnly = ownerNumber.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}
