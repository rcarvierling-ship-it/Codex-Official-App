export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for The Official App",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
          <p>
            By accessing or using The Official App ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
          <p>
            Permission is granted to use the Service for the purpose of managing sports operations, event scheduling, and official assignments. This license shall automatically terminate if you violate any of these restrictions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
          <p>You may not use the Service:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>In any way that violates any applicable law or regulation</li>
            <li>To transmit any malicious code or viruses</li>
            <li>To interfere with or disrupt the Service or servers</li>
            <li>To impersonate or attempt to impersonate any person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
          <p>
            In no event shall The Official App, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@the-official-app.com" className="text-[hsl(var(--accent))] hover:underline">
              legal@the-official-app.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

