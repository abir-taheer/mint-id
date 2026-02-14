import { words as allWords } from './data/words.js';

const filteredCache = new Map<number, string[]>();

export function getWordlist(mask: number): string[] {
  if (filteredCache.has(mask)) return filteredCache.get(mask)!;
  const result = allWords
    .filter(([, flags]) => (flags & mask) === mask)
    .map(([word]) => word);
  filteredCache.set(mask, result);
  return result;
}
