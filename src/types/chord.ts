export type Finger = 0 | 1 | 2 | 3 | 4;

export interface FingerPosition {
  string: number; // 1-6 (1=highE, 6=lowE)
  fret: number;
  finger: Finger;
}

/** フレット番号。-1 = ミュート（弾かない） */
export type StringState = number;

export interface ChordDefinition {
  id: string;
  name: string;
  nameShort: string;
  category: "major" | "minor" | "seventh" | "minor7" | "major7" | "sus2" | "sus4" | "dim" | "aug" | "add9" | "power";
  /** [lowE, A, D, G, B, highE] */
  strings: [StringState, StringState, StringState, StringState, StringState, StringState];
  fingers: FingerPosition[];
  barreeFret?: number;
  startFret: number;
}

export interface ChordProgression {
  id: string;
  name: string;
  description: string;
  chordIds: string[];
  beatsPerChord: number;
}
