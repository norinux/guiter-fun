import Link from "next/link";
import RecentPractice from "./RecentPractice";

const features = [
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
    href: "/metronome",
    title: "メトロノーム",
    description: "正確なテンポで練習。練習時間の記録・管理もできる",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M24 4L16 44h16L24 4z" />
        <line x1="24" y1="16" x2="36" y2="8" />
        <line x1="10" y1="44" x2="38" y2="44" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
          Guitar Fun
        </h1>
        <p className="text-lg text-foreground/60">
          ギターの練習をもっと楽しく
        </p>
      </div>

      <div className="mb-10 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group flex flex-col items-center rounded-2xl border border-foreground/10 bg-surface p-8 text-center transition-all hover:border-primary/30 hover:shadow-lg"
          >
            <div className="mb-4 transition-transform group-hover:scale-110">
              {feature.icon}
            </div>
            <h2 className="mb-2 text-xl font-semibold">{feature.title}</h2>
            <p className="text-sm text-foreground/60">{feature.description}</p>
          </Link>
        ))}
      </div>

      <RecentPractice />
    </div>
  );
}
