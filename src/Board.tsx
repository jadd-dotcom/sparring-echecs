import { useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, type Square } from 'chess.js';
import type { Color } from './db';

export interface BoardArrow { from: string; to: string; color: string }

interface Props {
  fen: string;
  orientation: Color;
  /** Camp que l'utilisateur peut déplacer (null = plateau figé). */
  movable: Color | null;
  onMove?: (uci: string) => void;
  arrows?: BoardArrow[];
  highlight?: Record<string, string>;
}

const LIGHT = '#eeeed2';
const DARK = '#769656';

export default function Board({ fen, orientation, movable, onMove, arrows = [], highlight = {} }: Props) {
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
    if (!canMove) return;
    const p = chess.get(square as Square);
    if (selected && targets.includes(square)) { tryMove(selected, square); return; }
    if (p && p.color === movable) setSelected(square === selected ? null : square);
    else setSelected(null);
  }

  const squareStyles: Record<string, React.CSSProperties> = {};
  for (const [sq, c] of Object.entries(highlight)) squareStyles[sq] = { background: c };
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
          animationDurationInMs: 200,
        }}
      />
      {promo && (
        <div className="promo" role="dialog" aria-label="Promotion">
          <p>Promotion en :</p>
          <div className="promo-row">
            {([['q', '♛ Dame'], ['r', '♜ Tour'], ['b', '♝ Fou'], ['n', '♞ Cavalier']] as const).map(([k, label]) => (
              <button key={k} onClick={() => { const p = promo; setPromo(null); onMove?.(p.from + p.to + k); }}>{label}</button>
            ))}
          </div>
          <button className="ghost" onClick={() => setPromo(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
}
