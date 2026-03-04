import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import AiFloatingButton from "@/components/AiFloatingButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guitar Fun - ギター練習&動画共有アプリ",
  description: "コード練習、タブ譜プレーヤー、チューナー、動画共有を備えたギター練習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <AiFloatingButton />
        </AuthProvider>
      </body>
    </html>
  );
}
