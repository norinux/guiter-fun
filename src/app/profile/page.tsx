"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { VideoPost } from "@/types/video";
import { getUserVideos, getVideoFeed, isFirebaseConfigured } from "@/lib/video-service";
import VideoCard from "../videos/_components/VideoCard";

type Tab = "posts" | "saved";

export default function ProfilePage() {
  const { user, loading: authLoading, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [myVideos, setMyVideos] = useState<VideoPost[]>([]);
  const [savedVideos, setSavedVideos] = useState<VideoPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !isFirebaseConfigured()) return;

    const load = async () => {
      setLoading(true);
      const [userVids, allVids] = await Promise.all([
        getUserVideos(user.uid),
        getVideoFeed(),
      ]);
      setMyVideos(userVids);
      setSavedVideos(allVids.filter((v) => v.savedBy.includes(user.uid)));
      setLoading(false);
    };
    load();
  }, [user]);

  const handleVideoUpdate = (updated: VideoPost) => {
    setMyVideos((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
    setSavedVideos((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mb-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto text-slate-600"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h1 className="mb-3 text-2xl font-bold text-white">プロフィール</h1>
        <p className="mb-6 text-slate-400">
          ログインして、自分の投稿や保存した動画を管理しよう
        </p>
        <button
          onClick={signIn}
          className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Googleでログイン
        </button>
      </div>
    );
  }

  const currentVideos = activeTab === "posts" ? myVideos : savedVideos;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* ユーザー情報 */}
      <div className="mb-6 flex items-center gap-4">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="h-16 w-16 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-slate-600" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">
            {user.displayName}
          </h1>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      {/* タブ */}
      <div className="mb-6 flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "border-b-2 border-primary text-primary"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          自分の投稿 ({myVideos.length})
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            activeTab === "saved"
              ? "border-b-2 border-primary text-primary"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          保存した動画 ({savedVideos.length})
        </button>
      </div>

      {/* コンテンツ */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : currentVideos.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface p-8 text-center">
          <p className="text-slate-500">
            {activeTab === "posts"
              ? "まだ動画を投稿していません"
              : "保存した動画はありません"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onUpdate={handleVideoUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
