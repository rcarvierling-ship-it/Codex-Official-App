import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlarmClockCheck,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Compass,
  MessageSquare,
  ShieldCheck,
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
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { getSessionServer } from "@/lib/auth";

const heroMetrics = [
  { label: "Requests filled", value: "94%", delta: "+12%" },
  { label: "Crew confirmations", value: "<10m", delta: "faster" },
  { label: "Schools live", value: "180+", delta: "growing" },
];

const featureCards = [
  {
    title: "Live scheduling",
    description:
      "Publish calendars, update venues, and communicate changes instantly.",
    icon: CalendarClock,
  },
  {
    title: "Protected access",
    description:
      "Guardrails for assignors, ADs, coaches, and officials with clear roles.",
    icon: ShieldCheck,
  },
  {
    title: "Smart assignments",
    description:
      "Pair crews using certifications, distance, and prior conflicts automatically.",
    icon: ClipboardList,
  },
  {
    title: "Signals & alerts",
    description:
      "Centralized messaging to keep teams aligned when the schedule shifts.",
    icon: MessageSquare,
  },
  {
    title: "Unified rosters",
    description:
      "Manage multi-school programs, staff, and eligibility from one system.",
    icon: Users2,
  },
  {
    title: "Operational telemetry",
    description:
      "Dashboards for fill rates, travel, and reliability across your network.",
    icon: BarChart3,
  },
];

const partnerLogos = [
  "National Prep Network",
  "Summit Athletics",
  "Pacific Officials Guild",
  "Varsity Schedules",
  "Metro Charter League",
];

const operationalPillars = [
  {
    title: "Game day clarity",
    description:
      "One source of truth for kickoff, crew arrival, travel logistics, and venue readiness.",
    icon: AlarmClockCheck,
  },
  {
    title: "Admin precision",
    description:
      "Approval flows, audit trails, and controls that keep everyone compliant and accountable.",
    icon: CheckCircle2,
  },
  {
    title: "Expansion ready",
    description:
      "Blueprints for adding new sports, seasons, and regions without rebuilding playbooks.",
    icon: Compass,
  },
];

const howItWorks = [
  {
    title: "Launch your environment",
    description:
      "Import schedules, map facilities, and connect the teams responsible for approvals.",
  },
  {
    title: "Automate crew selection",
    description:
      "Request officials by certification, availability, and distance to get faster confirmations.",
  },
  {
    title: "Monitor & adapt",
    description:
      "Track fill rates, substitutions, and last-minute changes with alerts routed to the right people.",
  },
];

const waitlistBullets = [
  "White-glove onboarding and migration support",
  "Early access to new assignments and finance workflows",
  "Direct line to our product and success teams for admins",
];

