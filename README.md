# mint-id

Cryptographically secure identifiers using single-token dictionary words. Zero runtime dependencies.

```typescript
import { mintId } from 'mint-id';

mintId();
// → "guide_pull_rich_deep_fast_sale_club_warm_bold_true_gain_plan"
```

Every word in the output tokenizes to exactly **1 token** across all major LLM tokenizers. A pre-signed S3 URL costs 229 tokens. A mint-id with equivalent entropy costs 24.

## Install

```bash
npm install mint-id
```

## Quick Start

```typescript
import { mintId, entropy, wordlist } from 'mint-id';

// Default: 12 words, ~133 bits entropy, universal compatibility
mintId();

// Optimize for a specific model (larger wordlist = more entropy per word)
mintId({ model: 'claude-opus-4-6' });

// Target a minimum entropy level
mintId({ minEntropy: 256 });

// Customize format
mintId({ words: 8, delimiter: '-' });
```

## API

### `mintId(options?): string`

Generate a cryptographically secure identifier.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `words` | `number` | `12` | Number of words. Ignored if `minEntropy` is set. |
| `minEntropy` | `number` | — | Minimum bits of entropy. Overrides `words`. |
| `delimiter` | `string` | `'_'` | Separator between words. |
| `model` | `string \| string[]` | — | Model(s) to optimize for. |
| `tokenizer` | `string \| string[]` | — | Tokenizer(s) to target. Takes precedence over `model`. |

When no `model` or `tokenizer` is specified, uses the **universal** wordlist (words that are single-token in all supported tokenizers).

When multiple models or tokenizers are specified, uses words that are single-token in **all** of them (intersection).

### `entropy(options?): EntropyInfo`

Calculate entropy for a given configuration without generating an ID.

```typescript
entropy();
// → { bits: 133.4, poolSize: 2220, bitsPerWord: 11.12, words: 12 }

entropy({ model: 'claude-opus-4-6' });
// → { bits: 154.8, poolSize: 7629, bitsPerWord: 12.9, words: 12 }
```

### `wordlist(options?): string[]`

Get the raw wordlist for a model/tokenizer configuration.

```typescript
wordlist().length;                          // 2220 (universal)
wordlist({ model: 'claude-opus-4-6' }).length; // 7629
wordlist({ tokenizer: 'gpt2' }).length;     // 3495
```

## Error Classes

All errors extend `MintIdError` for easy catch-all handling:

```typescript
import { UnknownModelError, UnknownTokenizerError, EmptyWordlistError } from 'mint-id';

try {
  mintId({ model: 'nonexistent' });
} catch (e) {
  if (e instanceof UnknownModelError) {
    console.log(e.model); // "nonexistent"
  }
}
```

| Class | Thrown when |
|-------|-----------|
| `UnknownModelError` | Unrecognized model name |
| `UnknownTokenizerError` | Unrecognized tokenizer name |
| `EmptyWordlistError` | Wordlist is empty after filtering |

## Supported Models & Tokenizers

| Model | Tokenizer | Pool size | Bits/word |
|-------|-----------|-----------|-----------|
| `claude-opus-4-6`, `claude-sonnet-4-5`, `claude-haiku-4-5`, etc. | `claude` | 7,629 | 12.90 |
| `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo` | `cl100k_base` | 4,914 | 12.26 |
| `gpt-4o`, `gpt-5`, `o1`, `o3`, `o4-mini`, etc. | `o200k_base` | 5,640 | 12.46 |
| `gpt-2`, `gpt-3` | `gpt2` | 3,495 | 11.77 |
| *(default — all models)* | universal | 2,220 | 11.12 |

**Tokenizer aliases**: `o200k_harmony` → `o200k_base`, `p50k_base`/`p50k_edit`/`r50k_base` → `gpt2`

## Why Single-Token Words?

LLM tokenizers split text into tokens. Most English words tokenize to 1 token, but random hex/UUIDs tokenize poorly:

| Identifier type | Example | Tokens | Entropy (bits) | Bits/token |
|-----------------|---------|--------|----------------|------------|
| Pre-signed S3 URL | `https://bucket.s3...&Signature=abc123` | 229 | ~330 | 1.44 |
| UUID v4 | `550e8400-e29b-41d4-a716-446655440000` | 25 | 122 | 4.88 |
| SHA-256 (hex) | `e3b0c44298fc1c149afb...` | 43 | 256 | 5.95 |
| **mint-id (12 words)** | `guide_pull_rich_deep_fast_sale_...` | **24** | **133** | **5.56** |
| **mint-id (6 words, claude)** | `guide_pull_rich_deep_fast_sale` | **12** | **77** | **6.44** |

Single-token words achieve **5.5–6.4 bits per token** vs UUIDs at 4.9 bits/token. Over thousands of API calls, this saves significant token budget.

### Token Budget Formula

```
Total tokens = base_tokens + (2 × word_count)
```

Where `base_tokens` accounts for the delimiter overhead. For underscore-delimited IDs:
- 6-word ID: ~12 tokens
- 12-word ID: ~24 tokens

## Entropy Guide

| Words | Bits (universal) | Comparable to | Use case |
|-------|-----------------|---------------|----------|
| 4 | 44.5 | — | Short-lived, internal |
| 6 | 66.7 | — | Temporary URLs, session IDs |
| 8 | 89.0 | — | API keys, medium-term |
| 10 | 111.2 | — | Long-lived identifiers |
| 12 | 133.4 | UUID v4 (122 bits) | **Default.** General purpose |
| 16 | 177.9 | — | High security |
| 23 | 255.8 | SHA-256 | Maximum security |

## Security

- **CSPRNG**: Uses Node.js `crypto.randomInt()` exclusively. No `Math.random()`.
- **Diceware principle**: Security depends on pool size and word count, not on keeping the wordlist secret.
- **What an attacker knows**: The wordlist (it's public), the number of words, the delimiter.
- **What an attacker doesn't know**: Which words were selected (chosen by OS CSPRNG).
- **Brute force**: 2,220^12 ≈ 2^133 combinations at default settings.

## Data Source

Wordlists are generated from `/usr/share/dict/words` (macOS, 235,976 entries), filtered to words that are length >= 3 and tokenize to exactly 1 token. Token counts are verified against:

- **Claude**: Anthropic token counting API
- **cl100k_base**: tiktoken (GPT-4, GPT-3.5)
- **o200k_base**: tiktoken (GPT-4o, GPT-5, o-series)
- **gpt2**: tiktoken (GPT-2, GPT-3)

Source data and export scripts live in [token-counter](https://github.com/abir-taheer/token-counter).

## License

MIT
