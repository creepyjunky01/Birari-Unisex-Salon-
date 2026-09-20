import QRCode from "qrcode";

/**
 * Generates a QR code as a data URL (base64 PNG) for the given content.
 * The QR encodes only a non-sensitive public URL (a token/registration
 * lookup page) — never mobile numbers, DOB, or payment details.
 */
export async function generateQrDataUrl(content: string): Promise<string> {
  return QRCode.toDataURL(content, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: {
      dark: "#151008",
      light: "#00000000"
    }
  });
}
