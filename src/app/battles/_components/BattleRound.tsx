"use client";

import { Battle } from "@/types/battle";

interface Props {
  battle: Battle;
  isMyTurn: boolean;
  isPlaying: boolean;
  timeLeft: number;
  onStart: () => void;
  onStop: () => void;
  currentPlayer: string;
}

function getRoundNumber(status: string): number {
  if (status.startsWith("round1")) return 1;
  if (status.startsWith("round2")) return 2;
  return 3;
}

export default function BattleRound({
  battle,
  isMyTurn,
  isPlaying,
  timeLeft,
  onStart,
  onStop,
  currentPlayer,
}: Props) {
  const round = getRoundNumber(battle.status);

  return (
    <div className="flex flex-col items-center py-8">
      {/* Round header */}
      <div className="mb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          ラウンド {round} / 3
        </p>
        <h2 className="mt-1 text-2xl font-bold text-white">
          {isMyTurn ? "あなたのターン!" : `${currentPlayer} が演奏中...`}
        </h2>
      </div>

      {/* Players */}
      <div className="mb-8 flex w-full max-w-md items-center justify-between rounded-xl border border-white/10 bg-surface p-4">
        <div className="flex items-center gap-3">
          {battle.player1Image ? (
            <img src={battle.player1Image} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">P1</div>
          )}
          <span className="text-sm font-medium text-white">{battle.player1Name}</span>
        </div>
        <span className="text-lg font-bold text-slate-600">VS</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">{battle.player2Name}</span>
          {battle.player2Image ? (
            <img src={battle.player2Image} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold">P2</div>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/10">
        <svg className="absolute inset-0" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary"
            strokeDasharray={`${(timeLeft / 30) * 364} 364`}
            strokeLinecap="round"
            transform="rotate(-90 64 64)"
          />
        </svg>
        <span className="text-4xl font-bold text-white">{timeLeft}</span>
      </div>

      {/* Action */}
      {isMyTurn && !isPlaying && (
        <button
          onClick={onStart}
          className="rounded-xl bg-primary px-8 py-3 text-lg font-bold text-white transition-all hover:bg-primary-dark active:scale-95"
        >
          演奏スタート
        </button>
      )}

      {isPlaying && (
        <div className="text-center">
          <div className="mb-4 flex items-center gap-2 text-green-400">
            <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
            <span className="text-sm font-medium">録音中...</span>
          </div>
          <button
            onClick={onStop}
            className="rounded-xl bg-red-500 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-red-600 active:scale-95"
          >
            演奏を終了
          </button>
        </div>
      )}

      {!isMyTurn && (
        <p className="text-slate-400">相手の演奏を待っています...</p>
      )}
    </div>
  );
}
