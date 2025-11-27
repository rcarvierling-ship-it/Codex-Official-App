"use client";

import { useEffect } from "react";

type SchoolBranding = {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  mascotName?: string | null;
  mascotImageUrl?: string | null;
};

type SchoolThemeProviderProps = {
  branding: SchoolBranding | null;
  children: React.ReactNode;
};

// Convert hex to HSL
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function SchoolThemeProvider({
  branding,
  children,
}: SchoolThemeProviderProps) {
  useEffect(() => {
    if (!branding) return;

    const root = document.documentElement;

    // Apply primary color as accent
    if (branding.primaryColor) {
      const hsl = hexToHsl(branding.primaryColor);
      root.style.setProperty("--accent", hsl);
      // Calculate appropriate foreground color
      const [h, s, l] = hsl.split(" ").map((v, i) => (i === 2 ? parseFloat(v) : parseInt(v)));
      const foregroundL = l > 50 ? l - 40 : l + 40;
      root.style.setProperty("--accent-foreground", `${h} ${s} ${Math.max(0, Math.min(100, foregroundL))}%`);
    }

    // Apply secondary color
    if (branding.secondaryColor) {
      const hsl = hexToHsl(branding.secondaryColor);
      root.style.setProperty("--school-secondary", hsl);
    }

    return () => {
      // Cleanup on unmount - reset to defaults
      root.style.removeProperty("--school-secondary");
      // Note: We don't reset --accent as it's used globally
    };
  }, [branding]);

  return <>{children}</>;
}

