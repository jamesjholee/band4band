import { createHash } from 'crypto';

/**
 * Hash a payload buffer using SHA-256
 */
export function hashPayload(payload: Buffer): Uint8Array {
  return new Uint8Array(createHash('sha256').update(payload).digest());
}

/**
 * Verify that a payload matches the expected hash
 */
export function verifyPayloadAgainstHash(payload: Buffer, expectedHash: Uint8Array): boolean {
  const actualHash = hashPayload(payload);
  return actualHash.every((byte, index) => byte === expectedHash[index]);
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): bigint {
  return BigInt(Math.floor(sol * 1_000_000_000));
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: bigint): number {
  return Number(lamports) / 1_000_000_000;
}