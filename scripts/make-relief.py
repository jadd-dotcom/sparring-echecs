import re, os
SRC, OUT = 'public/pieces/cburnett', 'public/pieces/relief'
L = ['#ffffff', '#f1f1f1', '#c4c4c4']
D = ['#808080', '#3c3c3c', '#0e0e0e']
FILTER = ('<filter id="sh" x="-25%" y="-25%" width="150%"'
  ' height="150%"><feGaussianBlur in="SourceAlpha"'
  ' stdDeviation="0.8"/><feOffset dx="0.6" dy="1.1"'
  ' result="o"/><feComponentTransfer in="o" result="s">'
  '<feFuncA type="linear" slope="0.5"/>'
  '</feComponentTransfer><feMerge><feMergeNode in="s"/>'
  '<feMergeNode in="SourceGraphic"/></feMerge></filter>')
def grad(i, c):
  s = ''.join(f'<stop offset="{o}" stop-color="{k}"/>'
              for o, k in zip(['0', '0.45', '1'], c))
  return (f'<linearGradient id="{i}" x1="0.15" y1="0"'
          f' x2="0.85" y2="1">{s}</linearGradient>')
os.makedirs(OUT, exist_ok=True)
for f in sorted(os.listdir(SRC)):
  if not f.endswith('.svg'): continue
  svg = open(os.path.join(SRC, f)).read()
  w = f.startswith('w')
  if w: svg = re.sub(r'fill="#fff(fff)?"', 'fill="url(#L)"', svg)
  else: svg = re.sub(r'fill="#000(000)?"', 'fill="url(#D)"', svg)
  h, b, t = re.match(r'(<svg[^>]*>)(.*)(</svg>)\s*$',
                     svg, re.S).groups()
  defs = '<defs>' + grad('L', L) + grad('D', D) + FILTER + '</defs>'
  g = '<g filter="url(#sh)"' + ('' if w else ' fill="url(#D)"') + '>'
  open(os.path.join(OUT, f), 'w').write(h + defs + g + b + '</g>' + t)
