"use client";

import { useState } from "react";
import { sampleTabs } from "@/data/sample-tabs";
import { TabSong } from "@/types/tab";

interface TabBottomBarProps {
  selectedTabId: string | null;
  onSelect: (tab: TabSong) => void;
}

const difficultyLabels = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const difficultyColors = {
  beginner: "text-green-400",
  intermediate: "text-yellow-400",
  advanced: "text-red-400",
};

export default function TabBottomBar({
  selectedTabId,
  onSelect,
}: TabBottomBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTab = sampleTabs.find((t) => t.id === selectedTabId);

  return (
    <div className="fixed left-0 right-0 z-40 bottom-[49px] md:bottom-0">
      {/* トグルバー */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border-t border-foreground/10 bg-background/95 backdrop-blur px-4 py-2.5"
      >
        <span className="text-sm font-semibold">
          曲を選択
          {selectedTab && (
            <span className="ml-2 text-primary">({selectedTab.title})</span>
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
        <div className="flex gap-2 overflow-x-auto px-4 py-3 pb-4 scrollbar-hide">
          {sampleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onSelect(tab);
                setIsOpen(false);
              }}
              className={`shrink-0 rounded-lg border px-4 py-2 text-left transition-all ${
                selectedTabId === tab.id
                  ? "border-primary bg-primary/10"
                  : "border-foreground/10 bg-surface hover:border-primary/30"
              }`}
            >
              <div className="text-sm font-semibold whitespace-nowrap">
                {tab.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                {tab.artist && <span>{tab.artist}</span>}
                <span className={difficultyColors[tab.difficulty]}>
                  {difficultyLabels[tab.difficulty]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
