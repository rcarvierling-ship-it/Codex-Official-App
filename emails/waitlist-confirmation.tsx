import * as React from "react";

interface WaitlistConfirmationEmailProps {
  name?: string;
}

export function WaitlistConfirmationEmail({
  name,
}: WaitlistConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", color: "#0f172a" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        {name ? `Hi ${name},` : "Hi there,"}
      </h1>
      <p style={{ marginBottom: "12px", lineHeight: 1.6 }}>
        Thanks for joining The Official App waitlist. We&apos;re excited to show
        you how athletic directors, coaches, and officials run leagues together
        in one place.
      </p>
      <p style={{ marginBottom: "12px", lineHeight: 1.6 }}>
        You&apos;ll be among the first to know when early access opens. Expect
        a quick onboarding walkthrough, best-practice playbooks, and resources
        to migrate your existing schedules.
      </p>
      <p style={{ marginBottom: "12px", lineHeight: 1.6 }}>
        In the meantime, feel free to replay the interactive demo or reach out
        with must-have integrations. We&apos;re building the platform with your
        season in mind.
      </p>
      <p style={{ marginTop: "24px", marginBottom: "4px" }}>Talk soon,</p>
      <strong>The Official App Team</strong>
    </div>
  );
}
