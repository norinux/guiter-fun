import { NextResponse } from "next/server";
import { getDownloadUrl } from "@vercel/blob";
import { getDb } from "@/lib/db";
import { auth } from "../../../../auth";

export async function GET() {
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
    ORDER BY v.created_at DESC
  `;

  const videos = rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userPhotoURL: row.user_photo_url,
    videoURL: getDownloadUrl(row.video_url as string),
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

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { videoURL, title, description } = body;

  if (!videoURL || !title?.trim()) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const sql = getDb();
  const rows = await sql`
    INSERT INTO videos (user_id, video_url, title, description)
    VALUES (${session.user.id}, ${videoURL}, ${title.trim()}, ${description?.trim() ?? ""})
    RETURNING *
  `;

  const video = rows[0];
  return NextResponse.json({
    id: video.id,
    userId: video.user_id,
    userName: session.user.name,
    userPhotoURL: session.user.image,
    videoURL: video.video_url,
    thumbnailURL: video.thumbnail_url,
    title: video.title,
    description: video.description,
    likes: [],
    savedBy: [],
    commentCount: 0,
    createdAt: new Date(video.created_at).toISOString(),
  });
}
