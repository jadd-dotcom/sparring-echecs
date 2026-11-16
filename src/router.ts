import type { MateLevelId } from './lib/mates';

export type Route =
  | { name: 'home' }
  | { name: 'play'; opening?: string; unrated?: boolean }
  | { name: 'review'; id: number }
  | { name: 'revise'; opening?: string }
  | { name: 'openings' }
  | { name: 'repertoire'; id: string }
  | { name: 'stats' }
  | { name: 'settings' }
  | { name: 'report' }
  | { name: 'mates'; level?: MateLevelId; mode?: 'lesson' | 'play' };

export function parse(fullHash: string): Route {
  const [hash, query = ''] = fullHash.split('?');
  const [name, arg] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (name === 'play') return { name, ...(arg ? { opening: arg } : {}), ...(query.split('&').includes('nc') ? { unrated: true } : {}) };
  if (name === 'review' && arg) return { name: 'review', id: Number(arg) };
  if (name === 'repertoire' && arg) return { name: 'repertoire', id: arg };
  if (name === 'play' || name === 'revise') return arg ? { name, opening: arg } : { name };
  if (name === 'mates') {
    const mode = hash.replace(/^#\/?/, '').split('/')[2];
    return arg && (mode === 'lesson' || mode === 'play') ? { name, level: arg as MateLevelId, mode } : { name };
  }
  if (name === 'stats' || name === 'settings' || name === 'openings' || name === 'report') return { name };
  return { name: 'home' };
}

export function go(r: Route) {
  const arg = r.name === 'review' ? r.id : r.name === 'repertoire' ? r.id
    : (r.name === 'play' || r.name === 'revise') ? r.opening : undefined;
  if (r.name === 'play') { location.hash = `/play${r.opening ? '/' + encodeURIComponent(r.opening) : ''}${r.unrated ? '?nc' : ''}`; return; }
  if (r.name === 'mates') { location.hash = r.level && r.mode ? `/mates/${r.level}/${r.mode}` : '/mates'; return; }
  location.hash = r.name === 'home' ? '' : `/${r.name}${arg !== undefined ? '/' + encodeURIComponent(String(arg)) : ''}`;
}
