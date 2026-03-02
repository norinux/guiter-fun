"use client";

import { useState } from "react";
import { chords } from "@/data/chords";
import { ChordDefinition } from "@/types/chord";

interface ChordSelectorProps {
  selectedChordId: string | null;
  onSelect: (chord: ChordDefinition) => void;
}

const categories = [
  { key: "all", label: "すべて" },
  { key: "major", label: "メジャー" },
  { key: "minor", label: "マイナー" },
  { key: "seventh", label: "セブンス" },
] as const;

type Category = (typeof categories)[number]["key"];

export default function ChordSelector({
  selectedChordId,
  onSelect,
}: ChordSelectorProps) {
  const [category, setCategory] = useState<Category>("all");

  const filtered =
    category === "all"
      ? chords
      : chords.filter((c) => c.category === category);

  return (
    <div>
      {/* カテゴリフィルター */}
      <div className="mb-4 flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat.key
                ? "bg-primary text-white"
                : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* コードグリッド */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {filtered.map((chord) => (
          <button
            key={chord.id}
            onClick={() => onSelect(chord)}
            className={`rounded-lg border px-3 py-2 text-center text-sm font-semibold transition-all ${
              selectedChordId === chord.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-foreground/10 hover:border-primary/30 hover:bg-foreground/5"
            }`}
          >
            {chord.nameShort}
          </button>
        ))}
      </div>
    </div>
  );
}
