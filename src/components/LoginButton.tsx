"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function LoginButton() {
  const { user, loading, signIn, logOut } = useAuth();

  if (loading) {
    return (
      <div className="h-9 w-20 animate-pulse rounded-lg bg-white/10" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt=""
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <span className="text-sm text-slate-300 hidden sm:inline">
          {user.displayName}
        </span>
        <button
          onClick={logOut}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          d="M15.545 6.558a9.42 9.42 0 01.139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 118 0a7.689 7.689 0 015.352 2.082l-2.284 2.284A4.347 4.347 0 008 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 000 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 001.599-2.431H8v-3.08h7.545z"
          fill="currentColor"
        />
      </svg>
      ログイン
    </button>
  );
}
