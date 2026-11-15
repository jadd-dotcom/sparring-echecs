export type Route =
  | { name: 'home' }
  | { name: 'play'; opening?: string }
  | { name: 'review'; id: number }
  | { name: 'revise'; opening?: string }
  | { name: 'openings' }
  | { name: 'repertoire'; id: string }
  | { name: 'stats' }
  | { name: 'settings' }
  | { name: 'report' };

export function parse(hash: string): Route {
  const [name, arg] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (name === 'review' && arg) return { name: 'review', id: Number(arg) };
  if (name === 'repertoire' && arg) return { name: 'repertoire', id: arg };
  if (name === 'play' || name === 'revise') return arg ? { name, opening: arg } : { name };
  if (name === 'stats' || name === 'settings' || name === 'openings' || name === 'report') return { name };
  return { name: 'home' };
}

export function go(r: Route) {
  const arg = r.name === 'review' ? r.id : r.name === 'repertoire' ? r.id
    : (r.name === 'play' || r.name === 'revise') ? r.opening : undefined;
  location.hash = r.name === 'home' ? '' : `/${r.name}${arg !== undefined ? '/' + encodeURIComponent(String(arg)) : ''}`;
}
