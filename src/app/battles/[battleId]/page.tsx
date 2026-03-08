"use client";

import { use } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBattle } from "@/hooks/useBattle";
import { joinBattle } from "@/lib/battle-service";
import BattleWaiting from "../_components/BattleWaiting";
import BattleRound from "../_components/BattleRound";
import BattleRoundResult from "../_components/BattleRoundResult";
import BattleFinalResult from "../_components/BattleFinalResult";

export default function BattleRoomPage({
  params,
}: {
  params: Promise<{ battleId: string }>;
}) {
  const { battleId } = use(params);
  const { user } = useAuth();
  const {
    battle,
    isPlaying,
    timeLeft,
    metrics,
    error,
    isMyTurn,
    startPlaying,
    stopPlaying,
    advance,
    fetchBattle,
  } = useBattle(battleId, user?.id);

  if (!battle) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-primary" />
      </div>
    );
  }

  // Handle joining
  if (battle.status === "waiting" && user && battle.player1Id !== user.id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BattleWaiting battle={battle} isCreator={false} />
        <div className="mt-4 flex justify-center">
          <button
            onClick={async () => {
              await joinBattle(battleId);
              fetchBattle();
            }}
            className="rounded-xl bg-primary px-8 py-3 text-lg font-bold text-white transition-all hover:bg-primary-dark active:scale-95"
          >
            バトルに参加
          </button>
        </div>
      </div>
    );
  }

  if (battle.status === "waiting") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BattleWaiting battle={battle} isCreator={true} />
      </div>
    );
  }

  if (battle.status === "finished") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BattleFinalResult battle={battle} userId={user?.id} />
      </div>
    );
  }

  if (battle.status.endsWith("_result")) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BattleRoundResult battle={battle} metrics={metrics} onAdvance={advance} />
      </div>
    );
  }

  // Playing phase
  const currentPlayerName = battle.status.endsWith("_p1")
    ? battle.player1Name
    : battle.player2Name || "";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <BattleRound
        battle={battle}
        isMyTurn={isMyTurn}
        isPlaying={isPlaying}
        timeLeft={timeLeft}
        onStart={startPlaying}
        onStop={stopPlaying}
        currentPlayer={currentPlayerName}
      />
    </div>
  );
}
