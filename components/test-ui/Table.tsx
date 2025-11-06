"use client";

import * as React from "react";

export function Table({
  header,
  rows,
  cols,
}: {
  header: string[];
  rows: (React.ReactNode[])[];
  cols?: string; // CSS gridTemplateColumns
}) {
  const gridCols = cols ?? `repeat(${header.length}, minmax(0, 1fr))`;
  return (
    <div className="overflow-hidden rounded-xl border">
      <div
        className="grid gap-2 bg-muted/50 p-2 text-xs font-semibold"
        style={{ gridTemplateColumns: gridCols }}
        role="row"
      >
        {header.map((h) => (
          <div key={h} role="columnheader">{h}</div>
        ))}
      </div>
      <div className="divide-y">
        {rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No data yet.</div>
        ) : (
          rows.map((r, i) => (
            <div
              key={i}
              className="grid gap-2 p-2 text-sm"
              style={{ gridTemplateColumns: gridCols }}
              role="row"
            >
              {r.map((c, j) => (
                <div key={j} role="cell">{c}</div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

