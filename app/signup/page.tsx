"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const signupSchema = z.object({
  name: z.string().min(2, "Your name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupValues) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        // Automatically log in the user after registration
        const signInResult = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          toast({
            title: "Account created",
            description: "Welcome! Let's set up your profile.",
          });
          // Redirect to onboarding to collect school/role information
          router.push("/onboarding");
          return;
        } else {
          // If auto-login fails, still redirect to login page
          toast({
            title: "Account created",
            description: "Please sign in to continue.",
          });
          router.push("/login");
          return;
        }
      }

      const payload = await response.json().catch(() => null);
      const message =
        payload?.message ?? "Unable to create an account right now.";

      toast({
        title: "Signup failed",
        description: message,
        variant: response.status === 409 ? "default" : "destructive",
      });
    } catch (error) {
      console.error("[signup] POST failed", error);
      toast({
        title: "Unexpected error",
        description: "Please try again shortly.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-6 sm:p-8 shadow-xl backdrop-blur">
        <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[hsl(var(--accent))]">
          Create account
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Join The Official App
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Launch the immersive demo experience with a single signup. No credit
          card required.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4 sm:space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Jordan Fisher"
              autoComplete="name"
              className="text-sm sm:text-base"
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs sm:text-sm text-red-400">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@school.edu"
              autoComplete="email"
              className="text-sm sm:text-base"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs sm:text-sm text-red-400">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm sm:text-base">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a secure password"
              autoComplete="new-password"
              className="text-sm sm:text-base"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs sm:text-sm text-red-400">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] text-sm sm:text-base py-6 sm:py-7"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[hsl(var(--accent))] hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              href="/terms"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[hsl(var(--accent))] hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Want a peek first?{" "}
            <Link
              href="/demo"
              className="font-semibold text-[hsl(var(--accent))] hover:underline"
            >
              Explore the demo
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
