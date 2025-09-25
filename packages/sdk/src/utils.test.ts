import { describe, it, expect } from 'vitest';
import { hashPayload, verifyPayloadAgainstHash, solToLamports, lamportsToSol } from './utils';

describe('utils', () => {
  describe('hashPayload', () => {
    it('should generate consistent hash for same payload', () => {
      const payload = Buffer.from('{"test": "data"}');
      const hash1 = hashPayload(payload);
      const hash2 = hashPayload(payload);

      expect(hash1).toEqual(hash2);
      expect(hash1.length).toBe(32); // SHA-256 produces 32 bytes
    });
  });

  describe('verifyPayloadAgainstHash', () => {
    it('should verify correct payload against hash', () => {
      const payload = Buffer.from('{"test": "data"}');
      const hash = hashPayload(payload);

      expect(verifyPayloadAgainstHash(payload, hash)).toBe(true);
    });

    it('should reject incorrect payload', () => {
      const payload1 = Buffer.from('{"test": "data1"}');
      const payload2 = Buffer.from('{"test": "data2"}');
      const hash1 = hashPayload(payload1);

      expect(verifyPayloadAgainstHash(payload2, hash1)).toBe(false);
    });
  });

  describe('solToLamports', () => {
    it('should convert SOL to lamports correctly', () => {
      expect(solToLamports(1)).toBe(1_000_000_000n);
      expect(solToLamports(0.5)).toBe(500_000_000n);
      expect(solToLamports(0.000000001)).toBe(1n);
    });
  });

  describe('lamportsToSol', () => {
    it('should convert lamports to SOL correctly', () => {
      expect(lamportsToSol(1_000_000_000n)).toBe(1);
      expect(lamportsToSol(500_000_000n)).toBe(0.5);
      expect(lamportsToSol(1n)).toBe(0.000000001);
    });
  });
});