"use client";

import { sampleTabs } from "@/data/sample-tabs";
import { TabSong } from "@/types/tab";

interface TabSelectorProps {
  selectedTabId: string | null;
  onSelect: (tab: TabSong) => void;
}

const difficultyLabels = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

const difficultyColors = {
  beginner: "bg-green-900/30 text-green-400",
  intermediate: "bg-yellow-900/30 text-yellow-400",
  advanced: "bg-red-900/30 text-red-400",
};

export default function TabSelector({
  selectedTabId,
  onSelect,
}: TabSelectorProps) {
  return (
    <div className="space-y-2">
      {sampleTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab)}
          className={`w-full rounded-lg border p-4 text-left transition-all ${
            selectedTabId === tab.id
              ? "border-primary bg-primary/5"
              : "border-foreground/10 hover:border-primary/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold">{tab.title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[tab.difficulty]}`}
            >
              {difficultyLabels[tab.difficulty]}
            </span>
          </div>
          {tab.artist && (
            <div className="text-sm text-foreground/50">{tab.artist}</div>
          )}
          {tab.description && (
            <div className="mt-1 text-xs text-foreground/40">
              {tab.description}
            </div>
          )}
          <div className="mt-1 text-xs text-foreground/30">
            BPM: {tab.defaultBpm} / {tab.timeSignature[0]}/{tab.timeSignature[1]}拍子
          </div>
        </button>
      ))}
    </div>
  );
}
