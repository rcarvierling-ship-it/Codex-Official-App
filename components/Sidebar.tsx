'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { getNavForRole, normalizeRole, type Role } from "@/lib/nav";
import { mapNavItemsToDemo } from "@/lib/demo-nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDemoStore } from "@/app/demo/_state/demoStore";

type SidebarVariant = "app" | "demo";

type SidebarProps = {
  initialRole?: Role;
  variant?: SidebarVariant;
  title?: string;
};

function mapPath(variant: SidebarVariant, href: string) {
  if (variant === "demo") {
    return mapNavItemsToDemo([{ label: "", href }])[0]?.href ?? null;
  }
  return href;
}

export function Sidebar({
  initialRole,
  variant = "app",
  title = variant === "demo" ? "Demo" : "Navigation",
}: SidebarProps) {
  const pathname = usePathname() ?? "/";
  const demoRole = useDemoStore((state) => state.currentRole);
  const role = variant === "demo" ? demoRole : initialRole;
  const [open, setOpen] = useState(false);

  const navItems = useMemo(() => {
    const items = getNavForRole(normalizeRole(role));
    if (variant === "demo") {
      return mapNavItemsToDemo(items);
    }
    return items;
  }, [role, variant]);

  const navList = navItems.length > 0 ? (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "rounded-2xl px-4 py-2 text-sm font-medium text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))]",
              isActive &&
                "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] shadow-[0_0_0_1px_rgba(47,255,203,0.3)]",
              !isActive && "hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  ) : (
    <p className="text-xs text-muted-foreground">No destinations for this role yet.</p>
  );

  return (
    <div className="w-full rounded-3xl border border-border/60 bg-card/50 p-4 lg:w-64 lg:shrink-0 lg:border-transparent lg:bg-transparent lg:p-0">
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-border/70 text-sm text-muted-foreground"
            >
              Open {title}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-background text-foreground">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                {title}
              </p>
              {navList}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <aside className="hidden lg:flex lg:flex-col lg:gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
          {title}
        </p>
        {navList}
      </aside>
    </div>
  );
}
