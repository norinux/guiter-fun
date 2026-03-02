"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { TabSong } from "@/types/tab";

interface TabPlayerProps {
  tab: TabSong;
  onPositionChange: (position: number) => void;
  onPlayingChange: (isPlaying: boolean) => void;
}

export default function TabPlayer({
  tab,
  onPositionChange,
  onPlayingChange,
}: TabPlayerProps) {
  const [bpm, setBpm] = useState(tab.defaultBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const positionRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bpmRef = useRef(bpm);

  // タブの全体列数
  const totalColumns = tab.measures.reduce(
    (sum, m, idx) => sum + m.strings[0].length + (idx > 0 ? 1 : 0),
    0
  );

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  // タブが変わったらリセット
  useEffect(() => {
    stop();
    setBpm(tab.defaultBpm);
    positionRef.current = 0;
    onPositionChange(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.id]);

  const tick = useCallback(() => {
    positionRef.current += 1;
    if (positionRef.current >= totalColumns) {
      positionRef.current = 0;
    }
    onPositionChange(positionRef.current);
  }, [totalColumns, onPositionChange]);

  const play = useCallback(() => {
    if (intervalRef.current) return;
    setIsPlaying(true);
    onPlayingChange(true);
    // 1ビート = 60/bpm秒、1列 ≈ 1/4ビート（音符の密度に応じて調整）
    const msPerColumn = (60 / bpmRef.current / 2) * 1000;
    intervalRef.current = setInterval(() => {
      tick();
    }, msPerColumn);
  }, [tick, onPlayingChange]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    onPlayingChange(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [onPlayingChange]);

  const reset = useCallback(() => {
    stop();
    positionRef.current = 0;
    onPositionChange(0);
  }, [stop, onPositionChange]);

  // BPM変更時にインターバル更新
  useEffect(() => {
    if (isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      const msPerColumn = (60 / bpm / 2) * 1000;
      intervalRef.current = setInterval(tick, msPerColumn);
    }
  }, [bpm, isPlaying, tick]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleBpmChange = (newBpm: number) => {
    setBpm(Math.max(40, Math.min(240, newBpm)));
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* 再生コントロール */}
      <div className="flex gap-2">
        <button
          onClick={isPlaying ? stop : play}
          className={`rounded-full px-6 py-2 font-semibold text-white transition-colors ${
            isPlaying
              ? "bg-beat-active hover:bg-red-600"
              : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {isPlaying ? "停止" : "再生"}
        </button>
        <button
          onClick={reset}
          className="rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium hover:bg-foreground/5"
        >
          リセット
        </button>
      </div>

      {/* テンポ調整 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleBpmChange(bpm - 5)}
          className="rounded border border-foreground/10 px-2 py-1 text-sm hover:bg-foreground/5"
        >
          -5
        </button>
        <div className="min-w-[80px] text-center">
          <span className="text-xl font-bold tabular-nums">{bpm}</span>
          <span className="ml-1 text-xs text-foreground/50">BPM</span>
        </div>
        <button
          onClick={() => handleBpmChange(bpm + 5)}
          className="rounded border border-foreground/10 px-2 py-1 text-sm hover:bg-foreground/5"
        >
          +5
        </button>
      </div>

      {/* テンポスライダー */}
      <input
        type="range"
        min={40}
        max={240}
        value={bpm}
        onChange={(e) => handleBpmChange(Number(e.target.value))}
        className="flex-1 accent-primary"
      />
    </div>
  );
}
