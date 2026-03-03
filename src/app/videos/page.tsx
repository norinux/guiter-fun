"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import VideoFeed from "./_components/VideoFeed";
import VideoUploadModal from "./_components/VideoUploadModal";

export default function VideosPage() {
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">動画</h1>
        {user && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            投稿する
          </button>
        )}
      </div>

      <div key={refreshKey}>
        <VideoFeed />
      </div>

      <VideoUploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
