import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MintIdOptions } from './types.js';
import { UnknownTokenizerError, UnknownModelError } from './errors.js';

interface Metadata {
  bitmask: Record<string, string>;
  models: Record<string, string>;
  aliases: Record<string, string>;
  tokenizers: string[];
}

const TOKENIZER_BITS: Record<string, number> = {
  claude: 1,
  cl100k_base: 2,
  o200k_base: 4,
  gpt2: 8,
};

let metadata: Metadata | null = null;

function loadMetadata(): Metadata {
  if (metadata) return metadata;
  const dir = typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(dir, '..', 'data', 'metadata.json'), 'utf-8');
  metadata = JSON.parse(raw) as Metadata;
  return metadata;
}

function resolveTokenizerName(name: string): string {
  const meta = loadMetadata();
  if (name in TOKENIZER_BITS) return name;
  if (name in meta.aliases) return meta.aliases[name];
  throw new UnknownTokenizerError(name, meta.tokenizers);
}

function resolveModelName(name: string): string {
  const meta = loadMetadata();
  if (name in meta.models) return meta.models[name];
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
      const bit = TOKENIZER_BITS[canonical];
      if (bit === undefined) {
        throw new Error(`No bitmask defined for tokenizer: "${canonical}"`);
      }
      mask |= bit;
    }
    return mask;
  }

  if (options.model) {
    const names = Array.isArray(options.model) ? options.model : [options.model];
    let mask = 0;
    for (const name of names) {
      const tokenizer = resolveModelName(name);
      const bit = TOKENIZER_BITS[tokenizer];
      if (bit === undefined) {
        throw new Error(`No bitmask defined for tokenizer: "${tokenizer}"`);
      }
      mask |= bit;
    }
    return mask;
  }

  return 15; // default: universal
}
