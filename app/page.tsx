import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  AlarmClock,
  ArrowDownCircle,
  CalendarClock,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { getSessionServer } from "@/lib/auth";

const heroMetrics = [
  { label: "Events on deck", value: "48", delta: "+12%" },
  { label: "Officials confirmed", value: "162", delta: "98% fill" },
  { label: "Game day alerts", value: "0", delta: "All clear" },
];

const signalPillars = [
  {
    title: "Scheduling without back-and-forth",
    description:
      "Build calendars, set approvers, and sync changes instantly to every crew.",
    icon: CalendarClock,
  },
  {
    title: "Assignments with confidence",
    description:
      "Match availability, distance, certification, and pay rules automatically.",
    icon: ClipboardList,
  },
  {
    title: "Communication built in",
    description:
      "Send announcements, confirmations, and contingencies from one command bar.",
    icon: MessageSquare,
  },
  {
    title: "Governed access",
    description:
      "Role-based controls keep ADs, assignors, and coaches aligned without chaos.",
    icon: ShieldCheck,
  },
];

const operationsGrid = [
  {
    title: "Program control tower",
    description:
      "Oversee leagues, schools, facilities, and staff in a single pane with live status on every contest.",
    accent: "Live visibility",
  },
  {
    title: "Workflow automations",
    description:
      "Trigger approvals, reminders, travel checks, and payouts based on assignments and milestones.",
    accent: "Hands-off ops",
  },
  {
    title: "API + webhooks",
    description:
      "Pipe schedules, scores, and staffing into finance or SIS systems with structured events.",
    accent: "Built for devs",
  },
  {
    title: "Security by default",
    description:
      "Audit trails, environment isolation, and SSO-ready access keep stakeholders protected.",
    accent: "Enterprise ready",
  },
];

const partnerLogos = [
  "Summit Athletic Association",
  "Metro Prep Network",
  "Coastal Officials Union",
  "Varsity Schedules",
  "North Ridge Schools",
];

