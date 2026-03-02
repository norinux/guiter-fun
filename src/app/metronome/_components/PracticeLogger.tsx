"use client";

import { useState } from "react";
import { PracticeSession } from "@/types/practice";

interface PracticeLoggerProps {
  durationSeconds: number;
  bpm: number;
  onSave: (session: PracticeSession) => void;
  onCancel: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}分${s > 0 ? `${s}秒` : ""}`;
  return `${s}秒`;
}

export default function PracticeLogger({
  durationSeconds,
  bpm,
  onSave,
  onCancel,
}: PracticeLoggerProps) {
  const [category, setCategory] = useState<PracticeSession["category"]>("metronome");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    const session: PracticeSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      durationSeconds,
      bpm,
      category,
      notes,
    };
    onSave(session);
  };

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-surface p-6">
      <h2 className="mb-4 text-xl font-semibold">練習を記録</h2>

      <div className="mb-4 text-sm text-foreground/60">
        練習時間: <span className="font-semibold text-foreground">{formatDuration(durationSeconds)}</span>
        {bpm > 0 && (
          <>
            {" "}/ テンポ: <span className="font-semibold text-foreground">{bpm} BPM</span>
          </>
        )}
      </div>

      {/* カテゴリ */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">練習内容</label>
        <div className="flex flex-wrap gap-2">
          {([
            { key: "chords", label: "コード練習" },
            { key: "tabs", label: "タブ譜" },
            { key: "metronome", label: "リズム練習" },
            { key: "free", label: "自由練習" },
          ] as const).map((item) => (
            <button
              key={item.key}
              onClick={() => setCategory(item.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === item.key
                  ? "bg-primary text-white"
                  : "bg-foreground/5 hover:bg-foreground/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* メモ */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">メモ（任意）</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="今日の練習について..."
          rows={3}
          className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="rounded-full bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-foreground/20 px-6 py-2.5 font-semibold transition-colors hover:bg-foreground/5"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
