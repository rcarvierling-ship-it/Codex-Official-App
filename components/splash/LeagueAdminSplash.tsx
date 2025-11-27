"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import Image from "next/image";

type LeagueAdminSplashProps = {
  leagueBranding?: {
    logoUrl?: string | null;
    name?: string;
  } | null;
};

export function LeagueAdminSplash({ leagueBranding }: LeagueAdminSplashProps) {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-background to-indigo-950/30">
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
        animate={{
          backgroundPosition: ["0 0", "40px 40px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Logo Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          duration: 1,
          type: "spring",
          stiffness: 150,
          damping: 12,
        }}
        className="relative z-10"
      >
        {leagueBranding?.logoUrl ? (
          <motion.div
            className="relative w-48 h-48"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 30px rgba(139, 92, 246, 0.3)",
                  "0 0 60px rgba(139, 92, 246, 0.5)",
                  "0 0 30px rgba(139, 92, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="relative w-full h-full rounded-2xl p-6 bg-background/80 backdrop-blur-sm border border-purple-500/30"
            >
              <Image
                src={leagueBranding.logoUrl}
                alt={leagueBranding.name || "League Logo"}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="relative w-32 h-32 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600"
            animate={{
              boxShadow: [
                "0 0 30px rgba(139, 92, 246, 0.3)",
                "0 0 60px rgba(139, 92, 246, 0.5)",
                "0 0 30px rgba(139, 92, 246, 0.3)",
              ],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
              },
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Shield className="h-16 w-16 text-white" />
          </motion.div>
        )}
      </motion.div>

      {/* Orbiting Elements */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        const radius = 120;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [
                Math.cos((angle * Math.PI) / 180) * radius,
                Math.cos(((angle + 360) * Math.PI) / 180) * radius,
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * radius,
                Math.sin(((angle + 360) * Math.PI) / 180) * radius,
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                rotate: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                },
              }}
            >
              <Sparkles className="h-6 w-6 text-purple-400" />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-32 left-0 right-0 text-center z-10"
      >
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          League Administration
        </h1>
        {leagueBranding?.name && (
          <p className="text-sm text-muted-foreground mt-2">{leagueBranding.name}</p>
        )}
      </motion.div>

      {/* Particle Effects */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}
    </div>
  );
}

