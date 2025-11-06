import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { DEMO_ENABLED } from "@lib/demoFlag";

export function Navbar() {
  const navLinks = [
    ...(DEMO_ENABLED ? [{ href: "/demo", label: "Demo" }] : []),
    { href: "/#waitlist", label: "Join Waitlist" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[hsl(var(--background))]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-[hsl(var(--accent)/0.1)]">
            <Image
              src="/logo.png"
              alt="The Official App logo"
              fill
              sizes="32px"
              className="object-contain p-1.5"
            />
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.4em] text-[hsl(var(--accent))]">
            The Official App
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-border text-muted-foreground"
              >
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-background">
              <div className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base text-foreground transition hover:text-[hsl(var(--accent))]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
