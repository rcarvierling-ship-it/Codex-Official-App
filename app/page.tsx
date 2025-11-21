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
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
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
      "Create, reschedule, and broadcast updates across teams with ease. Keep everyone in sync with instant notifications.",
    icon: CalendarClock,
    color: "text-cyan-400",
  },
  {
    title: "Role-Based Access",
    description:
      "Give ADs, coaches, and officials the tools they need with proper guardrails and permissions.",
    icon: ShieldCheck,
    color: "text-emerald-400",
  },
  {
    title: "Instant Assignments",
    description:
      "Match officials based on availability, certifications, and distance automatically.",
    icon: ClipboardList,
    color: "text-blue-400",
  },
  {
    title: "Built-in Communication",
    description:
      "Send announcements, confirmations, and alerts from one command center.",
    icon: MessageSquare,
    color: "text-purple-400",
  },
  {
    title: "Team Coordination",
    description:
      "Manage rosters, staff, and logistics across multiple schools or leagues seamlessly.",
    icon: Users2,
    color: "text-orange-400",
  },
  {
    title: "Developer Tools",
    description:
      "APIs, webhooks, and sandbox data to connect scheduling with operations.",
    icon: Wrench,
    color: "text-pink-400",
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
      "Set up programs, import rosters, and define who can approve events. Get started in minutes.",
    icon: Sparkles,
  },
  {
    title: "Schedule events & invite officials",
    description:
      "Build calendars, request crews, and share live updates instantly with all stakeholders.",
    icon: CalendarClock,
  },
  {
    title: "Approve requests & track assignments",
    description:
      "Review availability, confirm assignments, and monitor status in real time from anywhere.",
    icon: TrendingUp,
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
      "We centralize scheduling, approvals, assignments, communication, and payouts so ADs can run entire seasons without juggling spreadsheets or group chats. Everything you need is in one place.",
  },
  {
    question: "Can officials manage their own availability?",
    answer:
      "Yes. Officials update availability, request to work, and receive confirmations automatically, while assignors keep complete oversight and control.",
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent)/0.1)] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(47,255,203,0.15),_transparent_50%)]" />

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 right-10 w-32 h-32 opacity-10 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,5 90,50 50,95 10,50"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50;360 50 50"
                dur="20s"
                repeatCount="indefinite"
              />
            </polygon>
          </svg>
        </div>
        <div className="absolute bottom-20 left-10 w-24 h-24 opacity-10 hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[hsl(var(--accent))]"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 50 50;-360 50 50"
                dur="15s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
            />
          </svg>
        </div>

        {/* Curved Lines Decoration */}
        <div className="absolute top-1/2 left-0 w-full h-full opacity-5 hidden md:block">
          <svg viewBox="0 0 1200 400" className="w-full h-full">
            <path
              d="M 0,200 Q 300,100 600,200 T 1200,200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[hsl(var(--accent))]"
            />
            <path
              d="M 0,250 Q 300,150 600,250 T 1200,250"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[hsl(var(--accent))]"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 sm:space-y-8">
              <Badge className="w-fit border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] text-xs sm:text-sm px-3 py-1">
                All-in-one sports ops
              </Badge>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                The Official App — League &amp; Event Management
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-2xl leading-relaxed">
                Power athletic departments with real-time scheduling, approvals,
                officials workflows, and communication tools built for schools,
                leagues, and assignors.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] text-sm sm:text-base px-6 py-6 sm:py-7"
                >
                  <Link href="/demo" className="flex items-center gap-2">
                    View Live Demo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border border-[hsl(var(--accent)/0.4)] bg-transparent text-foreground hover:border-[hsl(var(--accent)/0.6)] hover:text-[hsl(var(--accent))] text-sm sm:text-base px-6 py-6 sm:py-7"
                >
                  <Link href="#waitlist">Join Waitlist</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Fast • Secure • Built for schools &amp; leagues
                </span>
              </div>
            </div>

            {/* Right Column - Metrics Card */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle,_rgba(47,255,203,0.2),_transparent_70%)] blur-3xl" />

              {/* Decorative Corner Graphics */}
              <div className="absolute -top-2 -right-2 w-16 h-16 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M 0,0 L 100,0 L 100,100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-[hsl(var(--accent))]"
                  />
                  <circle
                    cx="90"
                    cy="10"
                    r="5"
                    fill="currentColor"
                    className="text-[hsl(var(--accent))]"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M 0,100 L 0,0 L 100,0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-[hsl(var(--accent))]"
                  />
                </svg>
              </div>

              <div className="relative flex flex-col gap-4 sm:gap-5 rounded-3xl border border-[hsl(var(--accent)/0.3)] bg-card/90 p-5 sm:p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Interactive demo
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-foreground mt-1">
                      Game Day Command
                    </p>
                  </div>
                  <div className="rounded-full border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.15)] px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
                    Live
                  </div>
                </div>
                <div className="grid gap-2 sm:gap-3">
                  {heroMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-3 sm:px-4 py-2.5 sm:py-3"
                    >
                      <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {metric.label}
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-foreground mt-0.5">
                          {metric.value}
                        </p>
                      </div>
                      <span className="rounded-full bg-[hsl(var(--accent)/0.15)] px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
                        {metric.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="relative border-y border-border/60 bg-background/40 overflow-hidden">
        {/* Decorative Wave Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg
            viewBox="0 0 1200 120"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M 0,60 Q 150,20 300,60 T 600,60 T 900,60 T 1200,60 L 1200,120 L 0,120 Z"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
            />
          </svg>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 relative z-10">
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Trusted by modern programs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
              {partnerLogos.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-border/60 bg-card/70 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm tracking-wide text-muted-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="dots"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="1.5"
                  fill="currentColor"
                  className="text-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 hidden lg:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon
              points="100,10 190,190 10,190"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
            />
            <polygon
              points="100,30 170,170 30,170"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-5 hidden lg:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect
              x="20"
              y="20"
              width="160"
              height="160"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[hsl(var(--accent))]"
            />
            <rect
              x="40"
              y="40"
              width="120"
              height="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[hsl(var(--accent))]"
            />
          </svg>
        </div>

        <div className="space-y-8 sm:space-y-10 relative z-10">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            {/* Decorative Icon Above Title */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(var(--accent)/0.2)] blur-xl rounded-full"></div>
                <div className="relative w-16 h-16 rounded-full bg-[hsl(var(--accent)/0.1)] flex items-center justify-center border border-[hsl(var(--accent)/0.3)]">
                  <Sparkles className="h-8 w-8 text-[hsl(var(--accent))]" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Everything You Need
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Powerful workflows designed to simplify sports league operations.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <Card
                key={feature.title}
                className="relative border-border/80 bg-card/80 transition-all hover:border-[hsl(var(--accent)/0.4)] hover:bg-card/90 hover:shadow-lg overflow-hidden group"
              >
                {/* Decorative Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className={feature.color}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className={feature.color}
                    />
                  </svg>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-10 bg-[hsl(var(--accent)/0.3)] blur-2xl"></div>

                <CardHeader className="flex flex-row items-start gap-3 sm:gap-4 pb-3 relative z-10">
                  <div className={`${feature.color} flex-shrink-0 relative`}>
                    <div className="absolute inset-0 bg-[hsl(var(--accent)/0.2)] opacity-20 blur-md rounded-full"></div>
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold leading-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative border-y border-border bg-card/50 py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Connecting Lines Between Steps */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(var(--accent)/0.2)] to-transparent hidden md:block"></div>

        {/* Decorative Circles */}
        <div className="absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-[hsl(var(--accent))] opacity-30 hidden md:block"></div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[hsl(var(--accent))] opacity-30 hidden md:block"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-[hsl(var(--accent))] opacity-30 hidden md:block"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hexagons"
                width="50"
                height="43.4"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="24.8,22 37.5,38.2 24.8,54.4 12.2,38.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="space-y-2 sm:space-y-3 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                How it works
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Launch your league ops in three simple steps.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              {howItWorks.map((step, index) => (
                <Card
                  key={step.title}
                  className="relative border-border/70 bg-background/70 shadow-sm overflow-hidden group"
                >
                  {/* Step Number Background Graphic */}
                  <div className="absolute top-0 left-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <text
                        x="50"
                        y="70"
                        fontSize="80"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-[hsl(var(--accent))]"
                      >
                        {index + 1}
                      </text>
                    </svg>
                  </div>

                  <CardContent className="flex flex-col gap-3 sm:gap-4 p-5 sm:p-6 relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[hsl(var(--accent)/0.3)] blur-lg rounded-full"></div>
                        <span className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[hsl(var(--accent)/0.2)] text-sm sm:text-base font-semibold text-[hsl(var(--accent))] flex-shrink-0 border-2 border-[hsl(var(--accent)/0.3)]">
                          {index + 1}
                        </span>
                      </div>
                      <div
                        className={`text-[hsl(var(--accent))] flex-shrink-0 relative`}
                      >
                        <div className="absolute inset-0 bg-[hsl(var(--accent)/0.2)] blur-md rounded-full"></div>
                        <step.icon className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section
        id="waitlist"
        className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 hidden lg:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="grad1" cx="50%" cy="50%">
                <stop
                  offset="0%"
                  stopColor="currentColor"
                  className="text-[hsl(var(--accent))]"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0"
                  className="text-[hsl(var(--accent))]"
                />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
            <circle
              cx="100"
              cy="100"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[hsl(var(--accent))]"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5 hidden lg:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon
              points="100,20 180,180 20,180"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
            />
            <polygon
              points="100,40 160,160 40,160"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="circles"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="30"
                  cy="30"
                  r="2"
                  fill="currentColor"
                  className="text-[hsl(var(--accent))]"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circles)" />
          </svg>
        </div>

        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:items-start relative z-10">
          <div className="lg:w-1/2 space-y-4 sm:space-y-6">
            <Badge className="border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] text-xs sm:text-sm px-3 py-1">
              Priority access
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Join the Waitlist
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Be among the first to experience modern league operations. We'll
              reach out with onboarding resources and invite codes.
            </p>
            <ul className="space-y-2 sm:space-y-3">
              {waitlistBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2 sm:gap-3 rounded-xl border border-border/60 bg-background/60 px-3 sm:px-4 py-2.5 sm:py-3"
                >
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[hsl(var(--accent))] flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-muted-foreground">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-2 sm:pt-4">
              <p className="text-sm sm:text-base text-muted-foreground mb-3">
                Already have access? Sign in to your account.
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,10 L 90,90 L 10,90 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[hsl(var(--accent))]"
            />
            <path
              d="M 50,20 L 80,80 L 20,80 Z"
              fill="currentColor"
              className="text-[hsl(var(--accent))]"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="diagonal"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0,40 L 40,0"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-foreground"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal)" />
          </svg>
        </div>

        <div className="space-y-6 sm:space-y-8 relative z-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion
            type="single"
            collapsible
            className="space-y-2 sm:space-y-3"
          >
            {faq.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index}`}
                className="rounded-xl border border-border/70 bg-card/80 px-3 sm:px-4 md:px-6"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base md:text-lg font-medium text-foreground py-4 sm:py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-4 sm:pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} The Official App. All rights
              reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <Link href="/demo" className="transition hover:text-foreground">
                Demo
              </Link>
              <Link
                href="#waitlist"
                className="transition hover:text-foreground"
              >
                Join Waitlist
              </Link>
              <Link href="/login" className="transition hover:text-foreground">
                Sign In
              </Link>
              <Link
                href="/privacy"
                className="transition hover:text-foreground"
              >
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
