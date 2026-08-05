/** Cute interactive SFX (not background music). Off until user enables. */

let ctx = null;
let enabled = false;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function isSoundEnabled() {
  return enabled;
}

export async function setSoundEnabled(next) {
  enabled = next;
  const audio = getCtx();
  if (enabled && audio?.state === "suspended") await audio.resume();
  if (enabled) sfx.pop();
}

function tone(freq, duration, type, gain, when = 0) {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const t0 = audio.currentTime + when;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

function blip(freqs, gap = 0.055) {
  freqs.forEach((f, i) => tone(f, 0.07, "sine", 0.028, i * gap));
}

export const sfx = {
  /** soft UI hover */
  tick: () => tone(880, 0.045, "sine", 0.018),
  /** card select — cute ascending chirp */
  select: () => blip([523, 659, 784], 0.05),
  /** journey step forward */
  step: () => blip([392, 523], 0.06),
  /** signal awake — little sparkle */
  alive: () => blip([659, 784, 988], 0.045),
  /** signal silent — soft down */
  silent: () => blip([349, 277], 0.07),
  /** slider / micro adjust */
  pop: () => tone(1046, 0.035, "triangle", 0.016),
  /** unlock waypoint */
  unlock: () => blip([440, 554, 659, 880], 0.048),
};
