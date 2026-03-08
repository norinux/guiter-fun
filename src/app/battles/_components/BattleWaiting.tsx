"use client";

import { Battle } from "@/types/battle";

interface Props {
  battle: Battle;
  isCreator: boolean;
}

export default function BattleWaiting({ battle, isCreator }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-primary" />

      <h2 className="mb-2 text-2xl font-bold text-white">
        {isCreator ? "対戦相手を待っています..." : "バトルに参加中..."}
      </h2>

      <p className="mb-8 text-slate-400">
        {isCreator
          ? "誰かが参加するとバトルが始まります"
          : "まもなくバトルが開始されます"}
      </p>

      <div className="rounded-xl border border-white/10 bg-surface p-6">
        <div className="flex items-center gap-4">
          {battle.player1Image ? (
            <img
              src={battle.player1Image}
              alt=""
              className="h-12 w-12 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
              P1
            </div>
          )}
          <div>
            <p className="font-semibold text-white">{battle.player1Name}</p>
            <p className="text-xs text-slate-500">プレイヤー1</p>
          </div>

          <div className="mx-4 text-2xl font-bold text-slate-600">VS</div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/20 text-slate-500">
            ?
          </div>
          <div>
            <p className="font-semibold text-slate-500">待機中...</p>
            <p className="text-xs text-slate-600">プレイヤー2</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white/5 px-4 py-2">
        <p className="text-xs text-slate-500">
          バトルID: <span className="font-mono text-slate-400">{battle.id.slice(0, 8)}</span>
        </p>
      </div>
    </div>
  );
}
