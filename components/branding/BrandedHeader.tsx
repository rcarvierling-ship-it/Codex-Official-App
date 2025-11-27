"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

type SchoolBranding = {
  name: string;
  logoUrl?: string | null;
  mascotName?: string | null;
  mascotImageUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
};

type BrandedHeaderProps = {
  branding: SchoolBranding | null;
  title?: string;
  subtitle?: string;
};

export function BrandedHeader({ branding, title, subtitle }: BrandedHeaderProps) {
  if (!branding) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-background to-background/80 p-6 md:p-8"
      style={{
        background: branding.primaryColor && branding.secondaryColor
          ? `linear-gradient(135deg, ${branding.primaryColor}15 0%, ${branding.secondaryColor}15 100%)`
          : undefined,
      }}
    >
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {branding.logoUrl && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg bg-background/60 p-2 shadow-lg"
            >
              <Image
                src={branding.logoUrl}
                alt={`${branding.name} logo`}
                fill
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </motion.div>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {title || branding.name}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {branding.mascotName && (
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: branding.primaryColor || undefined,
                    color: branding.primaryColor || undefined,
                  }}
                >
                  {branding.mascotName}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {branding.mascotImageUrl && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block relative h-24 w-24 flex-shrink-0"
          >
            <Image
              src={branding.mascotImageUrl}
              alt={branding.mascotName || "Mascot"}
              fill
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

