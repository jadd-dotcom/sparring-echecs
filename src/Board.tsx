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
  /** Partie à l'aveugle : pièces cachées (cases visibles), aucune aide (cases possibles, échec) ; on joue en touchant
   *  la case de départ puis la case d'arrivée, n'importe lesquelles ; un coup impossible appelle `onIllegal`. */
  hidePieces?: boolean;
  onIllegal?: (from: string, to: string) => void;
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
      <img src={pieceUrl(set, c)} alt="" draggable={false} className="piece-img" data-set={set} />
    )]));
    piecesCache.set(set, r);
  }
  return r;
}
/** Pièces invisibles (partie à l'aveugle) : la case reste cliquable. */
const HIDDEN_PIECES: Record<string, () => React.JSX.Element> = Object.fromEntries(CODES.map((c) => [c, () => <div className="piece-hidden" />]));
const PROMO: [string, string][] = [['q', 'Dame'], ['r', 'Tour'], ['b', 'Fou'], ['n', 'Cavalier']];
const COORD: React.CSSProperties = {
  // Taille proportionnelle à l'échiquier (cqw : .board-wrap est un conteneur) : ~15 % de la case.
  fontSize: 'clamp(7px, 1.8cqw, 12px)', fontWeight: 700, lineHeight: 1, position: 'absolute', zIndex: 3,
  opacity: 0.9, userSelect: 'none', pointerEvents: 'none',
};

export default function Board({ fen, orientation, movable, onMove, arrows = [], highlight = {}, badges = {}, lastMove, onTap, hidePieces, onIllegal }: Props) {
  const { pieces: pieceSet } = usePrefs();
  const [selected, setSelected] = useState<string | null>(null);
  const [promo, setPromo] = useState<{ from: string; to: string } | null>(null);
  const chess = useMemo(() => new Chess(fen), [fen]);
  const canMove = movable !== null && chess.turn() === movable && !chess.isGameOver();

  const targets = useMemo(() => {
    if (!selected || !canMove || hidePieces) return [] as string[];
    return chess.moves({ square: selected as Square, verbose: true }).map((m) => m.to);
  }, [selected, chess, canMove, hidePieces]);

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
    if (hidePieces) {
      // À l'aveugle : 1er toucher = case de départ (quelle qu'elle soit), 2e = case d'arrivée.
      if (!selected) { setSelected(square); return; }
      if (square === selected) { setSelected(null); return; }
      const from = selected;
      if (!tryMove(from, square)) { setSelected(null); onIllegal?.(from, square); }
      return;
    }
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
  if (chess.inCheck() && !hidePieces) {
    const king = chess.board().flat().find((p) => p && p.type === 'k' && p.color === chess.turn());
    // Échec : halo rouge, posé par-dessus un éventuel surlignage (ex. indice « pièce à jouer » sur le roi).
    const hl = king ? highlight[king.square] : undefined;
    if (king) squareStyles[king.square] = { background: `radial-gradient(rgba(220,0,0,.75), transparent 75%)${hl ? `, ${hl}` : ''}` };
  }

  return (
    <div className="board-wrap">
      <Chessboard
        options={{
          position: fen,
          boardOrientation: orientation === 'w' ? 'white' : 'black',
          allowDragging: canMove && !hidePieces,
          allowDrawingArrows: false,
          canDragPiece: ({ piece }) => canMove && piece.pieceType[0] === movable,
          onPieceDrop: ({ sourceSquare, targetSquare }) => (targetSquare ? tryMove(sourceSquare, targetSquare) : false),
          onPieceClick: ({ square }) => square && onSquareClick(square),
          onSquareClick: ({ square }) => onSquareClick(square),
          squareStyles,
          arrows: arrows.map((a) => ({ startSquare: a.from, endSquare: a.to, color: a.color })),
          lightSquareStyle: { backgroundColor: LIGHT },
          darkSquareStyle: { backgroundColor: DARK },
          pieces: hidePieces ? HIDDEN_PIECES : piecesFor(pieceSet),
          // Bords arrondis (l'ombre est sur .board-wrap).
          boardStyle: { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', overflow: 'hidden', width: '100%', height: '100%', position: 'relative', borderRadius: 6 },
          // Coordonnées discrètes, petites, tout au coin des cases du bord et au premier plan ; les pièces occupent
          // 87 % de la case (.piece-img) : les deux ne se chevauchent pas (vérifié au pixel par tests/coords.cjs).
          lightSquareNotationStyle: { color: DARK },
          darkSquareNotationStyle: { color: LIGHT },
          alphaNotationStyle: { ...COORD, bottom: 0, right: 1 },
          numericNotationStyle: { ...COORD, top: 0, left: 1 },
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
