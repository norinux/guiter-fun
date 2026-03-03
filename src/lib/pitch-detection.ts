/**
 * 自己相関法（YIN アルゴリズム簡易版）によるピッチ検出
 */

const GUITAR_STRINGS = [
  { name: "1弦 (E4)", note: "E4", frequency: 329.63 },
  { name: "2弦 (B3)", note: "B3", frequency: 246.94 },
  { name: "3弦 (G3)", note: "G3", frequency: 196.0 },
  { name: "4弦 (D3)", note: "D3", frequency: 146.83 },
  { name: "5弦 (A2)", note: "A2", frequency: 110.0 },
  { name: "6弦 (E2)", note: "E2", frequency: 82.41 },
] as const;

export type GuitarString = (typeof GUITAR_STRINGS)[number];

export function getGuitarStrings(): readonly GuitarString[] {
  return GUITAR_STRINGS;
}

// 全音名とその周波数を計算（A4=440Hz基準）
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export interface PitchResult {
  frequency: number;
  noteName: string;
  noteNameWithOctave: string;
  octave: number;
  cents: number; // -50 ~ +50: 最も近い音からのずれ（セント）
  closestGuitarString: GuitarString | null;
  centsFromString: number; // 最も近いギター弦からのずれ
}

/**
 * 周波数から音名・セントを計算
 */
export function frequencyToNote(frequency: number): PitchResult {
  // A4 = 440Hz を基準に半音何個分か
  const semitonesFromA4 = 12 * Math.log2(frequency / 440);
  const roundedSemitones = Math.round(semitonesFromA4);
  const cents = Math.round((semitonesFromA4 - roundedSemitones) * 100);

  // 音名を計算 (A4 = MIDI note 69)
  const midiNote = 69 + roundedSemitones;
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = ((midiNote % 12) + 12) % 12;
  const noteName = NOTE_NAMES[noteIndex];

  // 最も近いギター弦を探す
  let closestString: GuitarString | null = null;
  let minCentsDiff = Infinity;

  for (const gs of GUITAR_STRINGS) {
    const centsDiff = 1200 * Math.log2(frequency / gs.frequency);
    if (Math.abs(centsDiff) < Math.abs(minCentsDiff)) {
      minCentsDiff = centsDiff;
      closestString = gs;
    }
  }

  return {
    frequency,
    noteName,
    noteNameWithOctave: `${noteName}${octave}`,
    octave,
    cents,
    closestGuitarString: closestString,
    centsFromString: Math.round(minCentsDiff),
  };
}

/**
 * 自己相関法によるピッチ検出
 * @returns 検出された周波数（Hz）、検出できなければ null
 */
export function detectPitch(
  buffer: Float32Array,
  sampleRate: number
): number | null {
  const bufferSize = buffer.length;

  // 信号のRMSをチェック（音量が小さすぎる場合はスキップ）
  let rms = 0;
  for (let i = 0; i < bufferSize; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / bufferSize);
  if (rms < 0.01) return null;

  // 自己相関を計算
  // ギターの最低音 E2 ≈ 82Hz → 周期 ≈ sampleRate/82
  // ギターの最高音 E4 ≈ 330Hz → 周期 ≈ sampleRate/330
  const minPeriod = Math.floor(sampleRate / 1000); // ~1000Hz上限
  const maxPeriod = Math.floor(sampleRate / 60); // ~60Hz下限

  // YIN風差分関数
  const yinBuffer = new Float32Array(maxPeriod);

  // d'(tau) = cumulative mean normalized difference
  yinBuffer[0] = 1;
  let runningSum = 0;

  for (let tau = 1; tau < maxPeriod; tau++) {
    let diff = 0;
    for (let i = 0; i < bufferSize - maxPeriod; i++) {
      const delta = buffer[i] - buffer[i + tau];
      diff += delta * delta;
    }
    runningSum += diff;
    yinBuffer[tau] = runningSum === 0 ? 1 : (diff * tau) / runningSum;
  }

  // 閾値以下の最初のディップを探す
  const threshold = 0.15;
  let bestTau = -1;

  for (let tau = minPeriod; tau < maxPeriod; tau++) {
    if (yinBuffer[tau] < threshold) {
      // ディップの底を探す
      while (tau + 1 < maxPeriod && yinBuffer[tau + 1] < yinBuffer[tau]) {
        tau++;
      }
      bestTau = tau;
      break;
    }
  }

  if (bestTau === -1) return null;

  // 放物線補間で精度を上げる
  const s0 = yinBuffer[bestTau - 1] ?? yinBuffer[bestTau];
  const s1 = yinBuffer[bestTau];
  const s2 = yinBuffer[bestTau + 1] ?? yinBuffer[bestTau];
  const shift = (s0 - s2) / (2 * (s0 - 2 * s1 + s2));

  const refinedTau = bestTau + (isFinite(shift) ? shift : 0);
  return sampleRate / refinedTau;
}
