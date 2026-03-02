"use client";

import { PracticeSession } from "@/types/practice";

interface PracticeHistoryProps {
  sessions: PracticeSession[];
  onClear: () => void;
}

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
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function PracticeHistory({
  sessions,
  onClear,
}: PracticeHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
        <h2 className="mb-2 text-xl font-semibold">練習記録</h2>
        <p className="text-sm text-foreground/50">
          まだ練習記録がありません。タイマーを使って練習を記録しましょう。
        </p>
      </div>
    );
  }

  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">練習記録</h2>
        <button
          onClick={onClear}
          className="text-xs text-foreground/40 hover:text-beat-active"
        >
          すべて削除
        </button>
      </div>

      <div className="mb-4 rounded-lg bg-primary/5 p-3">
        <div className="text-sm text-foreground/60">合計練習時間</div>
        <div className="text-2xl font-bold">{formatDuration(totalSeconds)}</div>
        <div className="text-xs text-foreground/40">{sessions.length}回のセッション</div>
      </div>

      <div className="space-y-2">
        {sorted.map((session) => (
          <div
            key={session.id}
            className="rounded-lg border border-foreground/5 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs font-medium">
                {categoryLabels[session.category]}
              </span>
              <span className="text-xs text-foreground/40">
                {formatDate(session.date)}
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-semibold">
                {formatDuration(session.durationSeconds)}
              </span>
              {session.bpm && (
                <span className="text-xs text-foreground/40">
                  {session.bpm} BPM
                </span>
              )}
            </div>
            {session.notes && (
              <p className="mt-1 text-xs text-foreground/50">{session.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
