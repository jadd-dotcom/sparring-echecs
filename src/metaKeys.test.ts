// Garde-fou : toute clé de la table meta lue ou écrite dans src/ est déclarée dans le registre (src/metaKeys.ts).
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { META_KEYS, META_PATTERNS, isKnownMetaKey } from './metaKeys';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return files(p);
    return /\.(ts|tsx)$/.test(f) && !/\.test\.ts$/.test(f) ? [p] : [];
  });
}

/** Clés trouvées dans le code : littéraux passés à db.meta / getMeta / putMeta, constantes de clé, préfixes construits. */
function keysInCode(): { fixed: Set<string>; patterns: Set<string> } {
  const fixed = new Set<string>();
  const patterns = new Set<string>();
  for (const f of files('src')) {
    const s = readFileSync(f, 'utf8');
    if (!/db\.meta|getMeta|putMeta/.test(s)) continue;
    for (const m of s.matchAll(/(?:meta\.(?:get|delete)|getMeta|putMeta)\(\s*'([^']+)'/g)) fixed.add(m[1]);
    for (const m of s.matchAll(/meta\.put\(\{\s*key:\s*'([^']+)'/g)) fixed.add(m[1]);
    for (const m of s.matchAll(/const (?:KEY|P_KEY|S_KEY|SCANNED|LAST_KEY) = '([^']+)'/g)) fixed.add(m[1]);
    for (const m of s.matchAll(/`([a-zA-Z]+:)\$\{/g)) if (/key/i.test(s.slice(Math.max(0, m.index! - 40), m.index!))) patterns.add(m[1]);
  }
  fixed.delete('seance'); // clé de sessionStorage, pas de la table meta (sessionService.ts)
  return { fixed, patterns };
}

describe('registre des clés meta', () => {
  const { fixed, patterns } = keysInCode();
  it('27 clés fixes (les 25 de l’audit + lastBackupAt + examResults) et 2 motifs', () => {
    expect(META_KEYS).toHaveLength(27);
    expect(META_PATTERNS).toEqual(['lessonState:', 'crossroads:']);
  });
  it('aucune clé du code hors registre', () => {
    for (const k of fixed) expect(isKnownMetaKey(k), k).toBe(true);
    for (const p of patterns) expect(META_PATTERNS as readonly string[], p).toContain(p);
  });
  it('chaque clé du registre est utilisée dans le code', () => {
    for (const k of META_KEYS) expect(fixed.has(k), k).toBe(true);
    for (const p of META_PATTERNS) expect(patterns.has(p), p).toBe(true);
  });
});
