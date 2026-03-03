import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "../../../../../../auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await params;
  const { isSaved } = await request.json();
  const sql = getDb();

  if (isSaved) {
    await sql`DELETE FROM video_saves WHERE video_id = ${videoId} AND user_id = ${session.user.id}`;
  } else {
    await sql`INSERT INTO video_saves (video_id, user_id) VALUES (${videoId}, ${session.user.id}) ON CONFLICT DO NOTHING`;
  }

  return NextResponse.json({ ok: true });
}
