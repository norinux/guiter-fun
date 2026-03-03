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
        {user.image && (
          <img
            src={user.image}
            alt=""
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        )}
        <span className="text-sm text-slate-300 hidden sm:inline">
          {user.name}
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
      ログイン
    </button>
  );
}
