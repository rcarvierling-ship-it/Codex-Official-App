"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { Plus, Building2, Trophy, X } from "lucide-react";
import { format } from "date-fns";

type UserContext = {
  id: string;
  schoolId: string | null;
  leagueId: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  school?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  league?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type School = {
  id: string;
  name: string;
  slug: string;
  leagueId?: string | null;
};

type League = {
  id: string;
  name: string;
  slug: string;
};

type ContextManagerClientProps = {
  initialContexts: UserContext[];
  schools: School[];
  leagues: League[];
};

const ROLES = [
  { value: "USER", label: "User" },
  { value: "COACH", label: "Coach" },
  { value: "OFFICIAL", label: "Official" },
  { value: "AD", label: "Athletic Director" },
  { value: "ADMIN", label: "Administrator" },
] as const;

const roleLabels: Record<string, string> = {
  USER: "User",
  COACH: "Coach",
  OFFICIAL: "Official",
  AD: "Athletic Director",
  ADMIN: "Administrator",
  SUPER_ADMIN: "Super Admin",
};

export function ContextManagerClient({
  initialContexts,
  schools,
  leagues,
}: ContextManagerClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [contexts, setContexts] = useState<UserContext[]>(initialContexts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContext, setNewContext] = useState({
    schoolId: "",
    leagueId: "",
    role: "USER",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddContext = async () => {
    if (!newContext.schoolId && !newContext.leagueId) {
      toast({
        title: "Selection Required",
        description: "Please select either a school or league.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/add-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: newContext.schoolId || null,
          leagueId: newContext.leagueId || null,
          role: newContext.role,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to add context");
      }

      toast({
        title: "Context Added",
        description: "New role/school combination has been added.",
      });

      setShowAddForm(false);
      setNewContext({ schoolId: "", leagueId: "", role: "USER" });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to add context.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchContext = async (contextId: string) => {
    try {
      const response = await fetch("/api/user/switch-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contextId }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to switch context");
      }

      toast({
        title: "Context Switched",
        description: "Your active role and organization have been updated.",
      });

      // Update local state
      setContexts((prev) =>
        prev.map((c) => ({
          ...c,
          isActive: c.id === contextId,
        }))
      );

      // Force page reload to refresh session
      window.location.href = window.location.pathname;
    } catch (error: any) {
      toast({
        title: "Switch Failed",
        description: error?.message || "Could not switch context.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Manage Roles & Schools</h1>
          <p className="text-sm text-muted-foreground">
            Add and switch between different roles and organizations you work with.
          </p>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Role/Organization
          </Button>
        )}
      </motion.header>

      {/* Add Context Form */}
      {showAddForm && (
        <AnimatedCard>
          <Card className="bg-card/80 border-[hsl(var(--accent)/0.3)]">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">Add New Role & Organization</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAddForm(false);
                  setNewContext({ schoolId: "", leagueId: "", role: "USER" });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="school-select">School (Optional)</Label>
                  <Select
                    value={newContext.schoolId}
                    onValueChange={(value: string) =>
                      setNewContext({ ...newContext, schoolId: value, leagueId: "" })
                    }
                  >
                    <SelectTrigger id="school-select">
                      <SelectValue placeholder="Select a school" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="league-select">League (Optional)</Label>
                  <Select
                    value={newContext.leagueId}
                    onValueChange={(value: string) =>
                      setNewContext({ ...newContext, leagueId: value, schoolId: "" })
                    }
                  >
                    <SelectTrigger id="league-select">
                      <SelectValue placeholder="Select a league" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {leagues.map((league) => (
                        <SelectItem key={league.id} value={league.id}>
                          {league.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-select">Role</Label>
                <Select
                  value={newContext.role}
                  onValueChange={(value: string) => setNewContext({ ...newContext, role: value })}
                >
                  <SelectTrigger id="role-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddContext}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Adding..." : "Add Context"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewContext({ schoolId: "", leagueId: "", role: "USER" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      )}

      {/* Existing Contexts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Roles & Organizations</h2>
        {contexts.length === 0 ? (
          <AnimatedCard>
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No roles or organizations added yet. Add your first one above.
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {contexts.map((context, index) => (
              <motion.div
                key={context.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnimatedCard>
                  <Card
                    className={`bg-card/80 ${
                      context.isActive
                        ? "border-[hsl(var(--accent))] border-2"
                        : "border-border"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {context.school ? (
                            <Building2 className="h-5 w-5 text-[hsl(var(--accent))]" />
                          ) : context.league ? (
                            <Trophy className="h-5 w-5 text-[hsl(var(--accent))]" />
                          ) : (
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          )}
                          {context.school?.name || context.league?.name || "No Organization"}
                        </CardTitle>
                        {context.isActive && (
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {roleLabels[context.role] || context.role}
                        </Badge>
                        {context.school && (
                          <Badge variant="secondary" className="text-xs">
                            School
                          </Badge>
                        )}
                        {context.league && (
                          <Badge variant="secondary" className="text-xs">
                            League
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Added {format(new Date(context.createdAt), "MMM d, yyyy")}
                      </p>
                      {!context.isActive && (
                        <Button
                          size="sm"
                          onClick={() => handleSwitchContext(context.id)}
                          className="w-full"
                        >
                          Switch to This Context
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

