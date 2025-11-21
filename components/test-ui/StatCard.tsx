"use client";

import * as React from "react";

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-background">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

