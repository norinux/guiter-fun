"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import PracticeAssistant from "./_components/PracticeAssistant";
import PerformanceFeedback from "./_components/PerformanceFeedback";

type Tab = "assistant" | "feedback";

export default function AiPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("assistant");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-4 text-5xl">🎸</div>
        <h2 className="mb-2 text-xl font-bold text-white">
          AIアシスタントを使うにはログインが必要です
        </h2>
        <p className="mb-6 text-sm text-slate-400">
          ログインしてギター練習をもっと効率的にしましょう
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          ログイン
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* ヘッダー */}
      <div className="border-b border-white/10 px-4 pt-6 pb-0">
        <h1 className="mb-4 text-2xl font-bold text-white">AIアシスタント</h1>

        {/* タブ */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("assistant")}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === "assistant"
                ? "border-b-2 border-primary text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            練習アシスタント
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === "feedback"
                ? "border-b-2 border-primary text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            演奏フィードバック
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      {activeTab === "assistant" ? (
        <PracticeAssistant />
      ) : (
        <PerformanceFeedback />
      )}
    </div>
  );
}
