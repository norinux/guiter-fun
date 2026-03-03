"use client";

import { useState, useEffect, useCallback } from "react";
import { VideoPost } from "@/types/video";
import { getVideoFeed } from "@/lib/video-service";
import VideoCard from "./VideoCard";

export default function VideoFeed() {
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const data = await getVideoFeed();
    setVideos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleVideoUpdate = (updated: VideoPost) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-white/10 bg-surface"
          >
            <div className="aspect-video bg-white/5" />
            <div className="p-4 space-y-3">
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-white/5" />
                <div className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-white/5" />
                  <div className="h-2 w-16 rounded bg-white/5" />
                </div>
              </div>
              <div className="h-4 w-3/4 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface p-8 text-center">
        <p className="text-slate-500 mb-2">まだ投稿がありません</p>
        <p className="text-xs text-slate-600">
          最初の動画を投稿してみましょう！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onUpdate={handleVideoUpdate}
        />
      ))}
    </div>
  );
}
