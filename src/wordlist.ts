import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

interface WordEntry {
  word: string;
  flags: number;
}

let parsed: WordEntry[] | null = null;
const filteredCache = new Map<number, string[]>();

function loadAll(): WordEntry[] {
  if (parsed) return parsed;
  const dir = typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(dir, '..', 'data', 'words.tsv'), 'utf-8');
  const entries: WordEntry[] = [];
  for (const line of raw.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const tab = line.indexOf('\t');
    if (tab === -1) continue;
    entries.push({
      word: line.slice(0, tab),
      flags: parseInt(line.slice(tab + 1), 10),
    });
  }
  parsed = entries;
  return entries;
}

export function getWordlist(mask: number): string[] {
  if (filteredCache.has(mask)) return filteredCache.get(mask)!;
  const all = loadAll();
  const result = all.filter(w => (w.flags & mask) === mask).map(w => w.word);
  filteredCache.set(mask, result);
  return result;
}
