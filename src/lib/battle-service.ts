import { Battle, BattleSummary } from "@/types/battle";

export async function getBattles(): Promise<BattleSummary[]> {
  const res = await fetch("/api/battles");
  if (!res.ok) return [];
  return res.json();
}

export async function createBattle(): Promise<Battle | null> {
  const res = await fetch("/api/battles", {
    method: "POST",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getBattle(battleId: string): Promise<Battle | null> {
  const res = await fetch(`/api/battles/${battleId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function joinBattle(battleId: string): Promise<Battle | null> {
  const res = await fetch(`/api/battles/${battleId}/join`, {
    method: "POST",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function submitScore(
  battleId: string,
  score: number
): Promise<Battle | null> {
  const res = await fetch(`/api/battles/${battleId}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function advanceRound(battleId: string): Promise<Battle | null> {
  const res = await fetch(`/api/battles/${battleId}/advance`, {
    method: "POST",
  });
  if (!res.ok) return null;
  return res.json();
}
