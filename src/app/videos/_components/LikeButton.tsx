"use client";

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onToggle: () => void;
  disabled?: boolean;
}

export default function LikeButton({
  isLiked,
  count,
  onToggle,
  disabled,
}: LikeButtonProps) {
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
        fill={isLiked ? "#ef4444" : "none"}
        stroke={isLiked ? "#ef4444" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform ${isLiked ? "scale-110" : ""}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className={isLiked ? "text-red-400 font-medium" : "text-slate-400"}>
        {count}
      </span>
    </button>
  );
}
