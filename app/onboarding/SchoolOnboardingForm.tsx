"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { School } from "@/lib/repos/schools";

type Props = {
  schools: School[];
};

const ROLES = [
  { value: "USER", label: "User" },
  { value: "COACH", label: "Coach" },
  { value: "OFFICIAL", label: "Official" },
  { value: "AD", label: "Athletic Director" },
  { value: "ADMIN", label: "Administrator" },
] as const;

export function SchoolOnboardingForm({ schools }: Props) {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id ?? "");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("USER");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get the appropriate redirect path based on role
  const getRedirectPath = (role: string): string => {
    // Redirect based on role to appropriate dashboard
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return "/admin";
    }
    if (role === "AD") {
      return "/approvals";
    }
    if (role === "OFFICIAL") {
      return "/assignments";
    }
    // For COACH and USER, go to dashboard
    return "/dashboard";
  };

  const handleJoinExisting = async () => {
    if (!selectedSchoolId) {
      setError("Choose a school to continue.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Always update user role to ensure it's set correctly
      try {
        await fetch("/api/user/update-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        });
      } catch (err) {
        console.error("Failed to update role:", err);
      }

      const res = await fetch("/api/schools/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId: selectedSchoolId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message ?? "Unable to join this school right now.");
        setIsLoading(false);
        return;
      }

      // Force a full page reload to refresh the session from the database
      // This ensures the session includes the newly assigned school
      const redirectPath = getRedirectPath(selectedRole);
      window.location.href = redirectPath;
    } catch (error) {
      console.error("Failed to join school:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) {
      setError("Add your school name before continuing.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Always update user role to ensure it's set correctly
      try {
        await fetch("/api/user/update-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: selectedRole }),
        });
      } catch (err) {
        console.error("Failed to update role:", err);
      }

      const res = await fetch("/api/schools/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSchoolName.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message ?? "Unable to create a school right now.");
        setIsLoading(false);
        return;
      }

      // Force a full page reload to refresh the session from the database
      // This ensures the session includes the newly assigned school
      const redirectPath = getRedirectPath(selectedRole);
      window.location.href = redirectPath;
    } catch (error) {
      console.error("Failed to create school:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-xl">Tell us about yourself</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role-select" className="text-sm text-muted-foreground">
              What is your role?
            </Label>
            <select
              id="role-select"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[hsl(var(--accent))] focus:outline-none"
              value={selectedRole}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setSelectedRole(event.target.value)
              }
              disabled={isLoading}
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

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
              disabled={isLoading}
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
            disabled={isLoading || schools.length === 0}
          >
            {isLoading ? "Joining..." : "Join School"}
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
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleCreateSchool}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create & Join"}
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
