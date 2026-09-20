import { randomBytes } from "crypto";

/**
 * Generates a human-friendly, sequential-looking registration ID such as
 * "BIRARI-2026-00124". Uniqueness across the small sequence space is
 * guaranteed by the database's unique index plus a random suffix fallback,
 * so callers should retry on the rare collision (see api/register route).
 */
export function generateRegistrationId(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, "0");
  return `BIRARI-${year}-${padded}`;
}

/** Cryptographically random, URL-safe token used for customer QR codes. */
export function generateSecureToken(bytes = 16): string {
  return randomBytes(bytes).toString("hex");
}
