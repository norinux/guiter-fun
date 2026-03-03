"use client";

import { useState } from "react";
import { useTuner } from "@/hooks/useTuner";
import { GuitarString, getGuitarStrings } from "@/lib/pitch-detection";
import TunerDisplay from "./_components/TunerDisplay";
import StringSelector from "./_components/StringSelector";

export default function TunerPage() {
  const tuner = useTuner();
  const [selectedString, setSelectedString] = useState<GuitarString | null>(
    getGuitarStrings()[0]
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">チューナー</h1>

      {/* エラー表示 */}
      {tuner.error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {tuner.error}
        </div>
      )}

      {/* ゲージ表示 */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-surface p-6">
        <TunerDisplay
          pitchResult={tuner.pitchResult}
          isListening={tuner.isListening}
        />

        {/* 開始/停止ボタン */}
        <div className="flex justify-center">
          <button
            onClick={tuner.isListening ? tuner.stop : tuner.start}
            className={`rounded-full px-8 py-3 text-lg font-semibold text-white transition-colors ${
              tuner.isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {tuner.isListening ? "停止" : "チューニング開始"}
          </button>
        </div>
      </div>

      {/* 弦選択 */}
      <StringSelector
        selectedString={selectedString}
        pitchResult={tuner.pitchResult}
        isListening={tuner.isListening}
        onSelect={setSelectedString}
        onPlayReference={tuner.playReferenceNote}
      />
    </div>
  );
}
