// Sons générés (Web Audio) : aucun fichier, donc disponibles hors ligne et libres de droits.
// Coup, prise, échec, roque, fin de partie. Réglage « Sons » oui/non (meta 'sound', par défaut oui).
import { db } from './db';

export type SoundKind = 'move' | 'capture' | 'check' | 'castle' | 'end';

let ctx: AudioContext | null = null;
let enabled = true;
let loaded = false;

export async function loadSoundSetting() {
  if (loaded) return enabled;
  const v = (await db.meta.get('sound'))?.value;
  enabled = v !== false;
  loaded = true;
  return enabled;
}
export async function setSoundEnabled(on: boolean) {
  enabled = on;
  loaded = true;
  await db.meta.put({ key: 'sound', value: on });
}
export const soundEnabled = () => enabled;

/** Compteur (tests) : nombre de sons joués par type. */
export const soundLog: SoundKind[] = [];

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/** Petit « toc » de bois : bruit filtré très court. */
function knock(a: AudioContext, t: number, gain: number, freq: number, dur = 0.07) {
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.2;
  const g = a.createGain();
  g.gain.value = gain;
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
}

function tone(a: AudioContext, t: number, freq: number, dur: number, gain = 0.12) {
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export function playSound(kind: SoundKind) {
  if (!enabled) return;
  soundLog.push(kind);
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.01;
  switch (kind) {
    case 'move': knock(a, t, 0.9, 900); break;
    case 'capture': knock(a, t, 1.2, 1400, 0.09); knock(a, t + 0.035, 0.7, 700); break;
    case 'castle': knock(a, t, 0.8, 900); knock(a, t + 0.11, 0.8, 800); break;
    case 'check': knock(a, t, 0.8, 1000); tone(a, t + 0.02, 880, 0.18); tone(a, t + 0.12, 1175, 0.2); break;
    case 'end': tone(a, t, 523, 0.5); tone(a, t + 0.12, 659, 0.5); tone(a, t + 0.24, 784, 0.7); break;
  }
}

/** Son d'un coup d'après sa notation SAN (et fin de partie si `over`). */
export function soundForMove(san: string, over = false) {
  if (over || san.includes('#')) playSound('end');
  else if (san.includes('+')) playSound('check');
  else if (san.startsWith('O-O')) playSound('castle');
  else if (san.includes('x')) playSound('capture');
  else playSound('move');
}
