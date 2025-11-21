"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const COOLDOWN_MS = 60 * 1000;
const STORAGE_KEY = "theofficialapp-waitlist-last-submit";

const waitlistSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  organization: z.string().optional(),
  role: z.enum(
    ["School Admin", "AD", "Coach", "Official", "Admin", "Other"] as const,
    {
      required_error: "Select a role",
    },
  ),
  _topic: z.string().max(0).optional(),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

const roleOptions: Array<{ label: string; value: WaitlistFormValues["role"] }> =
  [
    { label: "School Administrator", value: "School Admin" },
    { label: "Athletic Director", value: "AD" },
    { label: "Coach", value: "Coach" },
    { label: "Official", value: "Official" },
    { label: "Administrator", value: "Admin" },
    { label: "Other", value: "Other" },
  ];

export function WaitlistForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);

  const form = useForm<WaitlistFormValues>({
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      role: "School Admin",
      _topic: "",
    },
    resolver: zodResolver(waitlistSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const stored = globalThis?.localStorage?.getItem(STORAGE_KEY);
    if (stored) {
      const asNumber = Number(stored);
      if (!Number.isNaN(asNumber) && asNumber > Date.now()) {
        setCooldownUntil(asNumber);
      }
    }
  }, []);

  const cooldownRemaining = useMemo(() => {
    if (!cooldownUntil) return 0;
    return Math.max(0, cooldownUntil - Date.now());
  }, [cooldownUntil]);

  const handleSubmit = async (values: WaitlistFormValues) => {
    const now = Date.now();
    if (cooldownUntil && cooldownUntil > now) {
      toast({
        title: "Please wait a moment",
        description: "You can submit the form again in a few seconds.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status === 201) {
        const nextWindow = Date.now() + COOLDOWN_MS;
        localStorage.setItem(STORAGE_KEY, nextWindow.toString());
        setCooldownUntil(nextWindow);
        form.reset({
          name: "",
          email: "",
          organization: "",
          role: "School Admin",
          _topic: "",
        });

        toast({
          title: "You're on the list!",
          description: "Thanks for joining The Official App waitlist.",
        });
        return;
      }

      if (response.status === 409) {
        toast({
          title: "Already registered",
          description:
            "You're already on the waitlist. We'll be in touch with updates shortly.",
        });
        return;
      }

      if (response.status === 429) {
        toast({
          title: "Rate limit",
          description:
            "We received a few submissions from this IP. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const payload = await response.json().catch(() => null);

      toast({
        title: "Something went wrong",
        description:
          payload?.message ?? "Unable to add you to the waitlist right now.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("[WaitlistForm] submit failed", error);
      toast({
        title: "Unexpected error",
        description: "Please try again in a few moments.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-4 sm:space-y-5 rounded-2xl border border-border bg-card/80 p-4 sm:p-6 shadow-lg backdrop-blur"
    >
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm sm:text-base">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Jordan Fisher"
            autoComplete="name"
            className="text-sm sm:text-base"
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className="text-xs sm:text-sm text-red-400">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm sm:text-base">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@school.edu"
            autoComplete="email"
            className="text-sm sm:text-base"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs sm:text-sm text-red-400">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="organization" className="text-sm sm:text-base">
            Organization
          </Label>
          <Input
            id="organization"
            placeholder="Central High School"
            autoComplete="organization"
            className="text-sm sm:text-base"
            {...form.register("organization")}
          />
          {form.formState.errors.organization ? (
            <p className="text-xs sm:text-sm text-red-400">
              {form.formState.errors.organization.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm sm:text-base">Role</Label>
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-card text-card-foreground">
                  {roleOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm sm:text-base"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.role ? (
            <p className="text-xs sm:text-sm text-red-400">
              {form.formState.errors.role.message}
            </p>
          ) : null}
        </div>
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...form.register("_topic")}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          disabled={isSubmitting || cooldownRemaining > 0}
          className="w-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)] sm:w-auto text-sm sm:text-base py-6 sm:py-7"
        >
          {isSubmitting
            ? "Submitting..."
            : cooldownRemaining > 0
              ? "You're on the list!"
              : "Join Waitlist"}
        </Button>
        {cooldownRemaining > 0 ? (
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            You can submit again in {Math.ceil(cooldownRemaining / 1000)}s.
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            No spam. We'll only email major updates.
          </p>
        )}
      </div>
    </form>
  );
}
