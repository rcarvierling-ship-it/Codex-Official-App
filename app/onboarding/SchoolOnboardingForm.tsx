"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { School } from "@/lib/repos/schools";
import { Loader2 } from "lucide-react";
import { completeOnboardingJoinSchool, completeOnboardingCreateSchool } from "./actions";
import { getRoleDashboardPath } from "@/lib/onboarding-redirect";

type Props = {
  schools: School[];
};

const ROLES = [
  { value: "fan", label: "Fan" },
  { value: "coach", label: "Coach" },
  { value: "official", label: "Official" },
  { value: "athletic_director", label: "Athletic Director" },
  { value: "school_admin", label: "School Administrator" },
  { value: "league_admin", label: "League Administrator" },
] as const;

export function SchoolOnboardingForm({ schools }: Props) {
  const router = useRouter();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id ?? "");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("fan");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinExisting = async () => {
    if (!selectedSchoolId) {
      setError("Choose a school to continue.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Use server action to complete onboarding
      const result = await completeOnboardingJoinSchool(selectedSchoolId, selectedRole);
      
      if (!result.success) {
        setError(result.error || "Failed to complete onboarding. Please try again.");
        setIsLoading(false);
        return;
      }

      // Force a full page reload to refresh the session
      // This ensures the onboarding_completed status is reflected in the session
      if (result.redirectPath) {
        window.location.href = result.redirectPath;
      } else {
        // Fallback to role-based redirect
        const redirectPath = getRoleDashboardPath(result.user?.role || selectedRole);
        window.location.href = redirectPath;
      }
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
      // Use server action to complete onboarding
      const result = await completeOnboardingCreateSchool(newSchoolName.trim(), selectedRole);
      
      if (!result.success) {
        setError(result.error || "Failed to complete onboarding. Please try again.");
        setIsLoading(false);
        return;
      }

      // Force a full page reload to refresh the session
      // This ensures the onboarding_completed status is reflected in the session
      if (result.redirectPath) {
        window.location.href = result.redirectPath;
      } else {
        // Fallback to role-based redirect
        const redirectPath = getRoleDashboardPath(result.user?.role || selectedRole);
        window.location.href = redirectPath;
      }
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
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join School"
            )}
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
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create & Join"
            )}
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
