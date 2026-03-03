"use client";

import {
  GuitarString,
  getGuitarStrings,
  PitchResult,
} from "@/lib/pitch-detection";

interface StringSelectorProps {
  selectedString: GuitarString | null;
  pitchResult: PitchResult | null;
  isListening: boolean;
  onSelect: (gs: GuitarString) => void;
  onPlayReference: (gs: GuitarString) => void;
}

export default function StringSelector({
  selectedString,
  pitchResult,
  isListening,
  onSelect,
  onPlayReference,
}: StringSelectorProps) {
  const strings = getGuitarStrings();

  const getStringStatus = (gs: GuitarString) => {
    if (!isListening || !pitchResult) return "idle";
    if (pitchResult.closestGuitarString?.note !== gs.note) return "idle";
    const abs = Math.abs(pitchResult.centsFromString);
    if (abs <= 5) return "tuned";
    if (abs <= 15) return "close";
    return "off";
  };

  const statusStyles = {
    idle: "border-white/10 bg-surface",
    tuned: "border-green-500 bg-green-500/10",
    close: "border-yellow-500 bg-yellow-500/10",
    off: "border-red-500 bg-red-500/10",
  };

  const statusDot = {
    idle: "bg-slate-600",
    tuned: "bg-green-500",
    close: "bg-yellow-500",
    off: "bg-red-500",
  };

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-slate-400 uppercase tracking-wider">
        弦を選択
      </h3>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {strings.map((gs) => {
          const status = getStringStatus(gs);
          const isSelected = selectedString?.note === gs.note;
          return (
            <button
              key={gs.note}
              onClick={() => onSelect(gs)}
              className={`relative flex flex-col items-center rounded-xl border p-3 transition-all ${
                statusStyles[status]
              } ${isSelected ? "ring-2 ring-primary" : ""}`}
            >
              <div
                className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full ${statusDot[status]}`}
              />
              <span className="text-lg font-bold text-white">
                {gs.note.replace(/\d/, "")}
              </span>
              <span className="text-[10px] text-slate-400">
                {gs.frequency.toFixed(0)}Hz
              </span>
            </button>
          );
        })}
      </div>

      {/* 基準音再生 */}
      {selectedString && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface p-4">
          <div>
            <div className="text-sm font-medium text-white">
              {selectedString.name}
            </div>
            <div className="text-xs text-slate-400">
              {selectedString.frequency.toFixed(2)} Hz
            </div>
          </div>
          <button
            onClick={() => onPlayReference(selectedString)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <polygon points="3,1 13,8 3,15" />
            </svg>
            基準音を再生
          </button>
        </div>
      )}

      {/* 選択中の弦へのチューニング状態 */}
      {isListening && selectedString && pitchResult && (
        <div className="mt-3 rounded-xl border border-white/10 bg-surface p-4 text-center">
          {pitchResult.closestGuitarString?.note === selectedString.note ? (
            <div>
              <div className="text-sm text-slate-400 mb-1">
                {selectedString.name} とのずれ
              </div>
              <div
                className="text-2xl font-bold"
                style={{
                  color:
                    Math.abs(pitchResult.centsFromString) <= 5
                      ? "#10b981"
                      : Math.abs(pitchResult.centsFromString) <= 15
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              >
                {pitchResult.centsFromString > 0
                  ? `+${pitchResult.centsFromString}`
                  : pitchResult.centsFromString}{" "}
                セント
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              検出音が {selectedString.name} から離れています
            </div>
          )}
        </div>
      )}
    </div>
  );
}
