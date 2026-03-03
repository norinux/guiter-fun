"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginButton from "./LoginButton";
import VideoUploadModal from "@/app/videos/_components/VideoUploadModal";

const navItems = [
  {
    href: "/tabs",
    label: "タブ譜",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    href: "/chords",
    label: "コード",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="6" y1="4" x2="6" y2="20" />
        <line x1="10" y1="4" x2="10" y2="20" />
        <line x1="14" y1="4" x2="14" y2="20" />
        <line x1="18" y1="4" x2="18" y2="20" />
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/videos",
    label: "動画",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <polygon points="10,8 16,12 10,16" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/tuner",
    label: "チューナー",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      {/* デスクトップ: トップバー */}
      <nav className="hidden md:flex items-center justify-between border-b border-white/10 bg-nav-bg px-6 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Guitar Fun
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
          {user && (
            <>
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                投稿
              </button>
              <Link
                href="/profile"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === "/profile"
                    ? "bg-primary text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-6 w-6 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
                <span className="hidden lg:inline">マイページ</span>
              </Link>
            </>
          )}
          <div className="border-l border-white/10 pl-4">
            <LoginButton />
          </div>
        </div>
      </nav>

      {/* モバイル: ボトムタブ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end md:hidden border-t border-white/10 bg-nav-bg">
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        {/* 中央: 投稿ボタン */}
        <button
          onClick={() => {
            if (user) {
              setShowUpload(true);
            } else {
              router.push("/videos");
            }
          }}
          className="flex flex-col items-center -mt-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform active:scale-95">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="mt-1 text-xs font-medium text-slate-500 pb-1">投稿</span>
        </button>

        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        {user && (
          <Link
            href="/profile"
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              pathname === "/profile"
                ? "text-primary"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            マイページ
          </Link>
        )}
      </nav>

      {/* 動画投稿モーダル */}
      <VideoUploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={() => setShowUpload(false)}
      />
    </>
  );
}
