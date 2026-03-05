"use client";

import { useMemo } from "react";
import { PracticeSession } from "@/types/practice";

interface PracticeCalendarProps {
  year: number;
  month: number; // 0-indexed
  sessions: PracticeSession[];
  selectedDate: string | null; // "YYYY-MM-DD"
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function PracticeCalendar({
  year,
  month,
  sessions,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: PracticeCalendarProps) {
  // Count sessions per day for this month
  const sessionCountByDay = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sessions) {
      const d = new Date(s.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    }
    return counts;
  }, [sessions, year, month]);

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayKey =
    today.getFullYear() === year && today.getMonth() === month
      ? `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
      : null;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const maxCount = Math.max(1, ...Object.values(sessionCountByDay));

  function getDotOpacity(count: number): string {
    const ratio = count / maxCount;
    if (ratio > 0.7) return "bg-primary";
    if (ratio > 0.3) return "bg-primary/70";
    return "bg-primary/40";
  }

  const monthLabel = `${year}年${month + 1}月`;

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-white">{monthLabel}</h2>
        <button
          onClick={onNextMonth}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-500"
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count = sessionCountByDay[dateKey] || 0;
          const isSelected = selectedDate === dateKey;
          const isToday = dateKey === todayKey;
          const dayOfWeek = (firstDay + day - 1) % 7;

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative ${
                isSelected
                  ? "bg-primary/20 text-white ring-1 ring-primary"
                  : "hover:bg-white/5"
              } ${
                isToday && !isSelected ? "ring-1 ring-white/30" : ""
              } ${
                dayOfWeek === 0 ? "text-red-400" : dayOfWeek === 6 ? "text-blue-400" : "text-slate-300"
              }`}
            >
              <span className={`${isSelected ? "font-bold text-white" : ""}`}>
                {day}
              </span>
              {count > 0 && (
                <span
                  className={`mt-0.5 h-1.5 w-1.5 rounded-full ${getDotOpacity(count)}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          少
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
          中
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          多
        </div>
      </div>
    </div>
  );
}
