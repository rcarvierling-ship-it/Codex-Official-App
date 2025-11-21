import * as React from "react";

import { cn } from "@/lib/utils";

export interface ToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "between" | "end";
}

export function Toolbar({
  justify = "between",
  className,
  children,
  ...props
}: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 sm:flex-row sm:items-center",
        justify === "between"
          ? "sm:justify-between"
          : justify === "end"
          ? "sm:justify-end"
          : "sm:justify-start",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ToolbarActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ToolbarFilters({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}
