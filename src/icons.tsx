// Icônes : jeu libre Lucide (licence ISC), plus les pastilles de classement des coups dessinées pour l'appli
// (cercle de couleur + symbole). Aucun emoji dans l'interface.
import type { SVGProps } from 'react';
import { CLASS_COLOR, CLASS_LABEL, type MoveClass } from './lib/moveClass';
export {
  Archive, ArchiveRestore, BookOpen, Bot, ChartLine, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  CircleCheck, CircleDashed, CircleX, Compass, Copy, Crown, Download, Eye, FileText, Flag, Flame, Grid3x3, House, Layers, Lightbulb, Lock, MessageCircleQuestion, Moon,
  PartyPopper, Play, Plus, RotateCcw, Settings, Share2, Sun, SunMoon, Trash2, TriangleAlert, Undo2, Upload, User, Volume2, X,
} from 'lucide-react';

/** Symbole blanc d'une pastille, dans un carré 24×24 centré sur (12, 12). */
function symbol(cls: MoveClass) {
  const txt = (t: string, size: number) => (
    <text x="12" y="12.5" textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={900}
      fontFamily="Inter, system-ui, sans-serif" fill="#fff" letterSpacing={t.length > 1 ? -1 : 0}>{t}</text>
  );
  switch (cls) {
    case 'best': // étoile à 5 branches
      return <path d="M12 4.6l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 9.9l5-.7z" fill="#fff" />;
    case 'excellent': return txt('!', 15);
    case 'good': // coche
      return <path d="M7 12.4l3.2 3.2L17.2 8.6" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />;
    case 'book': // livre ouvert
      return <path d="M5.5 7.5c2.4-.6 4.6-.3 6.5 1v8.2c-1.9-1.3-4.1-1.6-6.5-1zM18.5 7.5c-2.4-.6-4.6-.3-6.5 1v8.2c1.9-1.3 4.1-1.6 6.5-1z" fill="#fff" />;
    case 'inaccuracy': return txt('?!', 12);
    case 'mistake': return txt('?', 15);
    case 'blunder': return txt('??', 12);
  }
}

/** Pastille de classement d'un coup : cercle de couleur avec un léger relief + symbole. */
export function ClassBadge({ cls, size = 22, ...rest }: { cls: MoveClass; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={CLASS_LABEL[cls]} className="class-badge" {...rest}>
      <title>{CLASS_LABEL[cls]}</title>
      <circle cx="12" cy="12.8" r="10.6" fill="rgba(0,0,0,.28)" />
      <circle cx="12" cy="12" r="10.6" fill={CLASS_COLOR[cls]} />
      <path d="M3.2 10.4a9 9 0 0 1 17.6 0" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth={1.6} strokeLinecap="round" />
      {symbol(cls)}
    </svg>
  );
}
