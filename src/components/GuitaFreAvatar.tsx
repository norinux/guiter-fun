export default function GuitaFreAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ピック型ボディ */}
      <path
        d="M32 4C22 4 14 12 10 22C6 32 8 44 16 52C20 56 26 60 32 60C38 60 44 56 48 52C56 44 58 32 54 22C50 12 42 4 32 4Z"
        fill="#1e1e1e"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      {/* 内側のグラデーション風ライン */}
      <path
        d="M32 8C24 8 17 14 14 23C11 32 12 42 18 49C22 53 27 56 32 56C37 56 42 53 46 49C52 42 53 32 50 23C47 14 40 8 32 8Z"
        fill="#252525"
      />
      {/* サングラス - 左レンズ */}
      <rect x="15" y="24" width="14" height="9" rx="2" fill="#111" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* サングラス - 右レンズ */}
      <rect x="35" y="24" width="14" height="9" rx="2" fill="#111" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* サングラス - ブリッジ */}
      <path d="M29 28H35" stroke="#e2e8f0" strokeWidth="1.5" />
      {/* サングラス - テンプル（つる） */}
      <path d="M15 27L10 24" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M49 27L54 24" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
      {/* レンズの反射 */}
      <rect x="17" y="26" width="4" height="2" rx="1" fill="#3b82f6" opacity="0.4" />
      <rect x="37" y="26" width="4" height="2" rx="1" fill="#3b82f6" opacity="0.4" />
      {/* ニヤリ口 */}
      <path
        d="M24 40C26 43 30 45 32 45C34 45 38 43 40 40"
        stroke="#e2e8f0"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* 稲妻マーク */}
      <path
        d="M44 10L40 18L45 17L41 26"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