const faq = [
  {
    question: "How does The Official App help athletic directors?",
    answer:
      "We centralize scheduling, approvals, assignments, communication, and payouts so ADs can run entire seasons without juggling spreadsheets or group chats.",
  },
  {
    question: "Can officials manage their own availability?",
    answer:
      "Yes. Officials update availability, request to work, and receive confirmations automatically, while assignors keep complete oversight.",
  },
  {
    question: "What integrations do you support?",
    answer:
      "The platform ships with APIs and planned integrations for payroll, facility systems, and SIS providers. The API Explorer highlights what's live and what's next.",
  },
  {
    question: "When will onboarding start?",
    answer:
      "We're bringing on early partners now. Join the waitlist and we'll share migration guides, invite codes, and roll-out timelines for your region.",
  },
];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // If user is authenticated, redirect to dashboard
  const session = await getSessionServer();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="space-y-24 pb-32">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[hsl(var(--accent)/0.12)] via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,255,203,0.18),transparent_35%),_radial-gradient(circle_at_80%_0%,rgba(47,255,203,0.08),transparent_30%)]" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-20 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div className="space-y-7">
            <Badge className="w-fit border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.08)] text-[hsl(var(--accent))]">
              Orchestrate game day with certainty
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                The command center for athletic departments &amp; officials
              </h1>
              <p className="max-w-3xl text-lg text-muted-foreground">
                Coordinate schedules, crews, and communication from one platform. Automate the back-and-forth so every event stays on time, staffed, and in compliance.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-lg shadow-[hsl(var(--accent)/0.3)] hover:bg-[hsl(var(--accent)/0.9)]"
              >
                <Link href="/demo">View Live Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border border-[hsl(var(--accent)/0.4)] bg-background/70 text-foreground hover:border-[hsl(var(--accent)/0.6)] hover:text-[hsl(var(--accent))]"
              >
                <Link href="#waitlist">Join Waitlist</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border border-border/60 bg-transparent text-foreground hover:border-[hsl(var(--accent)/0.5)] hover:text-[hsl(var(--accent))]"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            <div className="grid gap-4 rounded-3xl border border-border/60 bg-card/60 p-5 shadow-xl md:grid-cols-3">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="space-y-1 rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[hsl(var(--accent))]">{metric.delta}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle,_rgba(47,255,203,0.18),_transparent_65%)] blur-3xl" />
            <Card className="relative overflow-hidden border border-[hsl(var(--accent)/0.35)] bg-card/80 shadow-2xl backdrop-blur">
              <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live Ops Snapshot</p>
                    <p className="text-lg font-semibold text-foreground">Cross-school assignments</p>
                  </div>
                  <Badge className="rounded-full bg-[hsl(var(--accent)/0.2)] text-[hsl(var(--accent))]">Live</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Crew movement, travel windows, and approvals update in real time as your teams collaborate.
                </p>
              </CardHeader>
              <CardContent className="grid gap-4 p-6">
                {featureCards.slice(0, 3).map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/60 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/0.18)] text-[hsl(var(--accent))]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-dashed border-[hsl(var(--accent)/0.4)] bg-[hsl(var(--accent)/0.06)] p-4 text-sm text-[hsl(var(--accent-foreground))]">
                  Dispatch your next event with rules for travel, certification, and availability baked in.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-background/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Trusted by modern programs</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground md:gap-10">
            {partnerLogos.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border/60 bg-card/80 px-4 py-2 text-[13px] tracking-wide text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold">Precision for every role</h2>
          <p className="text-sm text-muted-foreground">
            From assignors to ADs to officials, everyone gets a clear lane, approvals, and communication in one system.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/80 bg-card/80 transition hover:-translate-y-1 hover:border-[hsl(var(--accent)/0.45)] hover:shadow-lg"
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

      <section className="border-y border-border bg-card/70 py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-semibold">Built for operational calm</h2>
            <p className="text-sm text-muted-foreground">
              Frameworks that absorb last-minute changes without disrupting your teams.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {operationalPillars.map((pillar) => (
              <Card key={pillar.title} className="border-border/70 bg-background/70 shadow-sm">
                <CardContent className="flex flex-col gap-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/0.2)] text-sm text-[hsl(var(--accent))]">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold">Launch in three steps</h2>
          <p className="text-sm text-muted-foreground">Go live quickly, with controls for every stakeholder.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <Card key={step.title} className="border-border/70 bg-card/70 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/0.2)] text-sm font-semibold text-[hsl(var(--accent))]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="waitlist"
        className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-start"
      >
        <div className="space-y-4 md:w-1/2">
          <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
            Priority access
          </Badge>
          <h2 className="text-3xl font-semibold">Join the Waitlist</h2>
          <p className="text-base text-muted-foreground">
            Be among the first to experience modern league operations. We'll reach out with onboarding resources and invite codes.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {waitlistBullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/60 px-4 py-3"
              >
                <span className="mt-0.5 text-[hsl(var(--accent))]">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4">
            <p className="mb-3 text-sm text-muted-foreground">Already have access? Sign in to your account.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <WaitlistForm />
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-8 px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faq.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-xl border border-border/70 bg-card/80 px-4"
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
      </section>

      <footer className="border-t border-border bg-card/80 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} The Official App. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Link href="/demo" className="transition hover:text-foreground">
              Demo
            </Link>
            <Link href="#waitlist" className="transition hover:text-foreground">
              Join Waitlist
            </Link>
            <Link href="/login" className="transition hover:text-foreground">
              Sign In
            </Link>
            <Link href="/privacy" className="transition hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
