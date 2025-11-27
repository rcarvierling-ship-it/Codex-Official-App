"use client";

import { motion } from "framer-motion";
import { Gavel } from "lucide-react";

export function OfficialSplash() {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-950/20 via-background to-blue-950/20">
      {/* Animated Whistle Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="w-32 h-32 rounded-full bg-blue-500/20 flex items-center justify-center backdrop-blur-sm border border-blue-500/30"
        >
          <Gavel className="h-16 w-16 text-blue-400" />
        </motion.div>
      </motion.div>

      {/* Sound Wave Rings */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-blue-500/20"
          style={{
            width: `${150 + i * 80}px`,
            height: `${150 + i * 80}px`,
          }}
          initial={{ opacity: 0.8, scale: 0.5 }}
          animate={{
            opacity: [0.8, 0, 0.8],
            scale: [0.5, 2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-32 left-0 right-0 text-center z-10"
      >
        <h1 className="text-4xl font-bold tracking-tight text-blue-400">
          Official Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-2">Ready to officiate</p>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-blue-400/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.4, 1, 0.4],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

