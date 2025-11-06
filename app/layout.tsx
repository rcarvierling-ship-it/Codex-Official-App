import "./globals.css";
import React from "react";

import { Navbar } from "@/components/site/navbar";
import AuthButtonServer from "@/components/AuthButtonServer";
import { ToastBridge } from "@/components/site/toast-bridge";
import { ToastClient } from "@/components/site/toast-client";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "The Official App • 🏀",
  description: "The Official App • 🏀 — all-in-one sports operations platform for leagues, schools, and officials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-sans antialiased">
        <div className="border-b bg-background/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Navbar />
            {/* server-side auth button to avoid client provider in root */}
            <AuthButtonServer />
          </div>
        </div>
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <ToastBridge />
        <ToastClient />
        <Toaster />
      </body>
    </html>
  );
}
