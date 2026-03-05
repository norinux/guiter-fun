"use client";

import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PracticeSession } from "@/types/practice";
import PracticeCalendar from "./_components/PracticeCalendar";
import DayDetail from "./_components/DayDetail";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}時間${m > 0 ? `${m}分` : ""}`;
  if (m > 0) return `${m}分`;
  return `${seconds}秒`;
}

export default function PracticePage() {
  const [sessions] = useLocalStorage<PracticeSession[]>(
    "guitar-fun-sessions",
    []
  );

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  };

  // Monthly stats
  const monthStats = useMemo(() => {
    const monthSessions = sessions.filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const totalSeconds = monthSessions.reduce(
      (sum, s) => sum + s.durationSeconds,
      0
    );
    const practiceDays = new Set(
      monthSessions.map((s) => new Date(s.date).getDate())
    ).size;
    return { count: monthSessions.length, totalSeconds, practiceDays };
  }, [sessions, year, month]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">練習記録</h1>

      {/* Monthly summary */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-surface p-3 text-center">
          <div className="text-2xl font-bold text-white">
            {monthStats.practiceDays}
          </div>
          <div className="text-xs text-slate-500">練習日数</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface p-3 text-center">
          <div className="text-2xl font-bold text-white">
            {monthStats.count}
          </div>
          <div className="text-xs text-slate-500">セッション</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface p-3 text-center">
          <div className="text-2xl font-bold text-white">
            {monthStats.totalSeconds > 0
              ? formatDuration(monthStats.totalSeconds)
              : "0分"}
          </div>
          <div className="text-xs text-slate-500">合計時間</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PracticeCalendar
          year={year}
          month={month}
          sessions={sessions}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <div>
          {selectedDate ? (
            <DayDetail date={selectedDate} sessions={sessions} />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="text-sm text-slate-500">
                カレンダーの日付をタップすると、その日の練習記録が表示されます
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
