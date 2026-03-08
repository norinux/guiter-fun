"use client";

import Link from "next/link";
import { Battle } from "@/types/battle";

interface Props {
  battle: Battle;
  userId: string | undefined;
}

export default function BattleFinalResult({ battle, userId }: Props) {
  const p1Total =
    (battle.round1P1Score || 0) +
    (battle.round2P1Score || 0) +
    (battle.round3P1Score || 0);
  const p2Total =
    (battle.round1P2Score || 0) +
    (battle.round2P2Score || 0) +
    (battle.round3P2Score || 0);

  const isDraw = !battle.winnerId;
  const isWinner = battle.winnerId === userId;

  return (
    <div className="flex flex-col items-center py-8">
      {/* Result header */}
      <div className="mb-8 text-center">
        {isDraw ? (
          <>
            <p className="text-5xl mb-3">🤝</p>
            <h2 className="text-3xl font-bold text-white">引き分け!</h2>
          </>
        ) : isWinner ? (
          <>
            <p className="text-5xl mb-3">🏆</p>
            <h2 className="text-3xl font-bold text-primary">あなたの勝ち!</h2>
          </>
        ) : (
          <>
            <p className="text-5xl mb-3">😢</p>
            <h2 className="text-3xl font-bold text-slate-300">惜しい! 負けました</h2>
          </>
        )}
      </div>

      {/* Score summary */}
      <div className="mb-8 w-full max-w-lg rounded-xl border border-white/10 bg-surface p-6">
        <div className="mb-4 flex items-end justify-between">
          {/* P1 */}
          <div className="flex flex-col items-center">
            {battle.player1Image ? (
              <img src={battle.player1Image} alt="" className="mb-2 h-14 w-14 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">P1</div>
            )}
            <p className="text-sm font-medium text-white">{battle.player1Name}</p>
            <p className="mt-1 text-4xl font-bold text-white">{p1Total}</p>
            {battle.winnerId === battle.player1Id && (
              <span className="mt-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">WINNER</span>
            )}
          </div>

          <span className="mb-8 text-xl font-bold text-slate-600">VS</span>

          {/* P2 */}
          <div className="flex flex-col items-center">
            {battle.player2Image ? (
              <img src={battle.player2Image} alt="" className="mb-2 h-14 w-14 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold">P2</div>
            )}
            <p className="text-sm font-medium text-white">{battle.player2Name}</p>
            <p className="mt-1 text-4xl font-bold text-white">{p2Total}</p>
            {battle.winnerId === battle.player2Id && (
              <span className="mt-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-400">WINNER</span>
            )}
          </div>
        </div>

        {/* Round breakdown */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2 text-left font-medium">ラウンド</th>
                <th className="pb-2 text-center font-medium">{battle.player1Name}</th>
                <th className="pb-2 text-center font-medium">{battle.player2Name}</th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr>
                <td className="py-1 text-slate-400">R1</td>
                <td className="py-1 text-center font-mono">{battle.round1P1Score ?? "-"}</td>
                <td className="py-1 text-center font-mono">{battle.round1P2Score ?? "-"}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-400">R2</td>
                <td className="py-1 text-center font-mono">{battle.round2P1Score ?? "-"}</td>
                <td className="py-1 text-center font-mono">{battle.round2P2Score ?? "-"}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-400">R3</td>
                <td className="py-1 text-center font-mono">{battle.round3P1Score ?? "-"}</td>
                <td className="py-1 text-center font-mono">{battle.round3P2Score ?? "-"}</td>
              </tr>
              <tr className="border-t border-white/10 font-bold">
                <td className="pt-2 text-slate-300">合計</td>
                <td className="pt-2 text-center">{p1Total}</td>
                <td className="pt-2 text-center">{p2Total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Link
        href="/battles"
        className="rounded-xl bg-primary px-8 py-3 text-lg font-bold text-white transition-all hover:bg-primary-dark active:scale-95"
      >
        ロビーに戻る
      </Link>
    </div>
  );
}
