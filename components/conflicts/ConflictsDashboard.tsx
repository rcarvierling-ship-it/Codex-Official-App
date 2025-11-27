"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ConflictAlert } from "./ConflictAlert";
import type { Conflict } from "@/lib/repos/conflicts";

export function ConflictsDashboard() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchConflicts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/conflicts/all");
      if (!response.ok) {
        throw new Error("Failed to fetch conflicts");
      }
      const data = await response.json();
      setConflicts(data.conflicts || []);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Failed to fetch conflicts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, []);

  const errors = conflicts.filter((c) => c.severity === "ERROR");
  const warnings = conflicts.filter((c) => c.severity === "WARNING");

  const conflictTypes = {
    VENUE_DOUBLE_BOOK: conflicts.filter((c) => c.type === "VENUE_DOUBLE_BOOK").length,
    COACH_DOUBLE_BOOK: conflicts.filter((c) => c.type === "COACH_DOUBLE_BOOK").length,
    REFEREE_TOO_CLOSE: conflicts.filter((c) => c.type === "REFEREE_TOO_CLOSE").length,
    TEAM_BACK_TO_BACK: conflicts.filter((c) => c.type === "TEAM_BACK_TO_BACK").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Scheduling Conflicts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-detected conflicts in your schedule
          </p>
        </div>
        <Button
          onClick={fetchConflicts}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {lastRefreshed && (
        <p className="text-xs text-muted-foreground">
          Last refreshed: {lastRefreshed.toLocaleString()}
        </p>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Critical Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-500">{errors.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-amber-500">{warnings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">May need adjustment</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Conflicts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{conflicts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All detected conflicts</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Conflict Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Venue:</span>
                <Badge variant="outline">{conflictTypes.VENUE_DOUBLE_BOOK}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Coach:</span>
                <Badge variant="outline">{conflictTypes.COACH_DOUBLE_BOOK}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Referee:</span>
                <Badge variant="outline">{conflictTypes.REFEREE_TOO_CLOSE}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Team:</span>
                <Badge variant="outline">{conflictTypes.TEAM_BACK_TO_BACK}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts List */}
      {isLoading ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin inline-block mb-2" />
            <p>Loading conflicts...</p>
          </CardContent>
        </Card>
      ) : conflicts.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            <p className="text-green-500 font-medium mb-1">✓ No conflicts detected</p>
            <p>Your schedule is conflict-free!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Conflicts</h3>
          <ConflictAlert conflicts={conflicts} />
        </div>
      )}
    </div>
  );
}

