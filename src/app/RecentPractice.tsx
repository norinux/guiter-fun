"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PracticeSession } from "@/types/practice";

const categoryLabels: Record<PracticeSession["category"], string> = {
  chords: "コード練習",
  tabs: "タブ譜",
  metronome: "リズム練習",
  free: "自由練習",
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}時間${m > 0 ? `${m}分` : ""}`;
  if (m > 0) return `${m}分`;
  return `${seconds}秒`;
}

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function RecentPractice() {
  const [sessions] = useLocalStorage<PracticeSession[]>(
    "guitar-fun-sessions",
    []
  );

  if (sessions.length === 0) return null;

  const sorted = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
      <h2 className="mb-4 text-lg font-semibold">最近の練習</h2>

      <div className="mb-4 text-sm text-foreground/60">
        合計: <span className="font-semibold text-foreground">{formatDuration(totalSeconds)}</span>
        （{sessions.length}回）
      </div>

      <div className="space-y-2">
        {sorted.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-lg bg-background p-3"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs font-medium">
                {categoryLabels[session.category]}
              </span>
              <span className="text-sm font-medium">
                {formatDuration(session.durationSeconds)}
              </span>
            </div>
            <span className="text-xs text-foreground/40">
              {formatDate(session.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
