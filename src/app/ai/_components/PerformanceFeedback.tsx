"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useMemo } from "react";
import ChatMessage from "./ChatMessage";
import GuitaFreAvatar from "@/components/GuitaFreAvatar";
import type { SkillLevel } from "@/lib/ai/prompts";

const suggestedQuestionsByLevel: Record<SkillLevel, string[]> = {
  beginner: [
    "Fコードが押さえられません",
    "指が痛くなります",
    "コードチェンジが遅いです",
    "リズムが安定しません",
  ],
  intermediate: [
    "速弾きが上手くいきません",
    "ソロの表現力を上げたい",
    "バンドで合わせるコツは？",
    "耳コピのコツを教えて",
  ],
  advanced: [
    "アドリブの引き出しを増やしたい",
    "トーンの作り込みについて",
    "ライブでの緊張対策は？",
    "レコーディングのコツは？",
  ],
};

interface Props {
  skillLevel: SkillLevel;
}

export default function PerformanceFeedback({ skillLevel }: Props) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/feedback",
        body: { level: skillLevel },
      }),
    [skillLevel]
  );

  const { messages, sendMessage, status, setMessages } = useChat({ transport });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLevelRef = useRef(skillLevel);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (prevLevelRef.current !== skillLevel) {
      setMessages([]);
      prevLevelRef.current = skillLevel;
    }
  }, [skillLevel, setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSuggestionClick = (question: string) => {
    sendMessage({ text: question });
  };

  const suggestedQuestions = suggestedQuestionsByLevel[skillLevel];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 270px)" }}>
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <GuitaFreAvatar size={64} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              演奏の悩みを相談しよう！
            </h3>
            <p className="mb-6 text-sm text-slate-400">
              練習の悩みや改善したいことを教えてください
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestionClick(q)}
                  className="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-slate-300 transition-colors hover:border-primary/40 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start gap-2">
            <div className="shrink-0 mt-1">
              <GuitaFreAvatar size={28} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm text-slate-400">
              考え中...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="練習の悩みや状況を教えてね..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
