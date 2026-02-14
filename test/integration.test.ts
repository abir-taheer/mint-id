import { describe, it, expect } from 'vitest';
import { mintId, entropy, wordlist } from '../src/index.js';
import { UnknownModelError } from '../src/errors.js';

describe('mintId', () => {
  it('returns 12 underscore-separated words by default', () => {
    const id = mintId();
    const parts = id.split('_');
    expect(parts).toHaveLength(12);
    parts.forEach(word => expect(word.length).toBeGreaterThanOrEqual(3));
  });

  it('respects custom word count', () => {
    const id = mintId({ words: 3 });
    expect(id.split('_')).toHaveLength(3);
  });

  it('respects custom delimiter', () => {
    const id = mintId({ delimiter: '-' });
    expect(id.split('-')).toHaveLength(12);
    expect(id).not.toContain('_');
  });

  it('works with model option', () => {
    const id = mintId({ model: 'claude-opus-4-6', words: 4 });
    const parts = id.split('_');
    expect(parts).toHaveLength(4);
    const claudeWords = wordlist({ model: 'claude-opus-4-6' });
    parts.forEach(word => expect(claudeWords).toContain(word));
  });

  it('works with tokenizer array (intersection)', () => {
    const id = mintId({ tokenizer: ['claude', 'o200k_base'], words: 4 });
    const parts = id.split('_');
    expect(parts).toHaveLength(4);
  });

  it('auto-sizes word count with minEntropy', () => {
    const id = mintId({ minEntropy: 128 });
    const parts = id.split('_');
    // universal pool is 2220, ~11.12 bits/word, ceil(128/11.12) = 12
    expect(parts).toHaveLength(12);
  });

  it('minEntropy overrides words', () => {
    const id = mintId({ words: 3, minEntropy: 128 });
    expect(id.split('_')).toHaveLength(12);
  });
});

describe('entropy', () => {
  it('returns correct info for defaults', () => {
    const info = entropy();
    expect(info.poolSize).toBe(2220);
    expect(info.words).toBe(12);
    expect(info.bitsPerWord).toBeCloseTo(11.12, 1);
    expect(info.bits).toBeCloseTo(133.4, 0);
  });

  it('calculates for specific model', () => {
    const info = entropy({ model: 'claude-opus-4-6' });
    expect(info.poolSize).toBe(7629);
    expect(info.words).toBe(12);
    expect(info.bitsPerWord).toBeCloseTo(12.9, 0);
  });

  it('auto-sizes with minEntropy', () => {
    const info = entropy({ minEntropy: 128 });
    expect(info.words).toBe(12);
    expect(info.bits).toBeGreaterThanOrEqual(128);
  });
});

describe('wordlist', () => {
  it('returns universal list by default', () => {
    const words = wordlist();
    expect(words).toHaveLength(2220);
  });

  it('returns claude list for claude model', () => {
    const words = wordlist({ model: 'claude-opus-4-6' });
    expect(words).toHaveLength(7629);
  });

  it('returns intersection for multiple tokenizers', () => {
    const words = wordlist({ tokenizer: ['claude', 'o200k_base'] });
    const claudeWords = new Set(wordlist({ tokenizer: 'claude' }));
    const o200kWords = new Set(wordlist({ tokenizer: 'o200k_base' }));
    for (const word of words) {
      expect(claudeWords.has(word)).toBe(true);
      expect(o200kWords.has(word)).toBe(true);
    }
  });

  it('throws for unknown model', () => {
    expect(() => wordlist({ model: 'fake-model' })).toThrow(UnknownModelError);
  });
});
