import Link from "next/link";
import RecentPractice from "./RecentPractice";

const features = [
  {
    href: "/tabs",
    title: "タブ譜",
    description: "タブ譜を見ながら曲を練習。テンポ調整＆オートスクロール付き",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M18 36V10l24-4v26" />
        <circle cx="12" cy="36" r="6" />
        <circle cx="36" cy="32" r="6" />
      </svg>
    ),
  },
  {
    href: "/chords",
    title: "コード練習",
    description: "ギターコードの押さえ方を学び、コード進行を練習しよう",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <rect x="4" y="8" width="40" height="32" rx="4" />
        <line x1="12" y1="8" x2="12" y2="40" />
        <line x1="20" y1="8" x2="20" y2="40" />
        <line x1="28" y1="8" x2="28" y2="40" />
        <line x1="36" y1="8" x2="36" y2="40" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <circle cx="28" cy="28" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/videos",
    title: "動画投稿",
    description: "演奏動画をシェアして、みんなの演奏を見て学ぼう",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <rect x="4" y="6" width="40" height="36" rx="4" />
        <polygon points="20,16 32,24 20,32" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/tuner",
    title: "チューナー",
    description: "マイクで音を拾ってリアルタイムにチューニング",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <circle cx="24" cy="24" r="20" />
        <path d="M24 12v12l8 4" />
        <circle cx="24" cy="24" r="4" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/battles",
    title: "ギターバトル",
    description: "1v1リアルタイム対戦! フリー演奏で腕を競おう",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M12 18l12-12 12 12" />
        <path d="M12 30l12 12 12-12" />
        <line x1="24" y1="6" x2="24" y2="42" />
      </svg>
    ),
  },
];

const quickAccess = [
  {
    href: "/metronome",
    title: "メトロノーム",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8 22h8L12 2z" />
        <line x1="12" y1="8" x2="18" y2="4" />
        <line x1="5" y1="22" x2="19" y2="22" />
      </svg>
    ),
  },
  {
    href: "/practice",
    title: "練習記録",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl text-white">
          Guitar Fun
        </h1>
        <p className="text-lg text-slate-400">
          ギターの練習をもっと楽しく
        </p>
      </div>

      <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-5">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group flex flex-col items-center rounded-2xl border border-white/10 bg-surface p-6 text-center transition-all hover:border-primary/40 hover:bg-surface-light"
          >
            <div className="mb-3 transition-transform group-hover:scale-110">
              {feature.icon}
            </div>
            <h2 className="mb-1 text-lg font-semibold text-white">{feature.title}</h2>
            <p className="text-xs text-slate-400">{feature.description}</p>
          </Link>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-medium text-slate-400 uppercase tracking-wider">クイックアクセス</h3>
        <div className="flex gap-3">
          {quickAccess.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:border-primary/40 hover:bg-surface-light hover:text-white"
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <RecentPractice />
    </div>
  );
}
