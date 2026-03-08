import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "../../../../../../auth";

const ADVANCE_MAP: Record<string, string> = {
  round1_result: "round2_p1",
  round2_result: "round3_p1",
  round3_result: "finished",
};

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ battleId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { battleId } = await params;
  const sql = getDb();

  const battles = await sql`SELECT * FROM battles WHERE id = ${battleId}`;
  if (battles.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const battle = battles[0];
  const nextStatus = ADVANCE_MAP[battle.status];
  if (!nextStatus) {
    return NextResponse.json({ error: "Cannot advance from this state" }, { status: 400 });
  }

  // Only participants can advance
  if (battle.player1_id !== session.user.id && battle.player2_id !== session.user.id) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  let winnerId = null;
  if (nextStatus === "finished") {
    const p1Total =
      (battle.round1_p1_score || 0) +
      (battle.round2_p1_score || 0) +
      (battle.round3_p1_score || 0);
    const p2Total =
      (battle.round1_p2_score || 0) +
      (battle.round2_p2_score || 0) +
      (battle.round3_p2_score || 0);

    if (p1Total > p2Total) winnerId = battle.player1_id;
    else if (p2Total > p1Total) winnerId = battle.player2_id;
    // null = draw
  }

  const rows = await sql`
    UPDATE battles
    SET status = ${nextStatus},
        winner_id = ${winnerId}
    WHERE id = ${battleId}
    RETURNING *
  `;

  const row = rows[0];
  return NextResponse.json({
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
    createdAt: new Date(row.created_at).toISOString(),
  });
}
