import type { MintIdOptions, EntropyInfo } from './types.js';
import { buildMask } from './resolve.js';
import { getWordlist } from './wordlist.js';
import { wordsForEntropy, entropyInfo } from './entropy.js';
import { generate } from './generate.js';

const DEFAULT_WORDS = 6;
const DEFAULT_DELIMITER = '_';

/** Generate a cryptographically secure identifier using single-token words. */
export function mintId(options?: MintIdOptions): string {
  const mask = buildMask(options);
  const words = getWordlist(mask);
  const delimiter = options?.delimiter ?? DEFAULT_DELIMITER;

  let count: number;
  if (options?.minEntropy) {
    count = wordsForEntropy(words.length, options.minEntropy);
  } else {
    count = options?.words ?? DEFAULT_WORDS;
  }

  return generate(words, count, delimiter);
}

/** Calculate entropy for a given configuration. */
export function entropy(options?: Pick<MintIdOptions, 'words' | 'model' | 'tokenizer' | 'minEntropy'>): EntropyInfo {
  const mask = buildMask(options);
  const words = getWordlist(mask);

  let count: number;
  if (options?.minEntropy) {
    count = wordsForEntropy(words.length, options.minEntropy);
  } else {
    count = options?.words ?? DEFAULT_WORDS;
  }

  return entropyInfo(words.length, count);
}

/** Get the raw wordlist for a model/tokenizer configuration. */
export function wordlist(options?: Pick<MintIdOptions, 'model' | 'tokenizer'>): string[] {
  const mask = buildMask(options);
  return getWordlist(mask);
}

export type { MintIdOptions, EntropyInfo, Model, Tokenizer, TokenizerAlias } from './types.js';
export { MintIdError, UnknownTokenizerError, UnknownModelError, EmptyWordlistError } from './errors.js';
