/**
 * コメントの暴言・不適切表現検出フィルター
 */

// 不適切な表現パターン（日本語）
const INAPPROPRIATE_PATTERNS = [
  // 直接的な侮辱
  /バカ/i,
  /ばか/,
  /アホ/i,
  /あほ/,
  /死ね/,
  /しね/,
  /くたばれ/,
  /消えろ/,
  /きえろ/,
  /うざい/,
  /きもい/,
  /キモい/,
  /ブス/,
  /デブ/,
  /ゴミ/,
  /ごみ/,
  /カス/,
  /かす/,
  /クズ/,
  /くず/,
  /ksks/i,
  // 下手・否定系
  /下手くそ/,
  /へたくそ/,
  /ヘタクソ/,
  /才能ない/,
  /やめちまえ/,
  /やめろ/,
  /辞めろ/,
  // 英語
  /fuck/i,
  /shit/i,
  /stupid/i,
  /idiot/i,
  /trash/i,
  /suck/i,
];

export interface ContentFilterResult {
  isInappropriate: boolean;
  warning: string | null;
}

export function checkContent(text: string): ContentFilterResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { isInappropriate: false, warning: null };
  }

  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isInappropriate: true,
        warning:
          "この表現は他の人を傷つける可能性があります。みんなが気持ちよく使えるよう、表現を見直してみませんか？",
      };
    }
  }

  return { isInappropriate: false, warning: null };
}
