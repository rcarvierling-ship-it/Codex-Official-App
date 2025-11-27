"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

export function DefaultSplash() {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto w-20 h-20 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center"
        >
          <User className="h-10 w-10 text-[hsl(var(--accent))]" />
        </motion.div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome</h1>
      </motion.div>
    </div>
  );
}

