import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// Encrypts free-text notes in the customer portal (e.g. "Material" items —
// site login details, API keys, anything an admin types in) so a leaked
// service-role key or a DB backup alone doesn't hand over plaintext
// credentials. AES-256-GCM: authenticated, so a tampered or corrupted
// ciphertext fails loudly (decryptText throws) instead of silently
// returning garbage.
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getKey(): Buffer {
  const raw = process.env.CUSTOMER_SECRETS_KEY;
  if (!raw) {
    throw new Error("CUSTOMER_SECRETS_KEY saknas — kan inte kryptera/dekryptera kundanteckningar.");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("CUSTOMER_SECRETS_KEY måste vara en base64-kodad 32-byte nyckel.");
  }
  return key;
}

// Stored format: iv.authTag.ciphertext, each base64 — self-contained so a
// key rotation attempt is at least detectable rather than silently corrupt.
export function encryptText(plainText: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptText(stored: string): string {
  const [ivB64, authTagB64, cipherTextB64] = stored.split(".");
  if (!ivB64 || !authTagB64 || !cipherTextB64) {
    throw new Error("Ogiltigt krypterat värde.");
  }

  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(cipherTextB64, "base64")), decipher.final()]);
  return decrypted.toString("utf8");
}

// Best-effort decrypt for display: notes saved before encryption was added
// are still plain text in the DB (not in the iv.authTag.ciphertext shape)
// and would otherwise throw here — fall back to the raw value instead of
// breaking the page.
export function tryDecryptText(stored: string): string {
  try {
    return decryptText(stored);
  } catch {
    return stored;
  }
}
