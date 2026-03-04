"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import PracticeAssistant from "./_components/PracticeAssistant";
import PerformanceFeedback from "./_components/PerformanceFeedback";
import type { SkillLevel } from "@/lib/ai/prompts";

type Tab = "assistant" | "feedback";

const skillLevelConfig: {
  value: SkillLevel;
  label: string;
}[] = [
  { value: "beginner", label: "初心者" },
  { value: "intermediate", label: "中級者" },
  { value: "advanced", label: "上級者" },
];

export default function AiPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("assistant");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("beginner");

  const levelIndex = skillLevelConfig.findIndex((l) => l.value === skillLevel);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    setSkillLevel(skillLevelConfig[idx].value);
  };

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
        <h1 className="mb-3 text-2xl font-bold text-white">AIアシスタント</h1>

        {/* スキルレベル スライダー */}
        <div className="mb-4 px-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">レベル</span>
            <span className="text-xs font-medium text-primary">
              {skillLevelConfig[levelIndex].label}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={levelIndex}
            onChange={handleSliderChange}
            className="skill-slider w-full"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            {skillLevelConfig.map(({ label }) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

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
        <PracticeAssistant skillLevel={skillLevel} />
      ) : (
        <PerformanceFeedback skillLevel={skillLevel} />
      )}
    </div>
  );
}
