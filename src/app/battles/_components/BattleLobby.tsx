"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BattleSummary } from "@/types/battle";
import { getBattles, createBattle } from "@/lib/battle-service";

export default function BattleLobby() {
  const { user } = useAuth();
  const router = useRouter();
  const [battles, setBattles] = useState<BattleSummary[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getBattles().then(setBattles);
    const interval = setInterval(() => {
      getBattles().then(setBattles);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async () => {
    if (!user) return;
    setCreating(true);
    const battle = await createBattle();
    setCreating(false);
    if (battle) {
      router.push(`/battles/${battle.id}`);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">対戦ロビー</h2>
        {user && (
          <button
            onClick={handleCreate}
            disabled={creating}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {creating ? "作成中..." : "バトルを作成"}
          </button>
        )}
      </div>

      {!user && (
        <p className="mb-6 text-sm text-slate-400">
          バトルに参加するにはログインしてください
        </p>
      )}

      {battles.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface p-8 text-center">
          <p className="text-slate-400">待機中のバトルはありません</p>
          {user && (
            <p className="mt-2 text-sm text-slate-500">
              新しいバトルを作成して対戦相手を待ちましょう
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {battles.map((b) => (
            <button
              key={b.id}
              onClick={() => router.push(`/battles/${b.id}`)}
              className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-surface p-4 text-left transition-all hover:border-primary/40 hover:bg-surface-light"
            >
              {b.player1Image ? (
                <img
                  src={b.player1Image}
                  alt=""
                  className="h-10 w-10 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-white">{b.player1Name}</p>
                <p className="text-xs text-slate-500">対戦相手を待っています...</p>
              </div>
              <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                参加可能
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
