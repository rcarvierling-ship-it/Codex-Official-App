"use client";
import { useState, type ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const callbackUrl = "/dashboard";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-6 sm:p-8 shadow-xl backdrop-blur">
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Sign in
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sign in with your email and password.
          </p>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
              });
              setLoading(false);
              if (res?.ok) {
                router.push(`${callbackUrl}?from=login`);
              } else {
                setError("Invalid email or password. Please try again.");
              }
            } catch (err) {
              setLoading(false);
              setError("An error occurred. Please try again.");
              console.error("Login error:", err);
            }
          }}
          className="space-y-4 sm:space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="text-sm sm:text-base"
              aria-label="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="text-sm sm:text-base"
              aria-label="Password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] text-sm sm:text-base py-6 sm:py-7"
          >
            {loading ? "Signing in…" : "Continue"}
          </Button>
        </form>
        <div className="mt-6 space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[hsl(var(--accent))] hover:underline"
            >
              Sign up
            </Link>
          </p>
          <div className="text-center">
            <Link
              href="/"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
