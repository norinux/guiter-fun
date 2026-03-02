"use client";

import { useMetronome } from "@/hooks/useMetronome";

interface MetronomeProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

export default function Metronome({ bpm, onBpmChange }: MetronomeProps) {
  const metronome = useMetronome(bpm);

  const handleBpmChange = (newBpm: number) => {
    const clamped = Math.max(40, Math.min(240, newBpm));
    metronome.setBpm(clamped);
    onBpmChange(clamped);
  };

  return (
    <div className="rounded-2xl border border-foreground/10 bg-surface p-6">
      <h2 className="mb-4 text-xl font-semibold">メトロノーム</h2>

      {/* BPM表示 */}
      <div className="mb-4 text-center">
        <span className="text-5xl font-bold tabular-nums">{metronome.bpm}</span>
        <span className="ml-2 text-lg text-foreground/50">BPM</span>
      </div>

      {/* BPMスライダー */}
      <div className="mb-4">
        <input
          type="range"
          min={40}
          max={240}
          value={metronome.bpm}
          onChange={(e) => handleBpmChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-foreground/40">
          <span>40</span>
          <span>240</span>
        </div>
      </div>

      {/* BPM微調整ボタン */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <button
          onClick={() => handleBpmChange(metronome.bpm - 5)}
          className="rounded-lg border border-foreground/10 px-3 py-1.5 text-sm hover:bg-foreground/5"
        >
          -5
        </button>
        <button
          onClick={() => handleBpmChange(metronome.bpm - 1)}
          className="rounded-lg border border-foreground/10 px-3 py-1.5 text-sm hover:bg-foreground/5"
        >
          -1
        </button>
        <button
          onClick={() => handleBpmChange(metronome.bpm + 1)}
          className="rounded-lg border border-foreground/10 px-3 py-1.5 text-sm hover:bg-foreground/5"
        >
          +1
        </button>
        <button
          onClick={() => handleBpmChange(metronome.bpm + 5)}
          className="rounded-lg border border-foreground/10 px-3 py-1.5 text-sm hover:bg-foreground/5"
        >
          +5
        </button>
      </div>

      {/* 拍子設定 */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="text-sm text-foreground/60">拍子:</span>
        {[2, 3, 4, 6].map((beats) => (
          <button
            key={beats}
            onClick={() => metronome.setBeatsPerMeasure(beats)}
            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
              metronome.beatsPerMeasure === beats
                ? "bg-primary text-white"
                : "bg-foreground/5 hover:bg-foreground/10"
            }`}
          >
            {beats}/4
          </button>
        ))}
      </div>

      {/* ビートインジケーター */}
      <div className="mb-6 flex justify-center gap-3">
        {Array.from({ length: metronome.beatsPerMeasure }, (_, i) => (
          <div
            key={i}
            className={`h-6 w-6 rounded-full transition-all duration-100 ${
              metronome.isPlaying && metronome.currentBeat === i
                ? i === 0
                  ? "scale-125 bg-beat-active"
                  : "scale-125 bg-primary"
                : "bg-foreground/15"
            }`}
          />
        ))}
      </div>

      {/* 再生/停止ボタン */}
      <div className="flex justify-center">
        <button
          onClick={metronome.isPlaying ? metronome.stop : metronome.start}
          className={`rounded-full px-8 py-3 text-lg font-semibold text-white transition-colors ${
            metronome.isPlaying
              ? "bg-beat-active hover:bg-red-600"
              : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {metronome.isPlaying ? "停止" : "再生"}
        </button>
      </div>
    </div>
  );
}
