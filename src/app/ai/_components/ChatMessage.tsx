"use client";

import type { UIMessage } from "ai";
import GuitaFreAvatar from "@/components/GuitaFreAvatar";

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}>
      {!isUser && (
        <div className="shrink-0 mt-1">
          <GuitaFreAvatar size={28} />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-white"
            : "bg-surface border border-white/10 text-slate-200"
        }`}
      >
        {message.parts.map((part, i) =>
          part.type === "text" ? <span key={i}>{part.text}</span> : null
        )}
      </div>
    </div>
  );
}
