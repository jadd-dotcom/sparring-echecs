export type Route =
  | { name: 'home' }
  | { name: 'play' }
  | { name: 'review'; id: number }
  | { name: 'revise' }
  | { name: 'stats' }
  | { name: 'settings' };

export function parse(hash: string): Route {
  const [name, arg] = hash.replace(/^#\/?/, '').split('/');
  if (name === 'review' && arg) return { name: 'review', id: Number(arg) };
  if (name === 'play' || name === 'revise' || name === 'stats' || name === 'settings') return { name };
  return { name: 'home' };
}

export function go(r: Route) {
  location.hash = r.name === 'home' ? '' : r.name === 'review' ? `/review/${r.id}` : `/${r.name}`;
}

