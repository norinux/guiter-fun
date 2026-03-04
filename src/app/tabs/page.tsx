"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { sampleTabs } from "@/data/sample-tabs";
import { TabSong } from "@/types/tab";
import TabDisplay from "./_components/TabDisplay";
import TabPlayer from "./_components/TabPlayer";
import TabBottomBar from "./_components/TabBottomBar";
import YouTubeResults from "./_components/YouTubeResults";

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export default function TabsPage() {
  const [selectedTab, setSelectedTab] = useState<TabSong>(sampleTabs[0]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [youtubeResults, setYoutubeResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePositionChange = useCallback((pos: number) => {
    setCurrentPosition(pos);
  }, []);

  const handlePlayingChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  const filteredTabs = useMemo(() => {
    if (!searchQuery.trim()) return sampleTabs;
    const q = searchQuery.toLowerCase();
    return sampleTabs.filter(
      (tab) =>
        tab.title.toLowerCase().includes(q) ||
        (tab.artist && tab.artist.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const query = searchQuery.trim();
    if (!query) {
      setYoutubeResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/youtube-search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setYoutubeResults(data.videos || []);
      } catch {
        setYoutubeResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 pb-32">
        <h1 className="mb-4 text-3xl font-bold">タブ譜</h1>

        {/* 検索バー */}
        <div className="mb-6 relative">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="曲名・アーティストで検索..."
            className="w-full rounded-lg border border-foreground/20 bg-surface-light py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/50 focus:border-primary focus:outline-none"
          />
        </div>

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

        {/* YouTube検索結果 */}
        {searchQuery.trim() && (
          <YouTubeResults
            videos={youtubeResults}
            isSearching={isSearching}
            hasSearched={hasSearched}
          />
        )}
      </div>

      <TabBottomBar
        selectedTabId={selectedTab.id}
        onSelect={setSelectedTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredTabs={filteredTabs}
      />
    </>
  );
}
