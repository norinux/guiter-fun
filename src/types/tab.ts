export interface TabMeasure {
  /** [highE, B, G, D, A, lowE] — 表示順（上から下） */
  strings: [string, string, string, string, string, string];
}

export interface TabSong {
  id: string;
  title: string;
  artist?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  defaultBpm: number;
  timeSignature: [number, number];
  measures: TabMeasure[];
  description?: string;
}
