"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type BrandedCardProps = {
  children: React.ReactNode;
  title?: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  className?: string;
};

export function BrandedCard({
  children,
  title,
  primaryColor,
  secondaryColor,
  className,
}: BrandedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "bg-card/80 border-border/60 transition-all duration-200",
          primaryColor && "hover:border-[hsl(var(--accent))]",
          className
        )}
        style={{
          borderLeftColor: primaryColor || undefined,
          borderLeftWidth: primaryColor ? "4px" : undefined,
        }}
      >
        {title && (
          <CardHeader
            className="pb-3"
            style={{
              borderBottom: primaryColor ? `1px solid ${primaryColor}20` : undefined,
            }}
          >
            <CardTitle
              className="text-lg"
              style={{
                color: primaryColor || undefined,
              }}
            >
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={title ? "pt-4" : ""}>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

