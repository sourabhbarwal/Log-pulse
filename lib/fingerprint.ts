import crypto from 'crypto';

/**
 * Generates a unique fingerprint for a log message by removing variable parts
 * like timestamps, IDs, or specific values that change frequently.
 */
export function generateFingerprint(message: string): string {
  // Normalize the message: replace numbers, hex strings, and UUIDs with placeholders
  const normalized = message
    .replace(/\d+/g, '{num}') // Replace numbers
    .replace(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, '{uuid}') // Replace UUIDs
    .replace(/0x[0-9a-fA-F]+/g, '{hex}') // Replace hex
    .trim()
    .toLowerCase();

  return crypto.createHash('md5').update(normalized).digest('hex');
}
