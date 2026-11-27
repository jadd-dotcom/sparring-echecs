import type { MateLevelId } from './lib/mates';

export type BoardView = 'lesson' | 'ex' | 'warmup' | 'replay' | 'blind';
export type BoardMode = 'practice' | 'test' | 'review';

export type Route =
  | { name: 'home' }
  | { name: 'play'; opening?: string; unrated?: boolean }
  | { name: 'review'; id: number }
  | { name: 'revise'; opening?: string }
  | { name: 'cards' }
  | { name: 'lines'; id: string }
  | { name: 'comment'; id?: number }
  | { name: 'openings' }
  | { name: 'repertoire'; id: string }
  | { name: 'stats' }
  | { name: 'settings' }
  | { name: 'report' }
  | { name: 'lesson'; id: string; part?: string }
  | { name: 'mates'; level?: MateLevelId; mode?: 'lesson' | 'play' }
  | { name: 'traps'; id?: string; mode?: 'defend' | 'punish' }
  | { name: 'board'; view?: BoardView; chapter?: number; id?: string; mode?: BoardMode };

export function parse(fullHash: string): Route {
  const [hash, query = ''] = fullHash.split('?');
  const [name, arg] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (name === 'play') return { name, ...(arg ? { opening: arg } : {}), ...(query.split('&').includes('nc') ? { unrated: true } : {}) };
  if (name === 'review' && arg) return { name: 'review', id: Number(arg) };
  if (name === 'comment') return arg ? { name, id: Number(arg) } : { name };
  if (name === 'repertoire' && arg) return { name: 'repertoire', id: arg };
  if (name === 'lines' && arg) return { name: 'lines', id: arg };
  if (name === 'lesson' && arg) {
    const part = hash.replace(/^#\/?/, '').split('/')[2];
    return part ? { name: 'lesson', id: arg, part: decodeURIComponent(part) } : { name: 'lesson', id: arg };
  }
  if (name === 'play' || name === 'revise') return arg ? { name, opening: arg } : { name };
  if (name === 'mates') {
    const mode = hash.replace(/^#\/?/, '').split('/')[2];
    return arg && (mode === 'lesson' || mode === 'play') ? { name, level: arg as MateLevelId, mode } : { name };
  }
  if (name === 'traps') {
    const mode = hash.replace(/^#\/?/, '').split('/')[2];
    return arg ? { name, id: arg, ...(mode === 'defend' || mode === 'punish' ? { mode } : {}) } : { name };
  }
  if (name === 'board') {
    const parts = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    const view = parts[1] as BoardView | undefined;
    if (view === 'lesson' && parts[2]) return { name, view, chapter: Number(parts[2]) };
    if (view === 'ex' && parts[2]) return { name, view, id: parts[2], mode: (['practice', 'test', 'review'].includes(parts[3]) ? parts[3] : 'test') as BoardMode };
    if (view === 'warmup' || view === 'blind') return { name, view };
    if (view === 'replay') return { name, view, ...(parts[2] ? { mode: parts[2] as BoardMode } : {}) };
    return { name };
  }
  if (name === 'stats' || name === 'settings' || name === 'openings' || name === 'report' || name === 'cards') return { name };
  return { name: 'home' };
}

export function go(r: Route) {
  const arg = r.name === 'review' || r.name === 'comment' ? r.id : r.name === 'repertoire' || r.name === 'lesson' || r.name === 'lines' ? r.id
    : (r.name === 'play' || r.name === 'revise') ? r.opening : undefined;
  if (r.name === 'lesson' && r.part) { location.hash = `/lesson/${encodeURIComponent(r.id)}/${encodeURIComponent(r.part)}`; return; }
  if (r.name === 'play') { location.hash = `/play${r.opening ? '/' + encodeURIComponent(r.opening) : ''}${r.unrated ? '?nc' : ''}`; return; }
  if (r.name === 'traps') { location.hash = `/traps${r.id ? '/' + encodeURIComponent(r.id) + (r.mode ? '/' + r.mode : '') : ''}`; return; }
  if (r.name === 'mates') { location.hash = r.level && r.mode ? `/mates/${r.level}/${r.mode}` : '/mates'; return; }
  if (r.name === 'board') {
    location.hash = r.view === 'lesson' ? `/board/lesson/${r.chapter}` : r.view === 'ex' ? `/board/ex/${r.id}/${r.mode ?? 'test'}`
      : r.view === 'replay' ? `/board/replay${r.mode ? '/' + r.mode : ''}` : r.view ? `/board/${r.view}` : '/board';
    return;
  }
  location.hash = r.name === 'home' ? '' : `/${r.name}${arg !== undefined ? '/' + encodeURIComponent(String(arg)) : ''}`;
}
