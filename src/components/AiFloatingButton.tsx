"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AiFloatingButton() {
  const { user } = useAuth();
  const pathname = usePathname();

  // ログイン時のみ表示、/ai ページでは非表示
  if (!user || pathname === "/ai") return null;

  return (
    <Link
      href="/ai"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform hover:scale-110 active:scale-95 md:bottom-6 md:right-6"
      aria-label="AIアシスタント"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
      </svg>
    </Link>
  );
}
