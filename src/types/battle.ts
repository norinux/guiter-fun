export type BattleStatus =
  | "waiting"
  | "round1_p1"
  | "round1_p2"
  | "round1_result"
  | "round2_p1"
  | "round2_p2"
  | "round2_result"
  | "round3_p1"
  | "round3_p2"
  | "round3_result"
  | "finished";

export interface Battle {
  id: string;
  player1Id: string;
  player1Name: string;
  player1Image: string | null;
  player2Id: string | null;
  player2Name: string | null;
  player2Image: string | null;
  status: BattleStatus;
  round1P1Score: number | null;
  round1P2Score: number | null;
  round2P1Score: number | null;
  round2P2Score: number | null;
  round3P1Score: number | null;
  round3P2Score: number | null;
  winnerId: string | null;
  createdAt: string;
}

export interface BattleSummary {
  id: string;
  player1Name: string;
  player1Image: string | null;
  status: BattleStatus;
  createdAt: string;
}

export interface PerformanceMetrics {
  cleanNotes: number;
  diversity: number;
  rhythmStability: number;
  total: number;
}
