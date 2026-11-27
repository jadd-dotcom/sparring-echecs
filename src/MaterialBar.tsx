// Matériel à côté du nom d'un joueur (comme Chess.com) : les pièces qu'il a prises (petites icônes du jeu de pièces
// choisi, groupées par type) et « +N » s'il a plus de matériel. Le « +N » de l'adversaire pulse 1 seconde quand son
// coup me fait perdre au moins 2 points nets (pas de son). Hauteur fixe : l'échiquier ne bouge pas.
import type { Color } from 'chess.js';
import { pieceUrl, usePrefs } from './prefs';
import { advantageLabel, advantageOf, capturedLabel, groups, lossPulse, materialState, type MaterialState } from './lib/materialBar';

export interface MaterialInfo { state: MaterialState; pulse: boolean; ply: number }

/** État matériel de la position affichée (coups `uci` depuis `startFen`), et pulsation éventuelle (calcul léger). */
export function materialInfo(startFen: string, uci: string[], me: Color): MaterialInfo {
  return { state: materialState(startFen, uci), pulse: lossPulse(startFen, uci, me), ply: uci.length };
}

/** Pièces prises par `side` et son « +N ». `me` : mon camp (seul le « +N » adverse pulse). */
export function Material({ info, side, me }: { info: MaterialInfo; side: Color; me: Color }) {
  const { pieces: set } = usePrefs();
  const caps = info.state.captured[side];
  const adv = advantageOf(info.state, side);
  const label = capturedLabel(side, caps);
  const victim = side === 'w' ? 'b' : 'w';
  return (
    <span className="mat" data-testid={`mat-${side === me ? 'me' : 'opp'}`} data-adv={adv ?? 0} data-caps={caps.join('')}>
      {label && (
        <span className="mat-caps" role="img" aria-label={label}>
          {groups(caps).map((g) => (
            <span key={g.type} className="mat-group">
              {Array.from({ length: g.n }, (_, i) => <img key={i} src={pieceUrl(set, victim + g.type.toUpperCase())} alt="" draggable={false} />)}
            </span>
          ))}
        </span>
      )}
      {adv && (
        <span key={info.ply} className={`mat-adv${side !== me && info.pulse ? ' pulse-loss' : ''}`} role="img" aria-label={advantageLabel(side, adv)}
          data-testid={side !== me && info.pulse ? 'mat-pulse' : undefined}>+{adv}</span>
      )}
    </span>
  );
}

/** Ligne fixe « nom + matériel » au-dessus ou au-dessous de l'échiquier (revue, Explorer). */
export function MaterialRow({ info, side, me, name }: { info: MaterialInfo; side: Color; me: Color; name: string }) {
  return (
    <div className="mat-row">
      <span className="mat-name">{name}</span>
      <Material info={info} side={side} me={me} />
    </div>
  );
}
