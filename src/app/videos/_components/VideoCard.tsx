"use client";

import { useState } from "react";
import { VideoPost } from "@/types/video";
import { toggleLike, toggleSave } from "@/lib/video-service";
import { useAuth } from "@/contexts/AuthContext";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";
import CommentSection from "./CommentSection";

interface VideoCardProps {
  video: VideoPost;
  onUpdate: (updated: VideoPost) => void;
}

export default function VideoCard({ video, onUpdate }: VideoCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(video.commentCount);

  const isLiked = user ? video.likes.includes(user.id) : false;
  const isSaved = user ? video.savedBy.includes(user.id) : false;

  const handleLike = async () => {
    if (!user) return;
    await toggleLike(video.id, user.id, isLiked);
    const updatedLikes = isLiked
      ? video.likes.filter((id) => id !== user.id)
      : [...video.likes, user.id];
    onUpdate({ ...video, likes: updatedLikes });
  };

  const handleSave = async () => {
    if (!user) return;
    await toggleSave(video.id, user.id, isSaved);
    const updatedSaved = isSaved
      ? video.savedBy.filter((id) => id !== user.id)
      : [...video.savedBy, user.id];
    onUpdate({ ...video, savedBy: updatedSaved });
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-surface overflow-hidden">
      {/* 動画プレーヤー */}
      <div className="relative aspect-video bg-black">
        <video
          src={video.videoURL}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
      </div>

      {/* 投稿情報 */}
      <div className="p-4">
        {/* ユーザー情報 */}
        <div className="mb-3 flex items-center gap-3">
          {video.userPhotoURL ? (
            <img
              src={video.userPhotoURL}
              alt=""
              className="h-9 w-9 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-slate-600" />
          )}
          <div>
            <div className="text-sm font-medium text-white">
              {video.userName}
            </div>
            <div className="text-xs text-slate-500">
              {formatDate(video.createdAt)}
            </div>
          </div>
        </div>

        {/* タイトル・説明 */}
        <h3 className="mb-1 text-base font-semibold text-white">
          {video.title}
        </h3>
        {video.description && (
          <p className="mb-3 text-sm text-slate-400">{video.description}</p>
        )}

        {/* アクションボタン */}
        <div className="flex items-center gap-4 border-t border-white/5 pt-3">
          <LikeButton
            isLiked={isLiked}
            count={video.likes.length}
            onToggle={handleLike}
            disabled={!user}
          />
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-slate-400"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {commentCount}
          </button>
          <div className="flex-1" />
          <SaveButton
            isSaved={isSaved}
            onToggle={handleSave}
            disabled={!user}
          />
        </div>

        {/* コメントセクション */}
        {showComments && (
          <div className="mt-3 border-t border-white/5 pt-3">
            <CommentSection
              videoId={video.id}
              onCommentAdded={() => setCommentCount((c) => c + 1)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
