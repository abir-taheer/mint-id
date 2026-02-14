/** Canonical tokenizer families (4 distinct tokenizers) */
export type Tokenizer = 'claude' | 'cl100k_base' | 'o200k_base' | 'gpt2';

/** Tokenizer aliases that map to canonical names */
export type TokenizerAlias = 'o200k_harmony' | 'p50k_base' | 'p50k_edit' | 'r50k_base';

/** Known model names with autocomplete (arbitrary strings also accepted) */
export type Model =
  | 'claude-opus-4' | 'claude-opus-4-6' | 'claude-sonnet-4' | 'claude-sonnet-4-5'
  | 'claude-haiku-4-5' | 'claude-3-5-sonnet' | 'claude-3-5-haiku' | 'claude-3-opus'
  | 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo'
  | 'gpt-4o' | 'gpt-4o-mini' | 'o1' | 'o1-mini' | 'o1-pro' | 'o3' | 'o3-mini' | 'o4-mini'
  | 'gpt-5' | 'codex'
  | 'gpt-2' | 'gpt-3'
  | (string & {});

export interface MintIdOptions {
  /** Number of words (default: 6). Ignored if minEntropy is set. */
  words?: number;
  /** Minimum bits of entropy. Overrides `words` — auto-calculates word count. */
  minEntropy?: number;
  /** Delimiter between words (default: '_') */
  delimiter?: string;
  /** Model(s) to optimize for. Resolves to tokenizer(s). */
  model?: Model | Model[];
  /** Tokenizer(s) to optimize for. Takes precedence over model. */
  tokenizer?: (Tokenizer | TokenizerAlias | (string & {})) | (Tokenizer | TokenizerAlias | (string & {}))[];
}

export interface EntropyInfo {
  /** Bits of entropy */
  bits: number;
  /** Number of words in the pool */
  poolSize: number;
  /** Bits per word */
  bitsPerWord: number;
  /** Number of words used */
  words: number;
}
