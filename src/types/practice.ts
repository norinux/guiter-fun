export interface PracticeSession {
  id: string;
  date: string; // ISO 8601
  durationSeconds: number;
  bpm?: number;
  category: "chords" | "tabs" | "metronome" | "free";
  notes: string;
  chordsPracticed?: string[];
  tabPracticed?: string;
}

export interface PracticeLog {
  sessions: PracticeSession[];
}
