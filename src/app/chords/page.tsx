"use client";

import { useState } from "react";
import { chords } from "@/data/chords";
import { ChordDefinition } from "@/types/chord";
import ChordDiagram from "./_components/ChordDiagram";
import ChordSelector from "./_components/ChordSelector";
import ChordProgression from "./_components/ChordProgression";

export default function ChordsPage() {
  const [selectedChord, setSelectedChord] = useState<ChordDefinition>(
    chords[0]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">コード練習</h1>

      {/* 選択中のコード図（大） */}
      <div className="mb-8 flex justify-center rounded-2xl border border-foreground/10 bg-surface p-6">
        <ChordDiagram chord={selectedChord} size={1.5} />
      </div>

      {/* コードセレクター */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">コードを選択</h2>
        <ChordSelector
          selectedChordId={selectedChord.id}
          onSelect={setSelectedChord}
        />
      </section>

      {/* コード進行 */}
      <section>
        <ChordProgression onChordSelect={setSelectedChord} />
      </section>
    </div>
  );
}
