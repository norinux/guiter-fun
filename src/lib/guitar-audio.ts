import { getAudioContext } from "./audio";

// Standard tuning open string frequencies (high e to low E)
const OPEN_STRING_FREQ = [
  329.63, // e4 (1st string)
  246.94, // B3 (2nd string)
  196.0,  // G3 (3rd string)
  146.83, // D3 (4th string)
  110.0,  // A2 (5th string)
  82.41,  // E2 (6th string)
];

/**
 * Play a guitar note using Web Audio API with a plucked string sound.
 */
function playGuitarNote(
  stringIndex: number,
  fret: number,
  ctx: AudioContext,
  time: number,
) {
  const freq = OPEN_STRING_FREQ[stringIndex] * Math.pow(2, fret / 12);
  const duration = 1.2;

  // Fundamental tone
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;

  // Second harmonic for richness
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 2;

  // Gain envelope (plucked string: sharp attack, exponential decay)
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.08, time);
  gain2.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.6);

  // High-frequency rolloff to sound more natural
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2000 + freq;
  filter.Q.value = 1;

  osc.connect(gain);
  osc2.connect(gain2);
  gain.connect(filter);
  gain2.connect(filter);
  filter.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + duration);
  osc2.start(time);
  osc2.stop(time + duration);
}

/**
 * Parse and play all notes at a given column position in the tab.
 * fullStrings: array of 6 concatenated string lines (high e to low E)
 */
export function playNotesAtPosition(
  fullStrings: string[],
  position: number,
) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  for (let i = 0; i < 6; i++) {
    const char = fullStrings[i]?.[position];
    if (char && char !== "-" && char !== "|") {
      const fret = parseInt(char, 10);
      if (!isNaN(fret)) {
        playGuitarNote(i, fret, ctx, now);
      }
    }
  }
}
