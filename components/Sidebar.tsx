'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { getNavForRole, normalizeRole, type Role } from "@/lib/nav";
import { mapNavItemsToDemo } from "@/lib/demo-nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type SidebarVariant = "app" | "demo";

type SidebarProps = {
  role?: Role;
  variant?: SidebarVariant;
  title?: string;
};

export function Sidebar({
  role: providedRole,
  variant = "app",
  title = variant === "demo" ? "Demo" : "Navigation",
}: SidebarProps) {
  const pathname = usePathname() ?? "/";
  const role = providedRole;
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
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden border-b border-border/60 bg-card/50 p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-border/70 text-sm text-muted-foreground"
            >
              ☰ Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-background text-foreground">
            <div className="space-y-4 pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                {title}
              </p>
              {navList}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border/60 lg:bg-card/30 lg:p-6 lg:gap-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
          {title}
        </p>
        {navList}
      </aside>
    </>
  );
}
