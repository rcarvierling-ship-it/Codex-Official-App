"use client";

import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
import Image from "next/image";

type ADSplashProps = {
  schoolBranding?: {
    primaryColor?: string | null;
    secondaryColor?: string | null;
    logoUrl?: string | null;
    name?: string;
  } | null;
};

export function ADSplash({ schoolBranding }: ADSplashProps) {
  const primaryColor = schoolBranding?.primaryColor || "#3B82F6";
  const secondaryColor = schoolBranding?.secondaryColor || "#1E40AF";

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 50%, ${primaryColor}15 100%)`,
        }}
        animate={{
          background: [
            `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 50%, ${primaryColor}15 100%)`,
            `linear-gradient(225deg, ${secondaryColor}15 0%, ${primaryColor}15 50%, ${secondaryColor}15 100%)`,
            `linear-gradient(315deg, ${primaryColor}15 0%, ${secondaryColor}15 50%, ${primaryColor}15 100%)`,
            `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 50%, ${primaryColor}15 100%)`,
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Gradient Orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: `${200 + i * 50}px`,
            height: `${200 + i * 50}px`,
            background: i % 2 === 0 ? primaryColor : secondaryColor,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 10}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
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
            <Image
              src={schoolBranding.logoUrl}
              alt={schoolBranding.name || "School Logo"}
              fill
              className="object-contain"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <GraduationCap className="h-12 w-12 text-white" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: primaryColor }}>
            Athletic Director
          </h1>
          {schoolBranding?.name && (
            <p className="text-lg text-muted-foreground">{schoolBranding.name}</p>
          )}
        </motion.div>

        {/* Sparkle Effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles
              className="h-4 w-4"
              style={{ color: i % 2 === 0 ? primaryColor : secondaryColor }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

