import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  widthClass?: string;
  accessor?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  getRowId: (item: T) => string;
  emptyMessage?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  emptyMessage = "No records to display.",
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-lg",
        className,
      )}
    >
      <Table>
        <TableHeader className="bg-background/70">
          <TableRow className="border-border/70">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "text-xs uppercase tracking-[0.3em]",
                  column.widthClass,
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const rowId = getRowId(item);
              return (
                <TableRow
                  key={rowId}
                  className="border-border/60 bg-background/60 hover:border-[hsl(var(--accent)/0.3)] hover:bg-background/80"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${rowId}-${column.key}`}
                      className={cn(
                        "align-middle text-sm text-muted-foreground",
                        column.widthClass,
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {column.accessor
                        ? column.accessor(item)
                        : (item as Record<string, React.ReactNode>)[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
