"use client";

import { useState, useCallback } from "react";
import { sampleTabs } from "@/data/sample-tabs";
import { TabSong } from "@/types/tab";
import TabDisplay from "./_components/TabDisplay";
import TabPlayer from "./_components/TabPlayer";
import TabBottomBar from "./_components/TabBottomBar";

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
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 pb-32">
        <h1 className="mb-6 text-3xl font-bold">タブ譜</h1>

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

      <TabBottomBar
        selectedTabId={selectedTab.id}
        onSelect={setSelectedTab}
      />
    </>
  );
}
