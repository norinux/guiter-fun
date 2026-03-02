"use client";

import { useState } from "react";
import { progressions } from "@/data/progressions";
import { getChordById } from "@/data/chords";
import { ChordDefinition } from "@/types/chord";
import ChordDiagram from "./ChordDiagram";

interface ChordProgressionProps {
  onChordSelect: (chord: ChordDefinition) => void;
}

export default function ChordProgression({
  onChordSelect,
}: ChordProgressionProps) {
  const [selectedProgId, setSelectedProgId] = useState<string | null>(null);

  const selectedProg = progressions.find((p) => p.id === selectedProgId);

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">コード進行</h3>

      {/* 進行リスト */}
      <div className="mb-6 flex flex-wrap gap-2">
        {progressions.map((prog) => (
          <button
            key={prog.id}
            onClick={() =>
              setSelectedProgId(selectedProgId === prog.id ? null : prog.id)
            }
            className={`rounded-lg border px-4 py-2 text-left transition-all ${
              selectedProgId === prog.id
                ? "border-secondary bg-secondary/10"
                : "border-foreground/10 hover:border-secondary/30"
            }`}
          >
            <div className="text-sm font-semibold">{prog.name}</div>
            <div className="text-xs text-foreground/50">
              {prog.chordIds.join(" → ")}
            </div>
          </button>
        ))}
      </div>

      {/* 選択した進行のコード表示 */}
      {selectedProg && (
        <div>
          <p className="mb-4 text-sm text-foreground/60">
            {selectedProg.description}
          </p>
          <div className="flex flex-wrap items-start justify-center gap-4">
            {selectedProg.chordIds.map((chordId, idx) => {
              const chord = getChordById(chordId);
              if (!chord) return null;
              return (
                <button
                  key={`${chordId}-${idx}`}
                  onClick={() => onChordSelect(chord)}
                  className="rounded-xl border border-foreground/10 p-3 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <ChordDiagram chord={chord} size={0.8} />
                  {idx < selectedProg.chordIds.length - 1 && (
                    <span className="sr-only">→</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
