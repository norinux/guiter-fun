export interface VideoPost {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL: string | null;
  videoURL: string;
  thumbnailURL: string | null;
  title: string;
  description: string;
  likes: string[]; // ユーザーIDの配列
  savedBy: string[]; // ブックマークしたユーザーIDの配列
  commentCount: number;
  createdAt: string; // ISO 8601
}

export interface VideoComment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userPhotoURL: string | null;
  text: string;
  createdAt: string; // ISO 8601
}
