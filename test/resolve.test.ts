import { describe, it, expect } from 'vitest';
import { buildMask } from '../src/resolve.js';
import { UnknownTokenizerError, UnknownModelError } from '../src/errors.js';

describe('buildMask', () => {
  it('returns 15 (universal) with no options', () => {
    expect(buildMask()).toBe(15);
    expect(buildMask({})).toBe(15);
  });

  describe('model resolution', () => {
    it('resolves Claude models to bit 0', () => {
      expect(buildMask({ model: 'claude-opus-4-6' })).toBe(1);
      expect(buildMask({ model: 'claude-sonnet-4-5' })).toBe(1);
      expect(buildMask({ model: 'claude-3-opus' })).toBe(1);
    });

    it('resolves GPT-4 to cl100k_base (bit 1)', () => {
      expect(buildMask({ model: 'gpt-4' })).toBe(2);
      expect(buildMask({ model: 'gpt-4-turbo' })).toBe(2);
      expect(buildMask({ model: 'gpt-3.5-turbo' })).toBe(2);
    });

    it('resolves GPT-4o/o-series to o200k_base (bit 2)', () => {
      expect(buildMask({ model: 'gpt-4o' })).toBe(4);
      expect(buildMask({ model: 'o1' })).toBe(4);
      expect(buildMask({ model: 'o3' })).toBe(4);
      expect(buildMask({ model: 'gpt-5' })).toBe(4);
    });

    it('resolves GPT-2 to gpt2 (bit 3)', () => {
      expect(buildMask({ model: 'gpt-2' })).toBe(8);
    });

    it('combines multiple models with OR', () => {
      expect(buildMask({ model: ['claude-opus-4-6', 'gpt-4'] })).toBe(3); // 1 | 2
    });

    it('throws UnknownModelError for unknown model', () => {
      expect(() => buildMask({ model: 'nonexistent-model' })).toThrow(UnknownModelError);
    });
  });

  describe('tokenizer resolution', () => {
    it('resolves canonical tokenizer names', () => {
      expect(buildMask({ tokenizer: 'claude' })).toBe(1);
      expect(buildMask({ tokenizer: 'cl100k_base' })).toBe(2);
      expect(buildMask({ tokenizer: 'o200k_base' })).toBe(4);
      expect(buildMask({ tokenizer: 'gpt2' })).toBe(8);
    });

    it('resolves aliases', () => {
      expect(buildMask({ tokenizer: 'o200k_harmony' })).toBe(4);
      expect(buildMask({ tokenizer: 'p50k_base' })).toBe(8);
      expect(buildMask({ tokenizer: 'r50k_base' })).toBe(8);
    });

    it('combines multiple tokenizers with OR', () => {
      expect(buildMask({ tokenizer: ['claude', 'o200k_base'] })).toBe(5); // 1 | 4
    });

    it('tokenizer takes precedence over model', () => {
      expect(buildMask({ model: 'gpt-4', tokenizer: 'claude' })).toBe(1);
    });

    it('throws UnknownTokenizerError for unknown tokenizer', () => {
      expect(() => buildMask({ tokenizer: 'nonexistent' })).toThrow(UnknownTokenizerError);
    });
  });
});
