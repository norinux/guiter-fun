import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "../../../../../../auth";

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

  // Check battle exists and is waiting
  const battles = await sql`
    SELECT * FROM battles WHERE id = ${battleId} AND status = 'waiting'
  `;

  if (battles.length === 0) {
    return NextResponse.json({ error: "Battle not available" }, { status: 400 });
  }

  const battle = battles[0];

  // Can't join your own battle
  if (battle.player1_id === session.user.id) {
    return NextResponse.json({ error: "Cannot join your own battle" }, { status: 400 });
  }

  const rows = await sql`
    UPDATE battles
    SET player2_id = ${session.user.id},
        player2_name = ${session.user.name || "Player"},
        player2_image = ${session.user.image || null},
        status = 'round1_p1'
    WHERE id = ${battleId} AND status = 'waiting'
    RETURNING *
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Battle already started" }, { status: 400 });
  }

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
