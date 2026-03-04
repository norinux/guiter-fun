"use client";

import { useState } from "react";
import { TabSong } from "@/types/tab";
import { sampleTabs } from "@/data/sample-tabs";

interface TabBottomBarProps {
  selectedTabId: string | null;
  onSelect: (tab: TabSong) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredTabs: TabSong[];
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
  searchQuery,
  onSearchChange,
  filteredTabs,
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
          isOpen ? "max-h-52" : "max-h-0 border-t-0"
        }`}
      >
        {/* 検索バー */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="曲名・アーティストで検索..."
              className="w-full rounded-md border border-foreground/20 bg-surface-light py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-foreground/50 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* 曲リスト */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {filteredTabs.length > 0 ? (
            filteredTabs.map((tab) => (
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
            ))
          ) : (
            <p className="text-xs text-foreground/40 py-2">
              該当する曲が見つかりません
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
