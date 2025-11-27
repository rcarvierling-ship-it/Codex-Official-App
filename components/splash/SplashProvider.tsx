"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { RoleSplashScreen } from "./RoleSplashScreen";
import { normalizeRole, type Role } from "@/lib/nav";

export type SchoolBranding = {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  mascotName?: string | null;
  mascotImageUrl?: string | null;
  name?: string;
} | null;

type LeagueBranding = {
  logoUrl?: string | null;
  name?: string;
} | null;

type SplashProviderProps = {
  role: Role;
  schoolBranding: SchoolBranding | null;
  leagueBranding?: LeagueBranding | null;
  children: React.ReactNode;
};

export function SplashProvider({
  role,
  schoolBranding,
  leagueBranding,
  children,
}: SplashProviderProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [hasShownSplash, setHasShownSplash] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show splash on first load or when coming from login
    const fromLogin = searchParams?.get("from") === "login";
    const isFirstLoad = !hasShownSplash && pathname;

    if ((fromLogin || isFirstLoad) && !hasShownSplash) {
      setShowSplash(true);
      setHasShownSplash(true);
    }
  }, [pathname, searchParams, hasShownSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && (
        <RoleSplashScreen
          onComplete={handleSplashComplete}
          schoolBranding={schoolBranding}
          leagueBranding={leagueBranding}
        />
      )}
      {children}
    </>
  );
}

