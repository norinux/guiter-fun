"use client";

import { useState } from "react";
import { checkContent } from "@/lib/content-filter";

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void>;
  disabled?: boolean;
}

export default function CommentInput({ onSubmit, disabled }: CommentInputProps) {
  const [text, setText] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // 暴言チェック
    const result = checkContent(trimmed);
    if (result.isInappropriate) {
      setWarning(result.warning);
      return;
    }

    setSubmitting(true);
    setWarning(null);
    try {
      await onSubmit(trimmed);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {warning && (
        <div className="mb-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-300">
          {warning}
          <button
            onClick={() => setWarning(null)}
            className="ml-2 text-yellow-400 underline"
          >
            修正する
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (warning) setWarning(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="コメントを入力..."
          disabled={disabled || submitting}
          className="flex-1 rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-primary disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || submitting || !text.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {submitting ? "..." : "送信"}
        </button>
      </div>
    </div>
  );
}
