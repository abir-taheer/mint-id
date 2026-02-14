import { describe, it, expect } from 'vitest';
import { mintId, entropy, wordlist } from '../src/extended.js';

describe('extended: mintId', () => {
  it('defaults to maxTokens=1 (same as base)', () => {
    const id = mintId();
    const parts = id.split('_');
    expect(parts).toHaveLength(12);
  });

  it('maxTokens=2 gives a larger pool', () => {
    const pool1 = wordlist();
    const pool2 = wordlist({ maxTokens: 2 });
    expect(pool2.length).toBeGreaterThan(pool1.length);
  });

  it('maxTokens=3 gives an even larger pool', () => {
    const pool2 = wordlist({ maxTokens: 2 });
    const pool3 = wordlist({ maxTokens: 3 });
    expect(pool3.length).toBeGreaterThan(pool2.length);
  });

  it('words from maxTokens=1 pool are a subset of maxTokens=2 pool', () => {
    const pool1 = new Set(wordlist({ maxTokens: 1 }));
    const pool2 = new Set(wordlist({ maxTokens: 2 }));
    for (const word of pool1) {
      expect(pool2.has(word)).toBe(true);
    }
  });

  it('generates IDs from the extended pool', () => {
    const pool = new Set(wordlist({ maxTokens: 2 }));
    const id = mintId({ maxTokens: 2, words: 6 });
    for (const word of id.split('_')) {
      expect(pool.has(word)).toBe(true);
    }
  });

  it('works with model + maxTokens', () => {
    const pool = wordlist({ model: 'claude-opus-4-6', maxTokens: 2 });
    const poolSingle = wordlist({ model: 'claude-opus-4-6', maxTokens: 1 });
    expect(pool.length).toBeGreaterThan(poolSingle.length);
  });

  it('minEntropy works with extended pool', () => {
    const info = entropy({ maxTokens: 2, minEntropy: 128 });
    expect(info.bits).toBeGreaterThanOrEqual(128);
    // larger pool means fewer words needed
    const infoSingle = entropy({ minEntropy: 128 });
    expect(info.words).toBeLessThanOrEqual(infoSingle.words);
  });
});

describe('extended: entropy', () => {
  it('returns larger pool for maxTokens=2', () => {
    const info1 = entropy({ maxTokens: 1 });
    const info2 = entropy({ maxTokens: 2 });
    expect(info2.poolSize).toBeGreaterThan(info1.poolSize);
    expect(info2.bitsPerWord).toBeGreaterThan(info1.bitsPerWord);
  });
});
