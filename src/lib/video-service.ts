import { VideoPost, VideoComment } from "@/types/video";

export async function uploadVideo(
  file: File,
  title: string,
  description: string
): Promise<VideoPost | null> {
  // Step 1: Upload file to Vercel Blob
  const formData = new FormData();
  formData.append("file", file);

  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const data = await uploadRes.json();
    throw new Error(data.error || "アップロードに失敗しました");
  }

  const { url: videoURL } = await uploadRes.json();

  // Step 2: Create video record in DB
  const res = await fetch("/api/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoURL, title, description }),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getVideoFeed(): Promise<VideoPost[]> {
  const res = await fetch("/api/videos");
  if (!res.ok) return [];
  return res.json();
}

export async function toggleLike(
  videoId: string,
  userId: string,
  isLiked: boolean
): Promise<void> {
  await fetch(`/api/videos/${videoId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isLiked }),
  });
}

export async function toggleSave(
  videoId: string,
  userId: string,
  isSaved: boolean
): Promise<void> {
  await fetch(`/api/videos/${videoId}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isSaved }),
  });
}

export async function addComment(
  videoId: string,
  text: string
): Promise<VideoComment | null> {
  const res = await fetch(`/api/comments/${videoId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getComments(
  videoId: string
): Promise<VideoComment[]> {
  const res = await fetch(`/api/comments/${videoId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getUserVideos(
  userId: string
): Promise<VideoPost[]> {
  const res = await fetch(`/api/videos/user/${userId}`);
  if (!res.ok) return [];
  return res.json();
}
