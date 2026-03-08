import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "../../../../auth";

export async function GET() {
  const sql = getDb();

  const rows = await sql`
    SELECT id, player1_name, player1_image, status, created_at
    FROM battles
    WHERE status = 'waiting'
    ORDER BY created_at DESC
    LIMIT 20
  `;

  const battles = rows.map((row) => ({
    id: row.id,
    player1Name: row.player1_name,
    player1Image: row.player1_image,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
  }));

  return NextResponse.json(battles);
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();

  const rows = await sql`
    INSERT INTO battles (player1_id, player1_name, player1_image)
    VALUES (${session.user.id}, ${session.user.name || "Player"}, ${session.user.image || null})
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
