import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseDb, getFirebaseStorage, isFirebaseConfigured } from "./firebase";
import { VideoPost, VideoComment } from "@/types/video";

// 動画投稿
export async function uploadVideo(
  file: File,
  userId: string,
  userName: string,
  userPhotoURL: string | null,
  title: string,
  description: string
): Promise<VideoPost | null> {
  const db = getFirebaseDb();
  const storage = getFirebaseStorage();
  if (!db || !storage) return null;

  // Storage に動画をアップロード
  const storageRef = ref(storage, `videos/${userId}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const videoURL = await getDownloadURL(storageRef);

  const post: Omit<VideoPost, "id"> = {
    userId,
    userName,
    userPhotoURL,
    videoURL,
    thumbnailURL: null,
    title,
    description,
    likes: [],
    savedBy: [],
    commentCount: 0,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, "videos"), {
    ...post,
    _createdAt: serverTimestamp(),
  });

  return { ...post, id: docRef.id };
}

// 動画フィード取得（新着順）
export async function getVideoFeed(): Promise<VideoPost[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(collection(db, "videos"), orderBy("_createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      userName: data.userName,
      userPhotoURL: data.userPhotoURL,
      videoURL: data.videoURL,
      thumbnailURL: data.thumbnailURL,
      title: data.title,
      description: data.description,
      likes: data.likes ?? [],
      savedBy: data.savedBy ?? [],
      commentCount: data.commentCount ?? 0,
      createdAt:
        data.createdAt ??
        (data._createdAt instanceof Timestamp
          ? data._createdAt.toDate().toISOString()
          : new Date().toISOString()),
    } satisfies VideoPost;
  });
}

// いいねトグル
export async function toggleLike(
  videoId: string,
  userId: string,
  isLiked: boolean
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const videoRef = doc(db, "videos", videoId);
  await updateDoc(videoRef, {
    likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
  });
}

// ブックマークトグル
export async function toggleSave(
  videoId: string,
  userId: string,
  isSaved: boolean
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const videoRef = doc(db, "videos", videoId);
  await updateDoc(videoRef, {
    savedBy: isSaved ? arrayRemove(userId) : arrayUnion(userId),
  });
}

// コメント投稿
export async function addComment(
  videoId: string,
  userId: string,
  userName: string,
  userPhotoURL: string | null,
  text: string
): Promise<VideoComment | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const comment: Omit<VideoComment, "id"> = {
    videoId,
    userId,
    userName,
    userPhotoURL,
    text,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, "comments"), {
    ...comment,
    _createdAt: serverTimestamp(),
  });

  // コメント数を更新
  const videoRef = doc(db, "videos", videoId);
  const videosSnap = await getDocs(
    query(collection(db, "comments"), where("videoId", "==", videoId))
  );
  await updateDoc(videoRef, { commentCount: videosSnap.size });

  return { ...comment, id: docRef.id };
}

// コメント取得
export async function getComments(videoId: string): Promise<VideoComment[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    collection(db, "comments"),
    where("videoId", "==", videoId),
    orderBy("_createdAt", "asc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      videoId: data.videoId,
      userId: data.userId,
      userName: data.userName,
      userPhotoURL: data.userPhotoURL,
      text: data.text,
      createdAt:
        data.createdAt ??
        (data._createdAt instanceof Timestamp
          ? data._createdAt.toDate().toISOString()
          : new Date().toISOString()),
    } satisfies VideoComment;
  });
}

// ユーザーの投稿取得
export async function getUserVideos(userId: string): Promise<VideoPost[]> {
  const db = getFirebaseDb();
  if (!db) return [];

  const q = query(
    collection(db, "videos"),
    where("userId", "==", userId),
    orderBy("_createdAt", "desc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      userName: data.userName,
      userPhotoURL: data.userPhotoURL,
      videoURL: data.videoURL,
      thumbnailURL: data.thumbnailURL,
      title: data.title,
      description: data.description,
      likes: data.likes ?? [],
      savedBy: data.savedBy ?? [],
      commentCount: data.commentCount ?? 0,
      createdAt:
        data.createdAt ??
        (data._createdAt instanceof Timestamp
          ? data._createdAt.toDate().toISOString()
          : new Date().toISOString()),
    } satisfies VideoPost;
  });
}

export { isFirebaseConfigured };
