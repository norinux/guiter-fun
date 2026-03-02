"use client";

import { useState, useCallback } from "react";
import { sampleTabs } from "@/data/sample-tabs";
import { TabSong } from "@/types/tab";
import TabSelector from "./_components/TabSelector";
import TabDisplay from "./_components/TabDisplay";
import TabPlayer from "./_components/TabPlayer";

export default function TabsPage() {
  const [selectedTab, setSelectedTab] = useState<TabSong>(sampleTabs[0]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePositionChange = useCallback((pos: number) => {
    setCurrentPosition(pos);
  }, []);

  const handlePlayingChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">タブ譜</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* 曲選択 */}
        <aside>
          <h2 className="mb-3 text-lg font-semibold">曲を選択</h2>
          <TabSelector
            selectedTabId={selectedTab.id}
            onSelect={setSelectedTab}
          />
        </aside>

        {/* タブ譜表示・再生 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{selectedTab.title}</h2>
            {selectedTab.artist && (
              <p className="text-sm text-foreground/50">
                {selectedTab.artist}
              </p>
            )}
          </div>

          <TabDisplay
            tab={selectedTab}
            currentPosition={currentPosition}
            isPlaying={isPlaying}
          />

          <TabPlayer
            tab={selectedTab}
            onPositionChange={handlePositionChange}
            onPlayingChange={handlePlayingChange}
          />
        </div>
      </div>
    </div>
  );
}
