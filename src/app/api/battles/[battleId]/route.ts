import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ battleId: string }> }
) {
  const { battleId } = await params;
  const sql = getDb();

  const rows = await sql`
    SELECT * FROM battles WHERE id = ${battleId}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(mapRow(rows[0]));
}
