import { useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, type Square } from 'chess.js';
import type { Color } from './db';
import type { MoveClass } from './lib/moveClass';
import { ClassBadge } from './icons';
import { pieceUrl, usePrefs, type PieceSet } from './prefs';

export interface BoardArrow { from: string; to: string; color: string }

interface Props {
  fen: string;
  orientation: Color;
  /** Camp que l'utilisateur peut déplacer (null = plateau figé). */
  movable: Color | null;
  onMove?: (uci: string) => void;
  arrows?: BoardArrow[];
  highlight?: Record<string, string>;
  /** Pastille sur une case (classe du coup sur la case d'arrivée). */
  badges?: Record<string, MoveClass>;
  /** Dernier coup, surligné de façon contrastée (cases de départ et d'arrivée). */
  lastMove?: { from: string; to: string } | null;
  /** Tap sur l'échiquier quand il est bloqué (ex. revenir à la position actuelle). */
  onTap?: () => void;
}

// Couleurs de l'échiquier (propres à l'appli).
const LIGHT = '#ecebd5';
const DARK = '#7c9a5e';
const CODES = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];

/** Rendu des pièces : images SVG du jeu choisi (servies avec l'appli, hors ligne). */
const piecesCache = new Map<PieceSet, Record<string, () => React.JSX.Element>>();
function piecesFor(set: PieceSet) {
  let r = piecesCache.get(set);
  if (!r) {
    r = Object.fromEntries(CODES.map((c) => [c, () => (
      <img src={pieceUrl(set, c)} alt="" draggable={false} className="piece-img" />
    )]));
    piecesCache.set(set, r);
  }
  return r;
}
const PROMO: [string, string][] = [['q', 'Dame'], ['r', 'Tour'], ['b', 'Fou'], ['n', 'Cavalier']];

export default function Board({ fen, orientation, movable, onMove, arrows = [], highlight = {}, badges = {}, lastMove, onTap }: Props) {
  const { pieces: pieceSet } = usePrefs();
  const [selected, setSelected] = useState<string | null>(null);
  const [promo, setPromo] = useState<{ from: string; to: string } | null>(null);
  const chess = useMemo(() => new Chess(fen), [fen]);
  const canMove = movable !== null && chess.turn() === movable && !chess.isGameOver();

  const targets = useMemo(() => {
    if (!selected || !canMove) return [] as string[];
    return chess.moves({ square: selected as Square, verbose: true }).map((m) => m.to);
  }, [selected, chess, canMove]);

  function tryMove(from: string, to: string): boolean {
    if (!canMove) return false;
    const legal = chess.moves({ square: from as Square, verbose: true }).filter((m) => m.to === to);
    if (legal.length === 0) return false;
    setSelected(null);
    if (legal.some((m) => m.promotion)) { setPromo({ from, to }); return true; }
    onMove?.(from + to);
    return true;
  }

  function onSquareClick(square: string) {
    if (!canMove) { onTap?.(); return; }
    const p = chess.get(square as Square);
    if (selected && targets.includes(square)) { tryMove(selected, square); return; }
    if (p && p.color === movable) setSelected(square === selected ? null : square);
    else setSelected(null);
  }

  const squareStyles: Record<string, React.CSSProperties> = {};
  if (lastMove) {
    squareStyles[lastMove.from] = { background: 'rgba(255, 200, 0, .45)', boxShadow: 'inset 0 0 0 3px rgba(214, 150, 0, .85)' };
    squareStyles[lastMove.to] = { background: 'rgba(255, 200, 0, .7)', boxShadow: 'inset 0 0 0 3px rgba(214, 150, 0, .95)' };
  }
  for (const [sq, c] of Object.entries(highlight)) squareStyles[sq] = { ...squareStyles[sq], background: c };
  if (selected) squareStyles[selected] = { background: 'rgba(255, 213, 0, 0.55)' };
  for (const t of targets) {
    const occupied = !!chess.get(t as Square);
    squareStyles[t] = {
      ...squareStyles[t],
      background: occupied
        ? 'radial-gradient(transparent 58%, rgba(0,0,0,.28) 60%)'
        : 'radial-gradient(rgba(0,0,0,.25) 22%, transparent 24%)',
    };
  }
  if (chess.inCheck()) {
    const king = chess.board().flat().find((p) => p && p.type === 'k' && p.color === chess.turn());
    if (king) squareStyles[king.square] = { background: 'radial-gradient(rgba(220,0,0,.75), transparent 75%)' };
  }

  return (
    <div className="board-wrap">
      <Chessboard
        options={{
          position: fen,
          boardOrientation: orientation === 'w' ? 'white' : 'black',
          allowDragging: canMove,
          allowDrawingArrows: false,
          canDragPiece: ({ piece }) => canMove && piece.pieceType[0] === movable,
          onPieceDrop: ({ sourceSquare, targetSquare }) => (targetSquare ? tryMove(sourceSquare, targetSquare) : false),
          onPieceClick: ({ square }) => square && onSquareClick(square),
          onSquareClick: ({ square }) => onSquareClick(square),
          squareStyles,
          arrows: arrows.map((a) => ({ startSquare: a.from, endSquare: a.to, color: a.color })),
          lightSquareStyle: { backgroundColor: LIGHT },
          darkSquareStyle: { backgroundColor: DARK },
          pieces: piecesFor(pieceSet),
          // Bords arrondis (l'ombre est sur .board-wrap).
          boardStyle: { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', overflow: 'hidden', width: '100%', height: '100%', position: 'relative', borderRadius: 10 },
          // Coordonnées discrètes dans les cases du bord.
          lightSquareNotationStyle: { color: DARK },
          darkSquareNotationStyle: { color: LIGHT },
          alphaNotationStyle: { fontSize: 'clamp(9px, 1.5vmin, 13px)', fontWeight: 700, position: 'absolute', bottom: 1, right: 3, opacity: 0.9, userSelect: 'none' },
          numericNotationStyle: { fontSize: 'clamp(9px, 1.5vmin, 13px)', fontWeight: 700, position: 'absolute', top: 1, left: 3, opacity: 0.9, userSelect: 'none' },
          // Pièce saisie : un peu plus grande, avec une ombre.
          draggingPieceStyle: { transform: 'scale(1.22)', filter: 'drop-shadow(0 10px 8px rgba(0,0,0,.45))' },
          draggingPieceGhostStyle: { opacity: 0.35 },
          dropSquareStyle: { boxShadow: 'inset 0 0 0 4px rgba(255,255,255,.75)' },
          animationDurationInMs: 200,
          squareRenderer: ({ square, children }) => {
            const b = badges[square];
            if (!b) return null as unknown as React.JSX.Element; // rendu par défaut
            return (
              <div style={{ width: '100%', height: '100%', position: 'relative', ...squareStyles[square] }}>
                {children}
                <span className="sq-badge"><ClassBadge cls={b} size={30} /></span>
              </div>
            );
          },
        }}
      />
      {promo && (
        <div className="promo" role="dialog" aria-label="Promotion">
          <p>Promotion en :</p>
          <div className="promo-row">
            {PROMO.map(([k, label]) => (
              <button key={k} onClick={() => { const p = promo; setPromo(null); onMove?.(p.from + p.to + k); }}>
                <img src={pieceUrl(pieceSet, (movable ?? 'w') + k.toUpperCase())} alt="" className="promo-piece" /> {label}
              </button>
            ))}
          </div>
          <button className="ghost" onClick={() => setPromo(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
}
