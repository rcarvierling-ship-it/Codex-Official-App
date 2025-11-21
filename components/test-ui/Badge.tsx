"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const colorByStatus: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200",
  DECLINED: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200",
  ASSIGNED: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200",
  COMPLETED: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-200",
  CANCELLED: "bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200",
};

export function Badge({ children, variant }: { children: React.ReactNode; variant?: string }) {
  const v = typeof variant === "string" ? variant.toUpperCase() : "";
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
      colorByStatus[v] ?? "bg-muted text-foreground border-transparent"
    )}>
      {children}
    </span>
  );
}

