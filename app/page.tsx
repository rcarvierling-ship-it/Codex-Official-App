import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionServer } from "@/lib/auth";

const heroStats = [
  { label: "Upcoming games", value: "24" },
  { label: "Assigned officials", value: "68" },
  { label: "On-time payouts", value: "99.1%" },
];

const features = [
  {
    title: "Manage schedules & venues",
    description: "Build, publish, and update calendars without the email ping-pong.",
    icon: CalendarClock,
  },
  {
    title: "Assign & pay officials",
    description: "Smart matching, confirmations, and payouts handled in one place.",
    icon: CheckCircle2,
  },
  {
    title: "Role-based dashboards",
    description: "Every role sees what matters with guardrails and approvals built in.",
    icon: ShieldCheck,
  },
  {
    title: "Multi-league support",
    description: "Scale effortlessly across districts, conferences, and playoff brackets.",
    icon: LayoutDashboard,
  },
];

const roles = [
  {
    title: "League Admin",
    bullets: [
      "Set policies, blackout dates, and governance",
      "Approve schedules and official assignments",
      "Monitor performance across programs",
    ],
  },
  {
    title: "School Admin / Athletic Director",
    bullets: [
      "Publish events and manage facilities",
      "Coordinate transportation and staffing",
      "Track eligibility, waivers, and payments",
    ],
  },
  {
    title: "Coach",
    bullets: [
      "Share rosters and game updates",
      "Confirm officials and logistics",
      "Message teams with one click",
    ],
  },
  {
    title: "Official / Referee",
    bullets: [
      "Set availability and preferences",
      "Receive assignments and reminders",
      "Submit reports and get paid fast",
    ],
  },
  {
    title: "Parent / Fan",
    bullets: [
      "Follow schedules and scores",
      "Get notifications for changes",
      "Support programs with secure payments",
    ],
  },
];

const testimonials = [
  {
    title: "Scheduling that stays in sync",
    body: "We finally stopped chasing down last-minute changes. Everyone sees the same source of truth.",
  },
  {
    title: "Officials actually love it",
    body: "Availability, assignments, and payouts are streamlined. It saves hours every week.",
  },
  {
    title: "Built for compliance",
    body: "Approvals, audit logs, and role-based controls keep our league confident and organized.",
  },
];

