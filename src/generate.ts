import { randomInt } from 'node:crypto';
import { EmptyWordlistError } from './errors.js';

export function generate(wordlist: string[], count: number, delimiter: string): string {
  if (wordlist.length === 0) {
    throw new EmptyWordlistError();
  }
  if (count <= 0) {
    throw new Error('Word count must be at least 1');
  }
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(wordlist[randomInt(wordlist.length)]);
  }
  return words.join(delimiter);
}
