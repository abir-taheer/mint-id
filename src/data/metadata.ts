// Auto-generated — do not edit

export const TOKENIZERS = ['claude', 'cl100k_base', 'o200k_base', 'gpt2'] as const;

/** Bitmask: which bit corresponds to which tokenizer */
export const TOKENIZER_BITS: Record<string, number> = {
  claude: 1,
  cl100k_base: 2,
  o200k_base: 4,
  gpt2: 8,
};

/** Index into the extended words tuple (offset by 1 since index 0 is the word) */
export const TOKENIZER_INDEX: Record<string, number> = {
  claude: 1,
  cl100k_base: 2,
  o200k_base: 3,
  gpt2: 4,
};

/** Model name → canonical tokenizer */
export const MODELS: Record<string, string> = {
  'claude-opus-4': 'claude',
  'claude-opus-4-6': 'claude',
  'claude-sonnet-4': 'claude',
  'claude-sonnet-4-5': 'claude',
  'claude-haiku-4-5': 'claude',
  'claude-3-5-sonnet': 'claude',
  'claude-3-5-haiku': 'claude',
  'claude-3-opus': 'claude',
  'gpt-4': 'cl100k_base',
  'gpt-4-turbo': 'cl100k_base',
  'gpt-3.5-turbo': 'cl100k_base',
  'gpt-4o': 'o200k_base',
  'gpt-4o-mini': 'o200k_base',
  'o1': 'o200k_base',
  'o1-mini': 'o200k_base',
  'o1-pro': 'o200k_base',
  'o3': 'o200k_base',
  'o3-mini': 'o200k_base',
  'o4-mini': 'o200k_base',
  'gpt-5': 'o200k_base',
  'codex': 'o200k_base',
  'gpt-2': 'gpt2',
  'gpt-3': 'gpt2',
  'code-davinci-002': 'gpt2',
};

/** Tokenizer aliases → canonical name */
export const ALIASES: Record<string, string> = {
  o200k_harmony: 'o200k_base',
  p50k_base: 'gpt2',
  p50k_edit: 'gpt2',
  r50k_base: 'gpt2',
};
