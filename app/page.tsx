import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  CalendarClock,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users2,
  Wrench,
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
  { label: "Season setup time", value: "-60%" },
  { label: "Assignments covered", value: "99.3%" },
  { label: "Alerts delivered", value: "< 4s" },
];

const capabilityCards = [
  {
    title: "Unified assignments",
    description:
      "Build full crews with certifications, travel limits, and blackout rules baked in.",
    icon: ClipboardList,
    badge: "Crew control",
  },
  {
    title: "Scheduling autopilot",
    description:
      "Create events once and publish to every team, facility, and official with no double entry.",
    icon: CalendarClock,
    badge: "No spreadsheets",
  },
  {
    title: "Instant communication",
    description:
      "Send confirmations, last-minute changes, and payout details without chasing replies.",
    icon: MessageSquare,
    badge: "Always-on",
  },
  {
    title: "Role-based guardrails",
    description:
      "Granular permissions keep ADs, assignors, and officials focused on their work.",
    icon: ShieldCheck,
    badge: "Safe access",
  },
  {
    title: "Collaboration-ready",
    description:
      "Coordinate leagues, feeder programs, and multi-school tournaments from one workspace.",
    icon: Users2,
    badge: "Multi-org",
  },
  {
    title: "Developer-friendly",
    description:
      "APIs, webhooks, and sandbox data to sync schedules with finance, facilities, and SIS tools.",
    icon: Wrench,
    badge: "Extensible",
  },
];

const workflowSteps = [
  {
    title: "Import your entire season",
    description:
      "Upload existing calendars, rosters, and blackout dates. We normalize and dedupe automatically.",
    accent: "Migration-ready",
  },
  {
    title: "Set assignments & approvals",
    description:
      "Define who approves games, who can claim shifts, and which officials meet compliance requirements.",
    accent: "Policy-aware",
  },
  {
    title: "Broadcast changes in seconds",
    description:
      "Game moved? Officials swapped? Everyone gets notified instantly with a full audit log for staff.",
    accent: "Real-time",
  },
];

const assuranceHighlights = [
  {
    title: "Signal-rich alerts",
    description:
      "SMS + email notifications tuned for crews, transportation, and facilities so no update is missed.",
    icon: Bell,
  },
  {
    title: "Season overview",
    description:
      "Dashboards for coverage, conflicts, and payouts give ADs a single source of truth every week.",
    icon: Sparkles,
  },
  {
    title: "Compliance built-in",
    description:
      "Eligibility checks, certifications, and rate cards are enforced before assignments go live.",
    icon: ShieldCheck,
  },
];

const waitlistBullets = [
  "Priority onboarding and migration support",
  "Early access to new workflows and integrations",
  "Direct line to product + success teams for admins",
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
    <div className="relative overflow-hidden bg-background pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,255,203,0.1),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(47,255,203,0.12),transparent_30%)]" />

      <section className="relative z-10 border-b border-border/70 bg-gradient-to-b from-background/80 via-background/60 to-background/90">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-16 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]">
              Built for athletic departments
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Command every game day without juggling tools.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                The Official App is your single control plane for scheduling, assignments, and communications across schools, leagues, and officials.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]"
              >
                <Link href="/demo">View Live Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border border-[hsl(var(--accent)/0.4)] bg-transparent text-foreground hover:border-[hsl(var(--accent)/0.6)] hover:text-[hsl(var(--accent))]"
              >
                <Link href="#waitlist">Join Waitlist</Link>
              </Button>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Demo and waitlist spots available
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <Card
                  key={metric.label}
                  className="border-border/60 bg-card/70 shadow-sm backdrop-blur"
                >
                  <CardContent className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">
                      {metric.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle,_rgba(47,255,203,0.18),_transparent_70%)] blur-3xl" />
            <div className="relative flex flex-col gap-5 rounded-3xl border border-[hsl(var(--accent)/0.25)] bg-card/80 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live control</p>
                  <p className="text-lg font-semibold text-foreground">Game Day Command</p>
                </div>
                <div className="rounded-full border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
                  Real-time
                </div>
              </div>

              <div className="grid gap-3">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        {metric.label}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {metric.value}
                      </p>
                    </div>
                    <span className="rounded-full bg-[hsl(var(--accent)/0.15)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
                      Live data
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Action queue</p>
                  <p className="text-sm text-foreground">Assign 2 officials • Notify transportation</p>
                </div>
                <Badge className="bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]">Ready</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b border-border/70 bg-background/80">
        <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Operations without chaos</p>
            <h2 className="text-3xl font-semibold">Control every phase of the season</h2>
            <p className="text-sm text-muted-foreground">
              From pre-season imports to playoff reschedules, every workflow lives in one modern control center.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capabilityCards.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-border/70 bg-card/80 transition hover:border-[hsl(var(--accent)/0.5)] hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-[radial-gradient(circle,_rgba(47,255,203,0.12),_transparent_60%)] transition group-hover:translate-y-0 group-hover:opacity-100" />
                <CardHeader className="flex flex-row items-center gap-3">
                  <feature.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))]">
                      {feature.badge}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-border bg-card/70">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[0.9fr,1.1fr] md:items-center">
          <div className="space-y-4">
            <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]">
              Launch-ready workflows
            </Badge>
            <h3 className="text-3xl font-semibold">Your rollout, guided from day one</h3>
            <p className="text-base text-muted-foreground">
              We onboard your staff, migrate historical schedules, and set approval rules so everyone knows their lane on day one.
            </p>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Migration support:</span> CSV uploads, existing vendor exports, and roster syncs are included for early partners.
            </div>
          </div>

          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <Card key={step.title} className="border-border/70 bg-background/80 shadow-sm">
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/0.15)] text-sm font-semibold text-[hsl(var(--accent))]">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-foreground">{step.title}</h4>
                      <Badge className="bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]">
                        {step.accent}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-background/90">
        <div className="mx-auto max-w-6xl space-y-10 px-6 py-16">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Reliability built in</p>
            <h3 className="text-3xl font-semibold">Coverage, communication, and compliance in sync</h3>
            <p className="text-sm text-muted-foreground">
              Every stakeholder sees the same truth. Alerts and approvals are recorded automatically so nothing slips.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {assuranceHighlights.map((item) => (
              <Card key={item.title} className="border-border/70 bg-card/80">
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                    <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="waitlist"
        className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-start"
      >
        <div className="md:w-1/2 space-y-4">
          <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]">
            Priority access
          </Badge>
          <h2 className="text-3xl font-semibold">Join the waitlist</h2>
          <p className="text-base text-muted-foreground">
            Be among the first to experience modern league operations. We'll reach out with onboarding resources and invite codes.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {waitlistBullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/70 px-4 py-3"
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

      <section className="relative z-10 mx-auto max-w-5xl space-y-8 px-6">
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

      <footer className="relative z-10 mt-12 border-t border-border bg-card/80 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-sm text-foreground">Ready to see The Official App in action?</p>
            <p className="text-sm text-muted-foreground">
              Run a live demo or join the waitlist to partner on your rollout.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="sm" className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]">
              <Link href="/demo">View Live Demo</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border border-[hsl(var(--accent)/0.4)] hover:border-[hsl(var(--accent)/0.6)] hover:text-[hsl(var(--accent))]"
            >
              <Link href="#waitlist">Join Waitlist</Link>
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground transition hover:text-foreground">
              Sign In
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground transition hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground transition hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
