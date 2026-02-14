import { describe, it, expect } from 'vitest';
import { generate } from '../src/generate.js';
import { EmptyWordlistError } from '../src/errors.js';

const WORDS = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'];

describe('generate', () => {
  it('returns the correct number of words', () => {
    const result = generate(WORDS, 4, '_');
    expect(result.split('_')).toHaveLength(4);
  });

  it('uses the specified delimiter', () => {
    const result = generate(WORDS, 3, '-');
    expect(result.split('-')).toHaveLength(3);
  });

  it('only picks words from the provided list', () => {
    for (let i = 0; i < 100; i++) {
      const result = generate(WORDS, 3, '_');
      for (const word of result.split('_')) {
        expect(WORDS).toContain(word);
      }
    }
  });

  it('produces unique outputs (statistical)', () => {
    // Use the real universal wordlist (2220 words) for meaningful uniqueness testing
    const results = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      results.add(generate(WORDS, 6, '_'));
    }
    // With 6^6 = 46656 combinations, expect very few collisions in 1000 samples
    expect(results.size).toBeGreaterThan(950);
  });

  it('throws EmptyWordlistError for empty wordlist', () => {
    expect(() => generate([], 3, '_')).toThrow(EmptyWordlistError);
  });

  it('throws for zero word count', () => {
    expect(() => generate(WORDS, 0, '_')).toThrow('at least 1');
  });
});
