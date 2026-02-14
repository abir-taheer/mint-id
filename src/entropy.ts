import type { EntropyInfo } from './types.js';

export function bitsPerWord(poolSize: number): number {
  if (poolSize <= 0) return 0;
  return Math.log2(poolSize);
}

export function wordsForEntropy(poolSize: number, targetBits: number): number {
  const bpw = bitsPerWord(poolSize);
  if (bpw <= 0) return Infinity;
  return Math.ceil(targetBits / bpw);
}

export function entropyInfo(poolSize: number, words: number): EntropyInfo {
  const bpw = bitsPerWord(poolSize);
  return {
    bits: bpw * words,
    poolSize,
    bitsPerWord: bpw,
    words,
  };
}
