"use client";

import { TabSong } from "@/types/tab";

interface TabDisplayProps {
  tab: TabSong;
  currentPosition: number; // 現在の再生位置（列インデックス）
  isPlaying: boolean;
}

const stringNames = ["e", "B", "G", "D", "A", "E"];

export default function TabDisplay({
  tab,
  currentPosition,
  isPlaying,
}: TabDisplayProps) {
  // 全measureの各弦を結合して1つの長い文字列にする
  const fullStrings = tab.measures.reduce(
    (acc, measure, idx) => {
      return acc.map(
        (str, i) => str + (idx > 0 ? "|" : "") + measure.strings[i]
      );
    },
    ["", "", "", "", "", ""]
  );

  // 全体の列数
  const totalColumns = fullStrings[0].length;

  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/10 bg-background p-4">
      <div className="relative inline-block">
        {/* 再生位置インジケーター */}
        {isPlaying && currentPosition >= 0 && currentPosition < totalColumns && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-primary transition-[left] duration-100"
            style={{
              left: `${(currentPosition + 2.5) * 0.6}em`,
            }}
          />
        )}

        <pre className="font-mono text-sm leading-6 select-none">
          {fullStrings.map((line, i) => (
            <div key={i} className="flex">
              <span className="inline-block w-6 text-right text-foreground/40">
                {stringNames[i]}
              </span>
              <span className="text-foreground/30">|</span>
              {line.split("").map((char, j) => {
                const isActive =
                  isPlaying &&
                  j === currentPosition &&
                  char !== "-";
                return (
                  <span
                    key={j}
                    className={
                      isActive
                        ? "font-bold text-primary"
                        : char !== "-"
                          ? "text-foreground"
                          : "text-foreground/20"
                    }
                  >
                    {char}
                  </span>
                );
              })}
              <span className="text-foreground/30">|</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
