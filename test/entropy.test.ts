import { describe, it, expect } from 'vitest';
import { bitsPerWord, wordsForEntropy, entropyInfo } from '../src/entropy.js';

describe('bitsPerWord', () => {
  it('calculates correctly for pool of 2220', () => {
    expect(bitsPerWord(2220)).toBeCloseTo(11.12, 1);
  });

  it('returns 0 for pool size 0', () => {
    expect(bitsPerWord(0)).toBe(0);
  });

  it('returns 1 for pool of 2', () => {
    expect(bitsPerWord(2)).toBe(1);
  });
});

describe('wordsForEntropy', () => {
  it('calculates correct word count for 128 bits with pool 2220', () => {
    const count = wordsForEntropy(2220, 128);
    expect(count).toBe(12); // 128 / 11.12 ≈ 11.51 → ceil = 12
  });

  it('returns 1 word for low entropy target', () => {
    expect(wordsForEntropy(2220, 5)).toBe(1);
  });

  it('returns Infinity for pool size 0', () => {
    expect(wordsForEntropy(0, 128)).toBe(Infinity);
  });
});

describe('entropyInfo', () => {
  it('returns consistent values', () => {
    const info = entropyInfo(2220, 6);
    expect(info.poolSize).toBe(2220);
    expect(info.words).toBe(6);
    expect(info.bitsPerWord).toBeCloseTo(11.12, 1);
    expect(info.bits).toBeCloseTo(6 * 11.12, 0);
  });
});
