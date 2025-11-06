import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  ClipboardList,
  MessageSquare,
  ShieldCheck,
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
  { label: "Events Today", value: "12", delta: "+5%" },
  { label: "Pending Requests", value: "18", delta: "-3%" },
  { label: "Active Officials", value: "76", delta: "+12%" },
];

const featureCards = [
  {
    title: "Real-time Event Management",
    description:
      "Create, reschedule, and broadcast updates across teams with ease.",
    icon: CalendarClock,
  },
  {
    title: "Role-Based Access",
    description:
      "Give ADs, coaches, and officials the tools they need with guardrails.",
    icon: ShieldCheck,
  },
  {
    title: "Instant Assignments",
    description:
      "Match officials based on availability, certifications, and distance.",
    icon: ClipboardList,
  },
  {
    title: "Built-in Communication",
    description:
      "Send announcements, confirmations, and alerts from one command center.",
    icon: MessageSquare,
  },
  {
    title: "Team Coordination",
    description:
      "Manage rosters, staff, and logistics across multiple schools or leagues.",
    icon: Users2,
  },
  {
    title: "Developer Tools",
    description:
      "APIs, webhooks, and sandbox data to connect scheduling with operations.",
    icon: Wrench,
  },
];

const partnerLogos = [
  "Summit Athletic Association",
  "Metro Prep Network",
  "Coastal Officials Union",
  "Varsity Schedules",
  "North Ridge Schools",
];

const howItWorks = [
  {
    title: "Create leagues & schools",
    description:
      "Set up programs, import rosters, and define who can approve events.",
  },
  {
    title: "Schedule events & invite officials",
    description:
      "Build calendars, request crews, and share live updates instantly.",
  },
  {
    title: "Approve requests & track assignments",
    description:
      "Review availability, confirm assignments, and monitor status in real time.",
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

export default async function HomePage() {
  // If user is authenticated, redirect to dashboard
  const session = await getSessionServer();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-24 pb-32">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(47,255,203,0.18),_transparent_60%)]" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          <div className="space-y-6">
            <Badge className="w-fit border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
              All-in-one sports ops
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              The Official App — League &amp; Event Management
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Power athletic departments with real-time scheduling, approvals,
              officials workflows, and communication tools built for schools,
              leagues, and assignors.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
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
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border border-[hsl(var(--accent)/0.4)] bg-transparent text-foreground hover:border-[hsl(var(--accent)/0.6)] hover:text-[hsl(var(--accent))]"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Fast • Secure • Built for schools &amp; leagues
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle,_rgba(47,255,203,0.18),_transparent_70%)] blur-3xl" />
            <div className="relative flex flex-col gap-5 rounded-3xl border border-[hsl(var(--accent)/0.3)] bg-card/80 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Interactive demo
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    Game Day Command
                  </p>
                </div>
                <div className="rounded-full border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.15)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
                  Live
                </div>
              </div>
              <div className="grid gap-3">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm"
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
                      {metric.delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Trusted by modern programs
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground md:gap-10">
            {partnerLogos.map((name) => (
              <span
                key={name}
                className="rounded-full border border-border/60 bg-card/70 px-4 py-2 text-[13px] tracking-wide text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-6">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-semibold">Everything You Need</h2>
          <p className="text-sm text-muted-foreground">
            Powerful workflows designed to simplify sports league operations.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/80 bg-card/80 transition hover:border-[hsl(var(--accent)/0.4)] hover:bg-card/90"
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <feature.icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/70 py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-semibold">How it works</h2>
            <p className="text-sm text-muted-foreground">
              Launch your league ops in three simple steps.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <Card
                key={step.title}
                className="border-border/70 bg-background/70 shadow-sm"
              >
                <CardContent className="flex flex-col gap-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/0.2)] text-sm font-semibold text-[hsl(var(--accent))]">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="waitlist"
        className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-start"
      >
        <div className="md:w-1/2 space-y-4">
          <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]">
            Priority access
          </Badge>
          <h2 className="text-3xl font-semibold">Join the Waitlist</h2>
          <p className="text-base text-muted-foreground">
            Be among the first to experience modern league operations. We'll
            reach out with onboarding resources and invite codes.
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
            <p className="text-sm text-muted-foreground mb-3">
              Already have access? Sign in to your account.
            </p>
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
    </div>
  );
}
