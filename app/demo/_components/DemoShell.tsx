'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { Sidebar } from "@/components/Sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { mapNavItemsToDemo } from "@/lib/demo-nav";
import { getNavForRole, normalizeRole } from "@/lib/nav";
import type { DemoRole } from "@demo/_data/mockData";
import {
  personaOptions,
  PersonaLabel,
  useDemoStore,
} from "@demo/_state/demoStore";

export default function DemoShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const branding = useDemoStore((state) => state.branding);
  const currentPersona = useDemoStore((state) => state.currentPersona);
  const currentRole = useDemoStore((state) => state.currentRole);
  const setPersona = useDemoStore((state) => state.setPersona);
  const router = useRouter();
  const { toast } = useToast();

  const allowedPaths = useMemo(() => {
    return mapNavItemsToDemo(getNavForRole(normalizeRole(currentRole)));
  }, [currentRole]);

  useEffect(() => {
    if (!pathname?.startsWith("/demo")) return;
    const isAllowed = allowedPaths.some(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
    if (!isAllowed) {
      router.replace("/demo");
      toast({
        title: "You don't have access to that demo tab",
        description: "Switch personas to preview restricted workflows.",
      });
    }
  }, [allowedPaths, pathname, router, toast]);

  const brandLogo = branding?.logoDataUrl ?? "/logo.png";

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <Sidebar role={currentRole} variant="demo" title="The Official App Demo" />
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border bg-background/80 px-4 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-semibold text-foreground">
                The Official App
              </Link>
              <span className="rounded-full border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                Interactive Demo
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brandLogo}
                alt="The Official App logo"
                className="hidden h-8 w-8 rounded-full object-cover lg:block"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PersonaSelect
                currentPersona={currentPersona}
                setPersona={setPersona}
                currentRole={currentRole}
              />
              <ThemeToggle />
            </div>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
            Demo / {formatBreadcrumb(pathname ?? "/demo")}
          </p>
        </header>
        <main className="flex-1 overflow-y-auto bg-background px-6 pb-16 pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function PersonaSelect({
  currentPersona,
  setPersona,
  currentRole,
}: {
  currentPersona: PersonaLabel;
  setPersona: (persona: PersonaLabel) => void;
  currentRole: DemoRole;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5">
      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Role
      </span>
      <Select value={currentPersona} onValueChange={setPersona}>
        <SelectTrigger className="w-48 border-none bg-transparent text-sm text-foreground focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent className="bg-card text-card-foreground">
          {personaOptions.map((option) => (
            <SelectItem key={option.label} value={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="rounded-full bg-[hsl(var(--accent)/0.15)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--accent))]">
        {currentRole}
      </span>
    </div>
  );
}

function formatBreadcrumb(pathname: string) {
  const normalized = pathname.replace("/demo", "") || "/";
  if (normalized === "/") return "Overview";
  return normalized
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, " "))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
}
