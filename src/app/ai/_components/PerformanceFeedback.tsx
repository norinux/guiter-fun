"use client";

import { useState } from "react";
import type { SkillLevel } from "@/lib/ai/prompts";

interface Props {
  skillLevel: SkillLevel;
}

export default function PerformanceFeedback({ skillLevel }: Props) {
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          level: skillLevel,
        }),
      });

      if (!res.ok) {
        throw new Error("フィードバックの取得に失敗しました");
      }

      const data = await res.json();
      setFeedback(data.feedback);
    } catch {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          練習内容を教えてください
        </h3>
        <p className="mb-4 text-sm text-slate-400">
          何を練習したか、どんな状況かを詳しく書くほど具体的なアドバイスがもらえます
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例: Fコードの練習を1週間続けていますが、1弦の音がきれいに鳴りません。人差し指のセーハが難しいです。"
          rows={5}
          maxLength={1000}
          disabled={loading}
          className="w-full resize-none rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-primary disabled:opacity-50"
        />
        <div className="mt-1 text-right text-xs text-slate-500">
          {description.length}/1000
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !description.trim()}
        className="w-full rounded-xl bg-primary py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {loading ? "分析中..." : "フィードバックをもらう"}
      </button>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {feedback && (
        <div className="rounded-xl border border-white/10 bg-surface p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h4 className="font-semibold text-white">フィードバック</h4>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
}
