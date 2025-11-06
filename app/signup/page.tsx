'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
        toast({
          title: "Account created",
          description: "You can now explore the interactive demo.",
        });
        router.push("/demo");
        return;
      }

      const payload = await response.json().catch(() => null);
      const message = payload?.message ?? "Unable to create an account right now.";

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
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur">
        <span className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
          Create account
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Join The Official App
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Launch the immersive demo experience with a single signup. No credit card required.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Jordan Fisher"
              autoComplete="name"
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@school.edu"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a secure password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-red-400">{errors.password.message}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <span className="text-[hsl(var(--accent))]">Terms</span> and{" "}
          <span className="text-[hsl(var(--accent))]">Privacy Policy</span>.
        </p>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Want a peek first?{" "}
          <Link href="/demo" className="font-semibold text-[hsl(var(--accent))] hover:underline">
            Explore the demo
          </Link>
        </p>
      </div>
    </main>
  );
}
