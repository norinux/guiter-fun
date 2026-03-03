"use client";

import { PitchResult } from "@/lib/pitch-detection";

interface TunerDisplayProps {
  pitchResult: PitchResult | null;
  isListening: boolean;
}

export default function TunerDisplay({
  pitchResult,
  isListening,
}: TunerDisplayProps) {
  // 半円ゲージ: -50 ~ +50 cents を 0 ~ 180度にマッピング
  const cents = pitchResult?.cents ?? 0;
  // -50 cents → -90度, 0 cents → 0度, +50 cents → +90度
  const needleAngle = (cents / 50) * 90;
  const clampedAngle = Math.max(-90, Math.min(90, needleAngle));

  // 精度に応じた色
  const getAccuracyColor = (centValue: number) => {
    const abs = Math.abs(centValue);
    if (abs <= 5) return "#10b981"; // 緑: ほぼ合ってる
    if (abs <= 15) return "#f59e0b"; // 黄: 少しずれてる
    return "#ef4444"; // 赤: かなりずれてる
  };

  const accuracyColor = pitchResult
    ? getAccuracyColor(pitchResult.cents)
    : "#64748b";

  return (
    <div className="flex flex-col items-center">
      {/* 半円ゲージ */}
      <div className="relative w-72 h-40 mb-4">
        <svg viewBox="0 0 300 160" className="w-full h-full">
          {/* 背景の弧 */}
          <path
            d="M 30 150 A 120 120 0 0 1 270 150"
            fill="none"
            stroke="#334155"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* 中央の緑ゾーン */}
          <path
            d="M 139 31.5 A 120 120 0 0 1 161 31.5"
            fill="none"
            stroke="#10b981"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* 目盛り */}
          {[-50, -25, 0, 25, 50].map((val) => {
            const angle = ((val / 50) * 90 - 90) * (Math.PI / 180);
            const cx = 150;
            const cy = 150;
            const r = 120;
            const x1 = cx + (r - 10) * Math.cos(angle);
            const y1 = cy + (r - 10) * Math.sin(angle);
            const x2 = cx + (r + 10) * Math.cos(angle);
            const y2 = cy + (r + 10) * Math.sin(angle);
            const labelX = cx + (r + 24) * Math.cos(angle);
            const labelY = cy + (r + 24) * Math.sin(angle);
            return (
              <g key={val}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#64748b"
                  fontSize="10"
                >
                  {val > 0 ? `+${val}` : val}
                </text>
              </g>
            );
          })}

          {/* 針 */}
          {isListening && pitchResult && (
            <line
              x1="150"
              y1="150"
              x2={
                150 +
                100 *
                  Math.cos(((clampedAngle - 90) * Math.PI) / 180)
              }
              y2={
                150 +
                100 *
                  Math.sin(((clampedAngle - 90) * Math.PI) / 180)
              }
              stroke={accuracyColor}
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transition: "all 0.1s ease-out" }}
            />
          )}

          {/* 中心点 */}
          <circle cx="150" cy="150" r="6" fill={accuracyColor} />
        </svg>
      </div>

      {/* 音名表示 */}
      <div className="text-center mb-4">
        {isListening && pitchResult ? (
          <>
            <div
              className="text-6xl font-bold mb-1 transition-colors"
              style={{ color: accuracyColor }}
            >
              {pitchResult.noteName}
              <span className="text-3xl text-slate-400">
                {pitchResult.octave}
              </span>
            </div>
            <div className="text-lg text-slate-400">
              {pitchResult.frequency.toFixed(1)} Hz
            </div>
            <div
              className="text-sm font-medium mt-1"
              style={{ color: accuracyColor }}
            >
              {pitchResult.cents > 0
                ? `+${pitchResult.cents} セント（高い）`
                : pitchResult.cents < 0
                  ? `${pitchResult.cents} セント（低い）`
                  : "ぴったり！"}
            </div>
          </>
        ) : (
          <div className="text-4xl font-bold text-slate-600">
            {isListening ? "音を検出中..." : "---"}
          </div>
        )}
      </div>
    </div>
  );
}
