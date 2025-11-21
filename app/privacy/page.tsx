export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for The Official App",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      <header className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <div className="prose prose-sm max-w-none space-y-6 sm:space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Introduction</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            The Official App ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our sports operations platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Information We Collect</h2>
          <p className="text-sm sm:text-base leading-relaxed">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-2 text-sm sm:text-base">
            <li>Name, email address, and contact information</li>
            <li>Organization and role information</li>
            <li>Event scheduling and assignment data</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">How We Use Your Information</h2>
          <p className="text-sm sm:text-base leading-relaxed">We use the information we collect to:</p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 mt-2 text-sm sm:text-base">
            <li>Provide and maintain our services</li>
            <li>Process and manage event scheduling and assignments</li>
            <li>Send you administrative information and updates</li>
            <li>Respond to your inquiries and support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Data Security</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Contact Us</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@the-official-app.com" className="text-[hsl(var(--accent))] hover:underline">
              privacy@the-official-app.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

