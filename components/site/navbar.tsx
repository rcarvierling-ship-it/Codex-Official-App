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
<<<<<<< HEAD
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-lg bg-[hsl(var(--accent)/0.1)]">
=======
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-[hsl(var(--accent)/0.1)]">
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
            <Image
              src="/logo.png"
              alt="The Official App whistle logo"
              fill
<<<<<<< HEAD
              sizes="(max-width: 640px) 28px, 32px"
              className="object-contain p-1.5"
            />
          </div>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[hsl(var(--accent))]">
=======
              sizes="32px"
              className="object-contain p-1.5"
            />
          </div>
          <span className="text-sm font-semibold uppercase tracking-[0.4em] text-[hsl(var(--accent))]">
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
            The Official App
          </span>
        </Link>

<<<<<<< HEAD
        <nav className="hidden items-center gap-4 sm:gap-6 md:flex">
=======
        <nav className="hidden items-center gap-6 md:flex">
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
<<<<<<< HEAD
              className="text-xs sm:text-sm text-muted-foreground transition hover:text-foreground"
=======
              className="text-sm text-muted-foreground transition hover:text-foreground"
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

<<<<<<< HEAD
        <div className="flex items-center gap-2 sm:gap-3 md:hidden">
=======
        <div className="flex items-center gap-3 md:hidden">
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
<<<<<<< HEAD
                className="border-border text-muted-foreground h-9 w-9 sm:h-10 sm:w-10"
              >
                <span className="text-base sm:text-lg">☰</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:w-80 bg-background">
=======
                className="border-border text-muted-foreground"
              >
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-background">
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
              <div className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
<<<<<<< HEAD
                    className="text-sm sm:text-base text-foreground transition hover:text-[hsl(var(--accent))]"
=======
                    className="text-base text-foreground transition hover:text-[hsl(var(--accent))]"
>>>>>>> 6c4bb1b05f097714713564a61fd6e75c753c40a5
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
