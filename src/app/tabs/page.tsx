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

        {/* 検索バー + 曲一覧 */}
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="relative mb-4">
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

            {/* YouTube検索結果 */}
            {searchQuery.trim() && (
              <YouTubeResults
                videos={youtubeResults}
                isSearching={isSearching}
                hasSearched={hasSearched}
              />
            )}
          </div>

          {/* 曲一覧テーブル */}
          <div className="rounded-xl border border-white/10 bg-surface overflow-hidden">
            <div className="border-b border-white/10 px-4 py-2.5">
              <h3 className="text-sm font-semibold text-white">曲一覧 ({filteredTabs.length})</h3>
            </div>
            <div className="max-h-60 lg:max-h-80 overflow-y-auto">
              {filteredTabs.length > 0 ? (
                filteredTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors border-b border-white/5 last:border-b-0 ${
                      selectedTab.id === tab.id
                        ? "bg-primary/10 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{tab.title}</div>
                      {tab.artist && (
                        <div className="text-xs text-slate-500 truncate">{tab.artist}</div>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        tab.difficulty === "beginner"
                          ? "bg-green-500/10 text-green-400"
                          : tab.difficulty === "intermediate"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {tab.difficulty === "beginner" ? "初級" : tab.difficulty === "intermediate" ? "中級" : "上級"}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-6 text-center text-xs text-slate-500">
                  該当する曲が見つかりません
                </p>
              )}
            </div>
          </div>
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
