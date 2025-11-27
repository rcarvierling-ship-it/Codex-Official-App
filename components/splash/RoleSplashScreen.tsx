"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { normalizeRole } from "@/lib/nav";
import { ADSplash } from "./ADSplash";
import { OfficialSplash } from "./OfficialSplash";
import { CoachSplash } from "./CoachSplash";
import { LeagueAdminSplash } from "./LeagueAdminSplash";
import { DefaultSplash } from "./DefaultSplash";

type RoleSplashScreenProps = {
  onComplete: () => void;
  schoolBranding?: {
    primaryColor?: string | null;
    secondaryColor?: string | null;
    logoUrl?: string | null;
    name?: string;
  } | null;
  leagueBranding?: {
    logoUrl?: string | null;
    name?: string;
  } | null;
};

export function RoleSplashScreen({
  onComplete,
  schoolBranding,
  leagueBranding,
}: RoleSplashScreenProps) {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const role = normalizeRole((session?.user as any)?.role ?? "fan");

  useEffect(() => {
    // Show splash for 2-3 seconds based on role
    const duration = role === "league_admin" || role === "school_admin" ? 3000 : 2500;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [role, onComplete]);

  const renderSplash = () => {
    switch (role) {
      case "athletic_director":
        return <ADSplash schoolBranding={schoolBranding} />;
      case "official":
        return <OfficialSplash />;
      case "coach":
        return <CoachSplash schoolBranding={schoolBranding} />;
      case "league_admin":
      case "school_admin":
        return <LeagueAdminSplash leagueBranding={leagueBranding || undefined} />;
      default:
        return <DefaultSplash />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {renderSplash()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

