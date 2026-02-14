import { extendedWords } from './data/extended-words.js';

const filteredCache = new Map<string, string[]>();

export function getExtendedWordlist(tokenizerIndices: number[], maxTokens: number): string[] {
  const key = `${tokenizerIndices.join(',')}:${maxTokens}`;
  if (filteredCache.has(key)) return filteredCache.get(key)!;
  const result = extendedWords
    .filter(entry => tokenizerIndices.every(i => (entry[i] as number) <= maxTokens))
    .map(([word]) => word);
  filteredCache.set(key, result);
  return result;
}
