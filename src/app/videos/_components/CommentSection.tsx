"use client";

import { useState, useEffect } from "react";
import { VideoComment } from "@/types/video";
import { getComments, addComment } from "@/lib/video-service";
import { useAuth } from "@/contexts/AuthContext";
import CommentInput from "./CommentInput";

interface CommentSectionProps {
  videoId: string;
  onCommentAdded?: () => void;
}

export default function CommentSection({
  videoId,
  onCommentAdded,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const loadComments = async () => {
    setLoading(true);
    const data = await getComments(videoId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (text: string) => {
    if (!user) return;
    const comment = await addComment(videoId, text);
    if (comment) {
      setComments((prev) => [...prev, comment]);
      onCommentAdded?.();
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "たった今";
    if (diffMin < 60) return `${diffMin}分前`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}時間前`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}日前`;
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-300">
        コメント {comments.length > 0 && `(${comments.length})`}
      </h4>

      {loading ? (
        <div className="py-4 text-center text-sm text-slate-500">
          読み込み中...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center text-sm text-slate-500">
          まだコメントはありません
        </div>
      ) : (
        <div className="max-h-60 space-y-2 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-2 rounded-lg bg-background p-2.5"
            >
              {comment.userPhotoURL ? (
                <img
                  src={comment.userPhotoURL}
                  alt=""
                  className="h-7 w-7 rounded-full shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-slate-600 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-slate-300">
                    {comment.userName}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-400 break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <CommentInput onSubmit={handleSubmit} />
      ) : (
        <p className="text-center text-xs text-slate-500">
          コメントするにはログインしてください
        </p>
      )}
    </div>
  );
}
