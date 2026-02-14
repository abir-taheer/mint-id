# mint-id

CSPRNG identifiers using single-token dictionary words. Zero runtime deps.

## Structure
- `src/index.ts` — public API (mintId, entropy, wordlist)
- `src/generate.ts` — CSPRNG word selection (crypto.randomInt)
- `src/wordlist.ts` — TSV loader with bitmask filtering
- `src/resolve.ts` — model/tokenizer name resolution
- `src/entropy.ts` — entropy math (pure functions)
- `src/types.ts` — all TypeScript types
- `src/errors.ts` — error classes (MintIdError, UnknownTokenizerError, UnknownModelError, EmptyWordlistError)
- `data/words.tsv` — bitmask wordlist (DO NOT EDIT MANUALLY, generated from token-counter/data/tokens.db)
- `data/metadata.json` — tokenizer schema, model map

## Key Decisions
- TSV bitmask format: each word stored once, integer flag for tokenizer compatibility
- crypto.randomInt() only — never Math.random()
- Zero runtime dependencies
- Universal wordlist (default) = intersection of all 4 tokenizer families
- Default 12 words (~133 bits entropy)

## Commands
- `npm run build` — tsup (CJS + ESM + .d.ts)
- `npm test` — vitest
- `npm run type-check` — tsc --noEmit

## Adding a tokenizer
1. Add column to token-counter/data/tokens.db
2. Run token-counter/scripts/export_tsv.py
3. Copy words.tsv + metadata.json to data/
4. Add types to src/types.ts
5. Update bit assignments in src/resolve.ts
