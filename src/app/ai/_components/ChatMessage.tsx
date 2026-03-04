"use client";

import type { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-white"
            : "bg-surface border border-white/10 text-slate-200"
        }`}
      >
        {!isUser && (
          <div className="mb-1 text-xs font-medium text-primary">ギタフレ</div>
        )}
        {message.parts.map((part, i) =>
          part.type === "text" ? <span key={i}>{part.text}</span> : null
        )}
      </div>
    </div>
  );
}