const signalMoments = [
  {
    title: "Morning checks",
    description: "Surface conflicts, facility holds, and late travel in one view.",
    icon: AlarmClock,
  },
  {
    title: "Assignments go out",
    description: "Officials receive confirms, crew chat opens, ADs see coverage %.",
    icon: ArrowDownCircle,
  },
  {
    title: "Game time",
    description: "Score updates, incidents, and payouts route automatically.",
    icon: Activity,
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
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_20%_20%,_rgba(47,255,203,0.12),_transparent_35%),radial-gradient(circle_at_80%_0%,_rgba(47,129,255,0.12),_transparent_32%)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),linear-gradient(rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <Badge className="w-fit border border-[hsl(var(--accent)/0.35)] bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]">
              Control tower for school &amp; league ops
            </Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Run every game day from one command center.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Scheduling, assignments, communication, and payouts in a single workspace built for athletic departments and assignors who can’t afford missteps.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-lg shadow-[hsl(var(--accent)/0.4)] hover:bg-[hsl(var(--accent)/0.92)]"
              >
                <Link href="/demo">View Live Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border border-[hsl(var(--accent)/0.5)] bg-transparent text-foreground hover:border-[hsl(var(--accent)/0.7)] hover:text-[hsl(var(--accent))]"
              >
                <Link href="#waitlist">Join Waitlist</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <Card
                  key={metric.label}
                  className="border-border/70 bg-card/70 shadow-sm backdrop-blur"
                >
                  <CardContent className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                    <p className="text-xs text-[hsl(var(--accent))]">{metric.delta}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-[32px] bg-[radial-gradient(circle,_rgba(47,255,203,0.2),_transparent_60%)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card/80 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Signal map</p>
                  <p className="text-lg font-semibold">Game Day Control</p>
                </div>
                <div className="rounded-full border border-[hsl(var(--accent)/0.4)] bg-[hsl(var(--accent)/0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
                  Live Feed
                </div>
              </div>
              <div className="space-y-1 border-b border-border/60 bg-[linear-gradient(120deg,rgba(255,255,255,0.02),rgba(255,255,255,0)),linear-gradient(rgba(255,255,255,0.02),rgba(255,255,255,0))] p-6">
                {signalMoments.map((moment) => (
                  <div
                    key={moment.title}
                    className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/70 p-3"
                  >
                    <span className="mt-1 rounded-full bg-[hsl(var(--accent)/0.15)] p-2 text-[hsl(var(--accent))]">
                      <moment.icon className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{moment.title}</p>
                      <p className="text-xs text-muted-foreground">{moment.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 bg-background/50 p-6 md:grid-cols-2">
                {signalPillars.slice(0, 2).map((pillar) => (
                  <div
                    key={pillar.title}
                    className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-card/70 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <pillar.icon className="h-4 w-4 text-[hsl(var(--accent))]" />
                      {pillar.title}
                    </div>
                    <p className="text-xs text-muted-foreground">{pillar.description}</p>
                  </div>
                ))}
                <div className="col-span-full rounded-2xl border border-[hsl(var(--accent)/0.4)] bg-[hsl(var(--accent)/0.08)] p-5">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Need a walkthrough?</span>
                    <Link href="/demo" className="text-[hsl(var(--accent))] underline underline-offset-4">
                      Jump into the demo
                    </Link>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Preview the full experience across schools, leagues, and officials without setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Trusted by modern programs</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:gap-8">
            {partnerLogos.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-[13px] tracking-wide text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-12 px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Operational layers that keep you ahead</h2>
            <p className="text-sm text-muted-foreground">
              Align schedules, crews, and facilities with automation instead of endless follow-ups.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="border-[hsl(var(--accent)/0.5)] text-[hsl(var(--accent))]">
              <Link href="/demo">Watch the product tour</Link>
            </Button>
            <Button asChild size="sm" className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
              <Link href="#waitlist">Join the waitlist</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {operationsGrid.map((item) => (
            <Card
              key={item.title}
              className="relative overflow-hidden border-border/70 bg-card/80 shadow-sm transition hover:-translate-y-1 hover:border-[hsl(var(--accent)/0.5)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,255,203,0.08),transparent_40%)]" />
              <CardContent className="relative space-y-3 p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
                  <span className="h-1 w-1 rounded-full bg-[hsl(var(--accent))]" />
                  {item.accent}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-background/70 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-4">
            <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
              Fewer gaps, faster approvals
            </Badge>
            <h2 className="text-3xl font-semibold">Game day without the scramble</h2>
            <p className="text-base text-muted-foreground">
              Prepare every contest with predictable workflows that keep athletic directors, assignors, and officials aligned from the first request to the final whistle.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {signalMoments.map((moment) => (
                <div
                  key={moment.title}
                  className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/70 p-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <moment.icon className="h-4 w-4 text-[hsl(var(--accent))]" />
                    {moment.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{moment.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[28px] border border-[hsl(var(--accent)/0.4)] bg-[hsl(var(--accent)/0.08)] p-6 shadow-xl">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Coverage view</span>
                <span className="rounded-full bg-background px-3 py-1 text-[11px] text-muted-foreground">Officials, crews, travel</span>
              </div>
              <div className="mt-4 space-y-3">
                {signalPillars.map((pillar) => (
                  <div key={pillar.title} className="flex items-start gap-3 rounded-xl bg-background/70 p-3">
                    <div className="rounded-full bg-[hsl(var(--accent)/0.15)] p-2 text-[hsl(var(--accent))]">
                      <pillar.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pillar.title}</p>
                      <p className="text-xs text-muted-foreground">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild size="sm" className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                  <Link href="/demo">View live demo</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border-[hsl(var(--accent)/0.4)] text-[hsl(var(--accent))]">
                  <Link href="#waitlist">Get on the list</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="waitlist"
        className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr,0.9fr] md:items-start"
      >
        <div className="space-y-4">
          <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
            Priority access
          </Badge>
          <h2 className="text-3xl font-semibold">Join the waitlist</h2>
          <p className="text-base text-muted-foreground">
            Be among the first to experience modern league operations. We'll reach out with onboarding resources and invite codes tailored to your program.
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
          <div className="pt-2 text-sm text-muted-foreground">
            Already have access? <Link href="/login" className="text-[hsl(var(--accent))] underline">Sign in here</Link>.
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-lg">
          <WaitlistForm />
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 pb-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Frequently asked questions</h2>
          <p className="text-sm text-muted-foreground">Everything you need to know before you launch.</p>
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
          <div>
            <p className="text-sm font-semibold text-foreground">The Official App</p>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
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
    </div>
  );
}
