import type { MintIdOptions } from './types.js';
import { UnknownTokenizerError, UnknownModelError } from './errors.js';
import { TOKENIZER_BITS, TOKENIZER_INDEX, MODELS, ALIASES, TOKENIZERS } from './data/metadata.js';

function resolveTokenizerName(name: string): string {
  if (name in TOKENIZER_BITS) return name;
  if (name in ALIASES) return ALIASES[name];
  throw new UnknownTokenizerError(name, [...TOKENIZERS]);
}

function resolveModelName(name: string): string {
  if (name in MODELS) return MODELS[name];
  throw new UnknownModelError(name);
}

export function buildMask(options?: MintIdOptions): number {
  if (!options) return 15; // all bits set = universal

  // tokenizer takes precedence over model
  if (options.tokenizer) {
    const names = Array.isArray(options.tokenizer) ? options.tokenizer : [options.tokenizer];
    let mask = 0;
    for (const name of names) {
      const canonical = resolveTokenizerName(name);
      mask |= TOKENIZER_BITS[canonical];
    }
    return mask;
  }

  if (options.model) {
    const names = Array.isArray(options.model) ? options.model : [options.model];
    let mask = 0;
    for (const name of names) {
      const tokenizer = resolveModelName(name);
      mask |= TOKENIZER_BITS[tokenizer];
    }
    return mask;
  }

  return 15; // default: universal
}

/** Resolve options to an array of tokenizer column indices (1-based, for extended word tuples) */
export function resolveTokenizerIndices(options?: MintIdOptions): number[] {
  if (!options) return [1, 2, 3, 4]; // all tokenizers

  if (options.tokenizer) {
    const names = Array.isArray(options.tokenizer) ? options.tokenizer : [options.tokenizer];
    return names.map(n => TOKENIZER_INDEX[resolveTokenizerName(n)]);
  }

  if (options.model) {
    const names = Array.isArray(options.model) ? options.model : [options.model];
    return names.map(n => TOKENIZER_INDEX[resolveModelName(n)]);
  }

  return [1, 2, 3, 4]; // all tokenizers
}
