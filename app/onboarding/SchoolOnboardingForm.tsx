"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { School } from "@/lib/repos/schools";

type Props = {
  schools: School[];
};

export function SchoolOnboardingForm({ schools }: Props) {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id ?? "");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleJoinExisting = () => {
    if (!selectedSchoolId) {
      setError("Choose a school to continue.");
      return;
    }
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/schools/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: selectedSchoolId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message ?? "Unable to join this school right now.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  const handleCreateSchool = () => {
    if (!newSchoolName.trim()) {
      setError("Add your school name before continuing.");
      return;
    }
    startTransition(async () => {
      setError(null);
      const res = await fetch("/api/schools/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSchoolName.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message ?? "Unable to create a school right now.");
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-xl">Join an existing school</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school-select" className="text-sm text-muted-foreground">
              Select your school
            </Label>
            <select
              id="school-select"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[hsl(var(--accent))] focus:outline-none"
              value={selectedSchoolId}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setSelectedSchoolId(event.target.value)
              }
              disabled={isPending}
            >
              {schools.length === 0 && <option value="">No schools available yet</option>}
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleJoinExisting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={isPending || schools.length === 0}
          >
            {isPending ? "Joining..." : "Join School"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-xl">Or create a new school</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school-name" className="text-sm text-muted-foreground">
              School name
            </Label>
            <Input
              id="school-name"
              value={newSchoolName}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewSchoolName(event.target.value)
              }
              placeholder="e.g. Central High School"
              disabled={isPending}
            />
          </div>
          <Button
            onClick={handleCreateSchool}
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create & Join"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
