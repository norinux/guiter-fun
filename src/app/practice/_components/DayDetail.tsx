"use client";

import { PracticeSession } from "@/types/practice";

interface DayDetailProps {
  date: string; // "YYYY-MM-DD"
  sessions: PracticeSession[];
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

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${m}月${d}日（${weekdays[date.getDay()]}）`;
}

export default function DayDetail({ date, sessions }: DayDetailProps) {
  const daySessions = sessions
    .filter((s) => {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return key === date;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalSeconds = daySessions.reduce((sum, s) => sum + s.durationSeconds, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4 md:p-6">
      <h3 className="mb-3 text-lg font-semibold text-white">
        {formatDateLabel(date)}
      </h3>

      {daySessions.length === 0 ? (
        <p className="text-sm text-slate-500">
          この日は練習記録がありません
        </p>
      ) : (
        <>
          <div className="mb-4 rounded-lg bg-primary/5 p-3">
            <div className="text-sm text-slate-400">この日の練習時間</div>
            <div className="text-2xl font-bold text-white">
              {formatDuration(totalSeconds)}
            </div>
            <div className="text-xs text-slate-500">
              {daySessions.length}回のセッション
            </div>
          </div>

          <div className="space-y-2">
            {daySessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg border border-white/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-300">
                    {categoryLabels[session.category]}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTime(session.date)}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-semibold text-white">
                    {formatDuration(session.durationSeconds)}
                  </span>
                  {session.bpm && (
                    <span className="text-xs text-slate-500">
                      {session.bpm} BPM
                    </span>
                  )}
                </div>
                {session.notes && (
                  <p className="mt-1 text-xs text-slate-400">{session.notes}</p>
                )}
                {session.chordsPracticed && session.chordsPracticed.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {session.chordsPracticed.map((chord) => (
                      <span
                        key={chord}
                        className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"
                      >
                        {chord}
                      </span>
                    ))}
                  </div>
                )}
                {session.tabPracticed && (
                  <p className="mt-1 text-xs text-primary/80">
                    🎵 {session.tabPracticed}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
