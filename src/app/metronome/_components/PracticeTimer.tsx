"use client";

import { useTimer } from "@/hooks/useTimer";

interface PracticeTimerProps {
  onSessionEnd: (durationSeconds: number) => void;
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PracticeTimer({ onSessionEnd }: PracticeTimerProps) {
  const timer = useTimer();

  const handleStop = () => {
    if (timer.elapsedSeconds > 0) {
      onSessionEnd(timer.elapsedSeconds);
    }
    timer.reset();
  };

  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
      <h2 className="mb-4 text-xl font-semibold">練習タイマー</h2>

      <div className="mb-6 text-center">
        <span className="font-mono text-4xl font-bold tabular-nums">
          {formatTime(timer.elapsedSeconds)}
        </span>
      </div>

      <div className="flex justify-center gap-3">
        {!timer.isRunning ? (
          <button
            onClick={timer.start}
            className="rounded-full bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {timer.elapsedSeconds > 0 ? "再開" : "開始"}
          </button>
        ) : (
          <button
            onClick={timer.pause}
            className="rounded-full bg-secondary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-secondary-dark"
          >
            一時停止
          </button>
        )}
        {timer.elapsedSeconds > 0 && (
          <button
            onClick={handleStop}
            className="rounded-full border border-foreground/20 px-6 py-2.5 font-semibold transition-colors hover:bg-foreground/5"
          >
            終了して記録
          </button>
        )}
      </div>
    </div>
  );
}
