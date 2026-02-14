import { describe, it, expect } from 'vitest';
import { getWordlist } from '../src/wordlist.js';

describe('getWordlist', () => {
  it('returns claude words for mask 1', () => {
    const words = getWordlist(1);
    expect(words.length).toBe(7629);
  });

  it('returns cl100k_base words for mask 2', () => {
    const words = getWordlist(2);
    expect(words.length).toBe(4914);
  });

  it('returns o200k_base words for mask 4', () => {
    const words = getWordlist(4);
    expect(words.length).toBe(5640);
  });

  it('returns gpt2 words for mask 8', () => {
    const words = getWordlist(8);
    expect(words.length).toBe(3495);
  });

  it('returns universal words for mask 15', () => {
    const words = getWordlist(15);
    expect(words.length).toBe(2220);
  });

  it('universal is a subset of every individual tokenizer list', () => {
    const universal = new Set(getWordlist(15));
    for (const mask of [1, 2, 4, 8]) {
      const tokenizer = new Set(getWordlist(mask));
      for (const word of universal) {
        expect(tokenizer.has(word)).toBe(true);
      }
    }
  });

  it('caches results (same reference)', () => {
    const a = getWordlist(15);
    const b = getWordlist(15);
    expect(a).toBe(b);
  });

  it('all words are lowercase strings of length >= 3', () => {
    const words = getWordlist(15);
    for (const word of words) {
      expect(word).toBe(word.toLowerCase());
      expect(word.length).toBeGreaterThanOrEqual(3);
    }
  });
});