const faqItems = [
  {
    question: "Can we manage multiple leagues?",
    answer: "Yes. Manage conferences, districts, or independent leagues with shared policies and reporting.",
  },
  {
    question: "How do officials get paid?",
    answer: "Officials confirm assignments, submit reports, and receive payouts through integrated workflows.",
  },
  {
    question: "Is there a mobile app?",
    answer: "The Official App is optimized for mobile so coaches and officials can manage game day on the go.",
  },
  {
    question: "Do you support custom approvals?",
    answer: "Configure approvals for events, assignments, and changes so nothing goes live without sign-off.",
  },
  {
    question: "How long does onboarding take?",
    answer: "Most programs launch in a few weeks with guided migration, templates, and live support.",
  },
];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSessionServer();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--accent)/0.15)] text-lg font-semibold text-[hsl(var(--accent))]">
              OA
            </span>
            <span className="text-lg font-semibold tracking-tight">The Official App</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {[
              { href: "#features", label: "Features" },
              { href: "#roles", label: "Roles" },
              { href: "#pricing", label: "Pricing" },
              { href: "#faq", label: "FAQ" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[hsl(var(--accent))]"
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="space-y-24 pb-24">
        <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-br from-background via-background to-black/20">
          <div className="absolute inset-0 opacity-60" aria-hidden>
            <div className="absolute inset-y-0 left-[-20%] w-[60%] rotate-12 bg-[radial-gradient(circle,_rgba(47,255,203,0.15),_transparent_55%)]" />
            <div className="absolute inset-y-0 right-[-10%] w-[50%] -rotate-6 bg-[radial-gradient(circle,_rgba(47,255,203,0.12),_transparent_50%)]" />
          </div>
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <Badge className="border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]">
                Modern sports ops
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                All your high school sports management in one place.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Leagues, schools, athletic directors, coaches, and officials manage schedules, assignments, and payments in a single platform.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] sm:w-auto"
                >
                  <Link href="/signup">Get started</Link>
                </Button>
                <Link
                  href="/demo"
                  className="text-sm font-medium text-[hsl(var(--accent))] transition hover:opacity-80"
                >
                  Request a demo
                </Link>
              </div>
              <div className="grid gap-4 rounded-2xl border border-border/70 bg-card/70 p-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -left-8 rounded-3xl bg-[radial-gradient(circle,_rgba(47,255,203,0.2),_transparent_65%)] blur-3xl" aria-hidden />
              <div className="relative rounded-3xl border border-[hsl(var(--accent)/0.35)] bg-card/70 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
                    <p className="text-sm font-semibold">Game day overview</p>
                  </div>
                  <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]">
                    Live sync
                  </Badge>
                </div>
                <div className="grid gap-4 p-6 md:grid-cols-2">
                  <Card className="border-border/70 bg-background/80 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-semibold">Upcoming games</CardTitle>
                      <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      {[
                        { date: "Tue, Mar 12", matchup: "Eastview @ Ridge Valley", time: "6:30 PM" },
                        { date: "Wed, Mar 13", matchup: "North Creek @ Summit", time: "7:00 PM" },
                        { date: "Fri, Mar 15", matchup: "Central Prep vs Metro", time: "5:45 PM" },
                      ].map((game) => (
                        <div
                          key={game.matchup}
                          className="flex items-start justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2"
                        >
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{game.date}</p>
                            <p className="font-medium text-foreground">{game.matchup}</p>
                          </div>
                          <span className="text-xs text-[hsl(var(--accent))]">{game.time}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-border/70 bg-background/80 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-semibold">Assignments</CardTitle>
                      <Users2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      {[
                        { name: "Jordan Smith", role: "Referee", status: "Confirmed" },
                        { name: "Alex Johnson", role: "Umpire", status: "Pending" },
                        { name: "Taylor Lee", role: "Line Judge", status: "En route" },
                      ].map((assignment) => (
                        <div
                          key={assignment.name}
                          className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2"
                        >
                          <div>
                            <p className="font-medium text-foreground">{assignment.name}</p>
                            <p className="text-xs text-muted-foreground">{assignment.role}</p>
                          </div>
                          <Badge variant="secondary" className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
                            {assignment.status}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 border-border/70 bg-background/80 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-semibold">Program health</CardTitle>
                      <BarChart3 className="h-4 w-4 text-[hsl(var(--accent))]" />
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-3">
                      {[
                        { label: "Fill rate", value: "96%", note: "Assignments covered" },
                        { label: "Payment time", value: "48h", note: "Average payout window" },
                        { label: "Alerts", value: "3", note: "Venue conflicts" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-border/60 bg-card/60 px-4 py-3"
                        >
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                          <p className="text-xl font-semibold text-foreground">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.note}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl space-y-10 px-6">
          <div className="space-y-3 text-center">
            <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
              How it works
            </Badge>
            <h2 className="text-3xl font-semibold">Built for clarity and speed</h2>
            <p className="text-sm text-muted-foreground">
              Focused workflows keep leagues, schools, and officials aligned.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="h-full border-border/80 bg-card/80 transition hover:-translate-y-1 hover:border-[hsl(var(--accent)/0.5)]"
              >
                <CardHeader className="flex flex-row items-center gap-3">
                  <feature.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="roles" className="border-y border-border/70 bg-card/60 py-20">
          <div className="mx-auto max-w-6xl space-y-10 px-6">
            <div className="space-y-3 text-center">
              <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
                Roles
              </Badge>
              <h2 className="text-3xl font-semibold">Purpose-built for every role</h2>
              <p className="text-sm text-muted-foreground">
                Clear permissions, tailored dashboards, and confident collaboration.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {roles.map((role) => (
                <Card key={role.title} className="border-border/70 bg-background/80 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {role.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-12 px-6">
          <div className="space-y-4 text-center">
            <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
              Trusted by programs
            </Badge>
            <h2 className="text-3xl font-semibold">Confidence for schools, leagues, and crews</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-4 rounded-2xl border border-border/60 bg-card/70 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Partner logos</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {["Your High School Here", "Regional League", "City Prep", "Metro Officials", "Summit Conference", "District Athletics"].map((logo) => (
                  <div
                    key={logo}
                    className="flex h-16 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-xs font-semibold text-muted-foreground"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {testimonials.map((item) => (
                <Card key={item.title} className="border-border/70 bg-background/80">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{item.body}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-y border-border/70 bg-card/60 py-20">
          <div className="mx-auto max-w-5xl space-y-8 px-6">
            <div className="space-y-3 text-center">
              <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
                FAQ
              </Badge>
              <h2 className="text-3xl font-semibold">Answers for your launch</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="rounded-xl border border-border/70 bg-background/80 px-4"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-foreground">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-[hsl(var(--accent)/0.3)] bg-card/70 p-8 shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
                  Pricing
                </Badge>
                <h3 className="text-2xl font-semibold">Starter for Schools</h3>
                <p className="text-sm text-muted-foreground">
                  Centralize scheduling, assignments, and payments with onboarding support from our team.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                    <span>Unlimited schedules and assignments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                    <span>Integrated payouts and approvals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />
                    <span>Dedicated onboarding specialist</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
                <div className="text-3xl font-semibold">Contact us</div>
                <p className="text-sm text-muted-foreground">Custom rollout for your league or district.</p>
                <Button
                  size="lg"
                  className="w-full rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]"
                  asChild
                >
                  <Link href="/demo">Talk to our team</Link>
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span>No hidden fees. Transparent payouts.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-border bg-black/60 py-12 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]">
              OA
            </span>
            <span className="font-semibold">The Official App</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-foreground">
              Contact
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} The Official App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
