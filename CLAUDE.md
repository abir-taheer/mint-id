# mint-id

CSPRNG identifiers using single-token dictionary words. Zero runtime deps. No fs — works in CF Workers, Deno, browsers.

## Structure
- `src/index.ts` — default entry point (mintId, entropy, wordlist) — single-token words only
- `src/extended.ts` — extended entry point — all 234k words, supports maxTokens
- `src/generate.ts` — CSPRNG word selection (crypto.randomInt)
- `src/wordlist.ts` — bitmask filtering for single-token words
- `src/wordlist-extended.ts` — token-count filtering for extended words
- `src/resolve.ts` — model/tokenizer name resolution
- `src/entropy.ts` — entropy math (pure functions)
- `src/types.ts` — all TypeScript types
- `src/errors.ts` — error classes (MintIdError, UnknownTokenizerError, UnknownModelError, EmptyWordlistError)
- `src/data/words.ts` — single-token word data (10k words, DO NOT EDIT — generated)
- `src/data/extended-words.ts` — all words with per-tokenizer counts (234k, DO NOT EDIT — generated)
- `src/data/metadata.ts` — tokenizer config, model map, aliases

## Key Decisions
- Data embedded as JS modules — no fs, tree-shakeable by bundlers
- Two entry points: `mint-id` (173KB) and `mint-id/extended` (6.6MB) — bundler only includes what you import
- crypto.randomInt() only — never Math.random()
- Zero runtime dependencies
- Universal wordlist (default) = intersection of all 4 tokenizer families
- Default 12 words (~133 bits entropy)

## Commands
- `npm run build` — tsup (CJS + ESM + .d.ts, two entry points)
- `npm test` — vitest
- `npm run type-check` — tsc --noEmit

## Regenerating word data
1. Run `python3 token-counter/scripts/export_ts_modules.py`
2. This overwrites `src/data/words.ts` and `src/data/extended-words.ts`

## Adding a tokenizer
1. Add column to token-counter/data/tokens.db
2. Update `scripts/export_ts_modules.py` with new column
3. Run the script to regenerate src/data/*.ts
4. Update `src/data/metadata.ts` with new bit/index assignments
5. Add types to src/types.ts
