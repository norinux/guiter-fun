"use client";

import { Battle, PerformanceMetrics } from "@/types/battle";

interface Props {
  battle: Battle;
  metrics: PerformanceMetrics | null;
  onAdvance: () => void;
}

function getRoundNumber(status: string): number {
  if (status.startsWith("round1")) return 1;
  if (status.startsWith("round2")) return 2;
  return 3;
}

function getRoundScores(battle: Battle, round: number): { p1: number | null; p2: number | null } {
  if (round === 1) return { p1: battle.round1P1Score, p2: battle.round1P2Score };
  if (round === 2) return { p1: battle.round2P1Score, p2: battle.round2P2Score };
  return { p1: battle.round3P1Score, p2: battle.round3P2Score };
}

export default function BattleRoundResult({ battle, metrics, onAdvance }: Props) {
  const round = getRoundNumber(battle.status);
  const scores = getRoundScores(battle, round);
  const p1Wins = (scores.p1 || 0) > (scores.p2 || 0);
  const p2Wins = (scores.p2 || 0) > (scores.p1 || 0);

  return (
    <div className="flex flex-col items-center py-8">
      <p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
        ラウンド {round} 結果
      </p>

      <div className="mb-8 flex w-full max-w-lg items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-6">
        {/* P1 */}
        <div className={`flex flex-1 flex-col items-center rounded-lg p-4 ${p1Wins ? "bg-primary/10 ring-1 ring-primary/40" : ""}`}>
          {battle.player1Image ? (
            <img src={battle.player1Image} alt="" className="mb-2 h-12 w-12 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">P1</div>
          )}
          <p className="text-sm font-medium text-white">{battle.player1Name}</p>
          <p className="mt-2 text-3xl font-bold text-white">{scores.p1 ?? 0}</p>
          {p1Wins && <span className="mt-1 text-xs font-semibold text-primary">WIN</span>}
        </div>

        <span className="text-xl font-bold text-slate-600">VS</span>

        {/* P2 */}
        <div className={`flex flex-1 flex-col items-center rounded-lg p-4 ${p2Wins ? "bg-blue-500/10 ring-1 ring-blue-500/40" : ""}`}>
          {battle.player2Image ? (
            <img src={battle.player2Image} alt="" className="mb-2 h-12 w-12 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold">P2</div>
          )}
          <p className="text-sm font-medium text-white">{battle.player2Name}</p>
          <p className="mt-2 text-3xl font-bold text-white">{scores.p2 ?? 0}</p>
          {p2Wins && <span className="mt-1 text-xs font-semibold text-blue-400">WIN</span>}
        </div>
      </div>

      {/* Performance breakdown */}
      {metrics && (
        <div className="mb-8 w-full max-w-sm rounded-xl border border-white/10 bg-surface p-4">
          <p className="mb-3 text-sm font-medium text-slate-400">あなたのスコア内訳</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">クリーンノート数</span>
              <span className="font-mono text-sm text-white">{metrics.cleanNotes}/50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">音の多様性</span>
              <span className="font-mono text-sm text-white">{metrics.diversity}/30</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">リズムの安定性</span>
              <span className="font-mono text-sm text-white">{metrics.rhythmStability}/20</span>
            </div>
            <div className="mt-2 border-t border-white/10 pt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">合計</span>
              <span className="font-mono text-lg font-bold text-primary">{metrics.total}/100</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onAdvance}
        className="rounded-xl bg-primary px-8 py-3 text-lg font-bold text-white transition-all hover:bg-primary-dark active:scale-95"
      >
        {round < 3 ? `ラウンド ${round + 1} へ` : "最終結果を見る"}
      </button>
    </div>
  );
}
