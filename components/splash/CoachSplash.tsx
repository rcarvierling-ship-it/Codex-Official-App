"use client";

import { motion } from "framer-motion";
import { Trophy, Target } from "lucide-react";
import Image from "next/image";

type CoachSplashProps = {
  schoolBranding?: {
    primaryColor?: string | null;
    secondaryColor?: string | null;
    logoUrl?: string | null;
    name?: string;
  } | null;
};

export function CoachSplash({ schoolBranding }: CoachSplashProps) {
  const primaryColor = schoolBranding?.primaryColor || "#10B981";
  const secondaryColor = schoolBranding?.secondaryColor || "#059669";

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Team Color Glow Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${primaryColor}20 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Pulsing Glow Rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${300 + i * 150}px`,
            height: `${300 + i * 150}px`,
            background: `radial-gradient(circle, ${primaryColor}${20 + i * 10} 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 text-center space-y-6"
      >
        {schoolBranding?.logoUrl ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative w-32 h-32 mx-auto mb-4"
          >
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 20px ${primaryColor}40`,
                  `0 0 40px ${primaryColor}60`,
                  `0 0 20px ${primaryColor}40`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="relative w-full h-full rounded-full p-4"
            >
              <Image
                src={schoolBranding.logoUrl}
                alt={schoolBranding.name || "Team Logo"}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 20px ${primaryColor}40`,
                  `0 0 40px ${primaryColor}60`,
                  `0 0 20px ${primaryColor}40`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-full"
            />
            <Trophy className="h-12 w-12 text-white relative z-10" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: primaryColor }}>
            Coach Dashboard
          </h1>
          {schoolBranding?.name && (
            <p className="text-lg text-muted-foreground">{schoolBranding.name}</p>
          )}
        </motion.div>

        {/* Target Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 12}%`,
              top: `${15 + (i % 3) * 30}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          >
            <Target
              className="h-6 w-6"
              style={{ color: primaryColor }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

