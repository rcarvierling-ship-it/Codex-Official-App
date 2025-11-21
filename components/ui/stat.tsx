import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
  delta?: React.ReactNode;
  accent?: boolean;
  icon?: React.ReactNode;
}

export function Stat({
  label,
  value,
  helper,
  delta,
  accent = false,
  icon,
  className,
  ...props
}: StatProps) {
  return (
    <Card
      className={cn(
        accent
          ? "border border-[hsl(var(--accent)/0.4)] bg-card/85"
          : "border border-border/70 bg-card/80",
        className,
      )}
      {...props}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {label}
          </CardTitle>
          {helper ? (
            <p className="mt-3 text-sm text-muted-foreground">{helper}</p>
          ) : null}
        </div>
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-lg">
            {icon}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-semibold text-foreground">{value}</div>
        {delta ? (
          <div className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
            {delta}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
