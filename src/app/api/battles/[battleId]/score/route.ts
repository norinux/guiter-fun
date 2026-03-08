import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "../../../../../../auth";

// Map status to which player should be submitting
const STATUS_MAP: Record<string, { playerId: "player1_id" | "player2_id"; round: number; player: 1 | 2; nextStatus: string }> = {
  round1_p1: { playerId: "player1_id", round: 1, player: 1, nextStatus: "round1_p2" },
  round1_p2: { playerId: "player2_id", round: 1, player: 2, nextStatus: "round1_result" },
  round2_p1: { playerId: "player1_id", round: 2, player: 1, nextStatus: "round2_p2" },
  round2_p2: { playerId: "player2_id", round: 2, player: 2, nextStatus: "round2_result" },
  round3_p1: { playerId: "player1_id", round: 3, player: 1, nextStatus: "round3_p2" },
  round3_p2: { playerId: "player2_id", round: 3, player: 2, nextStatus: "round3_result" },
};

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    player1Id: row.player1_id,
    player1Name: row.player1_name,
    player1Image: row.player1_image,
    player2Id: row.player2_id,
    player2Name: row.player2_name,
    player2Image: row.player2_image,
    status: row.status,
    round1P1Score: row.round1_p1_score,
    round1P2Score: row.round1_p2_score,
    round2P1Score: row.round2_p1_score,
    round2P2Score: row.round2_p2_score,
    round3P1Score: row.round3_p1_score,
    round3P2Score: row.round3_p2_score,
    winnerId: row.winner_id,
    createdAt: new Date(row.created_at as string).toISOString(),
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ battleId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { battleId } = await params;
  const { score } = await request.json();
  const sql = getDb();

  const battles = await sql`SELECT * FROM battles WHERE id = ${battleId}`;
  if (battles.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const battle = battles[0];
  const mapping = STATUS_MAP[battle.status as string];
  if (!mapping) {
    return NextResponse.json({ error: "Not in scoring phase" }, { status: 400 });
  }

  // Verify correct player
  if (battle[mapping.playerId] !== session.user.id) {
    return NextResponse.json({ error: "Not your turn" }, { status: 403 });
  }

  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Use separate queries for each round/player combo since neon doesn't support dynamic column names
  let rows;
  if (mapping.round === 1 && mapping.player === 1) {
    rows = await sql`UPDATE battles SET round1_p1_score = ${clampedScore}, status = ${mapping.nextStatus} WHERE id = ${battleId} RETURNING *`;
  } else if (mapping.round === 1 && mapping.player === 2) {
    rows = await sql`UPDATE battles SET round1_p2_score = ${clampedScore}, status = ${mapping.nextStatus} WHERE id = ${battleId} RETURNING *`;
  } else if (mapping.round === 2 && mapping.player === 1) {
    rows = await sql`UPDATE battles SET round2_p1_score = ${clampedScore}, status = ${mapping.nextStatus} WHERE id = ${battleId} RETURNING *`;
  } else if (mapping.round === 2 && mapping.player === 2) {
    rows = await sql`UPDATE battles SET round2_p2_score = ${clampedScore}, status = ${mapping.nextStatus} WHERE id = ${battleId} RETURNING *`;
  } else if (mapping.round === 3 && mapping.player === 1) {
    rows = await sql`UPDATE battles SET round3_p1_score = ${clampedScore}, status = ${mapping.nextStatus} WHERE id = ${battleId} RETURNING *`;
  } else {
    rows = await sql`UPDATE battles SET round3_p2_score = ${clampedScore}, status = ${mapping.nextStatus} WHERE id = ${battleId} RETURNING *`;
  }

  return NextResponse.json(mapRow(rows[0]));
}
