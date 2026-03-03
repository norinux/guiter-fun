import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "../../../../../auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  const sql = getDb();

  const rows = await sql`
    SELECT c.id, c.video_id, c.user_id, u.name AS user_name, u.image AS user_photo_url,
           c.text, c.created_at
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.video_id = ${videoId}
    ORDER BY c.created_at ASC
  `;

  const comments = rows.map((row) => ({
    id: row.id,
    videoId: row.video_id,
    userId: row.user_id,
    userName: row.user_name,
    userPhotoURL: row.user_photo_url,
    text: row.text,
    createdAt: new Date(row.created_at).toISOString(),
  }));

  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { videoId } = await params;
  const { text } = await request.json();

  if (!text?.trim()) {
    return NextResponse.json(
      { error: "Comment text required" },
      { status: 400 }
    );
  }

  const sql = getDb();
  const rows = await sql`
    INSERT INTO comments (video_id, user_id, text)
    VALUES (${videoId}, ${session.user.id}, ${text.trim()})
    RETURNING *
  `;

  const comment = rows[0];
  return NextResponse.json({
    id: comment.id,
    videoId: comment.video_id,
    userId: comment.user_id,
    userName: session.user.name,
    userPhotoURL: session.user.image,
    text: comment.text,
    createdAt: new Date(comment.created_at).toISOString(),
  });
}
