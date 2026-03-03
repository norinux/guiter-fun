"use client";

import { useState, useRef } from "react";
import { uploadVideo } from "@/lib/video-service";
import { useAuth } from "@/contexts/AuthContext";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

export default function VideoUploadModal({
  isOpen,
  onClose,
  onUploaded,
}: VideoUploadModalProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // 動画ファイルのみ許可（100MB上限）
    if (!selected.type.startsWith("video/")) {
      setError("動画ファイルを選択してください");
      return;
    }
    if (selected.size > 500 * 1024 * 1024) {
      setError("ファイルサイズは500MB以下にしてください");
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!user || !file || !title.trim()) return;

    setUploading(true);
    setError(null);

    try {
      await uploadVideo(file, title.trim(), description.trim());
      setFile(null);
      setTitle("");
      setDescription("");
      onUploaded();
      onClose();
    } catch {
      setError("アップロードに失敗しました。もう一度お試しください。");
    } finally {
      setUploading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !uploading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">動画を投稿</h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="text-slate-400 hover:text-white disabled:opacity-50"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ファイル選択 */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-background p-8 text-sm text-slate-400 transition-colors hover:border-primary/40 hover:text-slate-300 disabled:opacity-50"
          >
            {file ? (
              <span className="text-white font-medium">{file.name}</span>
            ) : (
              <>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                動画を選択（撮影も可）
              </>
            )}
          </button>
        </div>

        {/* タイトル */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-300">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: Smoke on the Water 練習中"
            disabled={uploading}
            maxLength={100}
            className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        {/* 説明 */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-slate-300">
            説明（任意）
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="練習のポイントや質問など..."
            disabled={uploading}
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-primary disabled:opacity-50"
          />
        </div>

        {/* 投稿ボタン */}
        <button
          onClick={handleSubmit}
          disabled={uploading || !file || !title.trim()}
          className="w-full rounded-xl bg-primary py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {uploading ? "アップロード中..." : "投稿する"}
        </button>
      </div>
    </div>
  );
}
