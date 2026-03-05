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
 * Play a realistic guitar note using multiple harmonics,
 * pluck noise burst, and decaying lowpass filter.
 */
function playGuitarNote(
  stringIndex: number,
  fret: number,
  ctx: AudioContext,
  time: number,
) {
  const freq = OPEN_STRING_FREQ[stringIndex] * Math.pow(2, fret / 12);
  const duration = 1.5;

  // --- Master output with compressor-like limiter ---
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  // --- Decaying lowpass filter (bright attack → mellow sustain, like a real string) ---
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4000 + freq * 3, time);
  filter.frequency.exponentialRampToValueAtTime(800 + freq, time + duration * 0.4);
  filter.Q.value = 0.7;
  filter.connect(master);

  // --- Body resonance (simulates guitar body) ---
  const body = ctx.createBiquadFilter();
  body.type = "peaking";
  body.frequency.value = 250;
  body.gain.value = 3;
  body.Q.value = 1;
  body.connect(filter);

  // --- Harmonics (fundamental + overtones with decreasing volume) ---
  const harmonics = [
    { ratio: 1, vol: 0.6, type: "sawtooth" as OscillatorType },
    { ratio: 2, vol: 0.2, type: "sine" as OscillatorType },
    { ratio: 3, vol: 0.1, type: "sine" as OscillatorType },
    { ratio: 4, vol: 0.04, type: "sine" as OscillatorType },
  ];

  for (const h of harmonics) {
    const osc = ctx.createOscillator();
    osc.type = h.type;
    osc.frequency.value = freq * h.ratio;

    const gain = ctx.createGain();
    // Higher harmonics decay faster
    const decayTime = duration / h.ratio;
    gain.gain.setValueAtTime(h.vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decayTime);

    osc.connect(gain);
    gain.connect(body);
    osc.start(time);
    osc.stop(time + decayTime + 0.05);
  }

  // --- Pluck noise burst (the "pick attack" sound) ---
  const bufferSize = ctx.sampleRate * 0.04; // 40ms of noise
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = freq * 2;
  noiseFilter.Q.value = 2;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.6, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(filter);
  noiseSrc.start(time);
  noiseSrc.stop(time + 0.06);
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
