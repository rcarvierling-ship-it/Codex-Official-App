"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
// @ts-ignore - JSX components don't have full TS types
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// @ts-ignore - JSX components don't have full TS types
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { normalizeRole } from "@/lib/nav";

export function AppHeader() {
  const { data: session, status } = useSession();
  const role = normalizeRole((session?.user as any)?.role ?? "USER");
  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || session?.user?.email?.[0].toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-[hsl(var(--accent)/0.1)] flex items-center justify-center">
            <span className="text-sm font-bold text-[hsl(var(--accent))]">🏀</span>
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] hidden sm:inline">
            The Official App
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                  {/* @ts-expect-error - JSX components don't have full TS types */}
                  <Avatar className="h-8 w-8">
                    {/* @ts-expect-error - JSX components don't have full TS types */}
                    <AvatarFallback className="bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))] text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {session.user?.name || session.user?.email?.split("@")[0]}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] border-[hsl(var(--accent)/0.3)]"
                    >
                      {role}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              {/* @ts-expect-error - JSX components don't have full TS types */}
              <DropdownMenuContent align="end" className="w-56">
                {/* @ts-expect-error - JSX components don't have full TS types */}
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* @ts-expect-error - JSX components don't have full TS types */}
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {/* @ts-expect-error - JSX components don't have full TS types */}
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* @ts-expect-error - JSX components don't have full TS types */}
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

