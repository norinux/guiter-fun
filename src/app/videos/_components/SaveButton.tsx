"use client";

interface SaveButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function SaveButton({
  isSaved,
  onToggle,
  disabled,
}: SaveButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={isSaved ? "#3b82f6" : "none"}
        stroke={isSaved ? "#3b82f6" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span className={isSaved ? "text-blue-400 font-medium" : "text-slate-400"}>
        {isSaved ? "保存済み" : "保存"}
      </span>
    </button>
  );
}
