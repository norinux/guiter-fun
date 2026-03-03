"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, ReactNode } from "react";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
});

function AuthContextInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: AppUser | null = session?.user
    ? {
        id: session.user.id!,
        name: session.user.name ?? "匿名",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }
    : null;

  const handleSignIn = async () => {
    router.push("/login");
  };

  const handleLogOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === "loading",
        signIn: handleSignIn,
        logOut: handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextInner>{children}</AuthContextInner>
    </SessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
