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
  const { isLiked } = await request.json();
  const sql = getDb();

  if (isLiked) {
    await sql`DELETE FROM video_likes WHERE video_id = ${videoId} AND user_id = ${session.user.id}`;
  } else {
    await sql`INSERT INTO video_likes (video_id, user_id) VALUES (${videoId}, ${session.user.id}) ON CONFLICT DO NOTHING`;
  }

  return NextResponse.json({ ok: true });
}
