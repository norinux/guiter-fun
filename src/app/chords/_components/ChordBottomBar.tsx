"use client";

import { useState } from "react";
import { chords } from "@/data/chords";
import { ChordDefinition } from "@/types/chord";

interface ChordBottomBarProps {
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

export default function ChordBottomBar({
  selectedChordId,
  onSelect,
}: ChordBottomBarProps) {
  const [category, setCategory] = useState<Category>("all");
  const [isOpen, setIsOpen] = useState(false);

  const filtered =
    category === "all"
      ? chords
      : chords.filter((c) => c.category === category);

  return (
    <div className="fixed left-0 right-0 z-40 bottom-[49px] md:bottom-0">
      {/* トグルバー */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border-t border-foreground/10 bg-background/95 backdrop-blur px-4 py-2.5"
      >
        <span className="text-sm font-semibold">
          コード一覧
          {selectedChordId && (
            <span className="ml-2 text-primary">({selectedChordId})</span>
          )}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 12 10 8 14 12" />
        </svg>
      </button>

      {/* 展開パネル */}
      <div
        className={`overflow-hidden border-t border-foreground/10 bg-background/95 backdrop-blur transition-all duration-300 ${
          isOpen ? "max-h-40" : "max-h-0 border-t-0"
        }`}
      >
        <div className="px-4 py-3">
          {/* カテゴリフィルター */}
          <div className="mb-3 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  category === cat.key
                    ? "bg-primary text-white"
                    : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* コードボタン横スクロール */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filtered.map((chord) => (
              <button
                key={chord.id}
                onClick={() => onSelect(chord)}
                className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                  selectedChordId === chord.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-foreground/10 bg-surface hover:border-primary/30"
                }`}
              >
                {chord.nameShort}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
