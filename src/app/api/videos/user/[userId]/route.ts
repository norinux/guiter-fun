import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const sql = getDb();

  const rows = await sql`
    SELECT
      v.id,
      v.user_id,
      u.name AS user_name,
      u.image AS user_photo_url,
      v.video_url,
      v.thumbnail_url,
      v.title,
      v.description,
      v.created_at,
      COALESCE(
        (SELECT json_agg(vl.user_id) FROM video_likes vl WHERE vl.video_id = v.id),
        '[]'::json
      ) AS likes,
      COALESCE(
        (SELECT json_agg(vs.user_id) FROM video_saves vs WHERE vs.video_id = v.id),
        '[]'::json
      ) AS saved_by,
      (SELECT COUNT(*) FROM comments c WHERE c.video_id = v.id)::int AS comment_count
    FROM videos v
    JOIN users u ON v.user_id = u.id
    WHERE v.user_id = ${userId}
    ORDER BY v.created_at DESC
  `;

  const videos = rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userPhotoURL: row.user_photo_url,
    videoURL: row.video_url,
    thumbnailURL: row.thumbnail_url,
    title: row.title,
    description: row.description,
    likes: row.likes ?? [],
    savedBy: row.saved_by ?? [],
    commentCount: row.comment_count,
    createdAt: new Date(row.created_at).toISOString(),
  }));

  return NextResponse.json(videos);
}
