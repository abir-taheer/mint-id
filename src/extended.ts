import type { MintIdOptions, EntropyInfo } from './types.js';
import { resolveTokenizerIndices } from './resolve.js';
import { getExtendedWordlist } from './wordlist-extended.js';
import { wordsForEntropy, entropyInfo } from './entropy.js';
import { generate } from './generate.js';

const DEFAULT_WORDS = 12;
const DEFAULT_DELIMITER = '_';
const DEFAULT_MAX_TOKENS = 1;

function getWords(options?: MintIdOptions): string[] {
  const indices = resolveTokenizerIndices(options);
  const maxTokens = options?.maxTokens ?? DEFAULT_MAX_TOKENS;
  return getExtendedWordlist(indices, maxTokens);
}

function getCount(poolSize: number, options?: MintIdOptions): number {
  if (options?.minEntropy) {
    return wordsForEntropy(poolSize, options.minEntropy);
  }
  return options?.words ?? DEFAULT_WORDS;
}

/** Generate a cryptographically secure identifier using single-token words. */
export function mintId(options?: MintIdOptions): string {
  const words = getWords(options);
  const delimiter = options?.delimiter ?? DEFAULT_DELIMITER;
  const count = getCount(words.length, options);
  return generate(words, count, delimiter);
}

/** Calculate entropy for a given configuration. */
export function entropy(options?: Pick<MintIdOptions, 'words' | 'model' | 'tokenizer' | 'minEntropy' | 'maxTokens'>): EntropyInfo {
  const words = getWords(options);
  const count = getCount(words.length, options);
  return entropyInfo(words.length, count);
}

/** Get the raw wordlist for a model/tokenizer configuration. */
export function wordlist(options?: Pick<MintIdOptions, 'model' | 'tokenizer' | 'maxTokens'>): string[] {
  return getWords(options);
}

export type { MintIdOptions, EntropyInfo, Model, Tokenizer, TokenizerAlias } from './types.js';
export { MintIdError, UnknownTokenizerError, UnknownModelError, EmptyWordlistError } from './errors.js';
