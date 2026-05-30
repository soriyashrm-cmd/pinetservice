const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;

// Helper to get the CryptoKey from SESSION_SECRET
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: ALGORITHM },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a session payload into an encrypted string (hex).
 */
export async function encryptSession(payload: any): Promise<string> {
  const secret = process.env.SESSION_SECRET || "fallback_secret_key_for_development_purposes_must_be_long";
  const cryptoKey = await getCryptoKey(secret);

  const encoder = new TextEncoder();
  const encodedPayload = encoder.encode(JSON.stringify(payload));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    cryptoKey,
    encodedPayload
  );

  // Convert array buffer and IV to hex strings
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const encryptedHex = Array.from(encryptedBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Format: ivHex.encryptedHex
  return `${ivHex}.${encryptedHex}`;
}

/**
 * Decrypts an encrypted session string and returns the original payload.
 * Returns null if decryption fails or token is tampered with.
 */
export async function decryptSession(sessionToken: string): Promise<any | null> {
  try {
    const secret = process.env.SESSION_SECRET || "fallback_secret_key_for_development_purposes_must_be_long";
    const parts = sessionToken.split(".");
    if (parts.length !== 2) return null;

    const [ivHex, encryptedHex] = parts;

    // Convert hex back to bytes
    const iv = new Uint8Array(ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    const encryptedData = new Uint8Array(encryptedHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

    const cryptoKey = await getCryptoKey(secret);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      cryptoKey,
      encryptedData
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
  } catch (error) {
    // Decryption failed or token tampered
    return null;
  }
}
