"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/chords",
    label: "コード練習",
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
    href: "/metronome",
    label: "メトロノーム",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8 22h8L12 2z" />
        <line x1="12" y1="8" x2="18" y2="4" />
        <line x1="5" y1="22" x2="19" y2="22" />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* デスクトップ: トップバー */}
      <nav className="hidden md:flex items-center justify-between border-b border-foreground/10 bg-background px-6 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Guitar Fun
        </Link>
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
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* モバイル: ボトムタブ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-foreground/10 bg-background">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
