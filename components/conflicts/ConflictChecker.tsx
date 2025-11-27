"use client";

import { useState, useEffect } from "react";
import { ConflictAlert } from "./ConflictAlert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { Conflict } from "@/lib/repos/conflicts";

type ConflictCheckerProps = {
  eventId?: string;
  venueId?: string | null;
  teamHomeId?: string | null;
  teamAwayId?: string | null;
  startTime: string;
  endTime?: string | null;
  assignedReferees?: string[];
  coachUserIds?: string[];
  onConflictsChange?: (conflicts: Conflict[]) => void;
};

export function ConflictChecker({
  eventId,
  venueId,
  teamHomeId,
  teamAwayId,
  startTime,
  endTime,
  assignedReferees,
  coachUserIds,
  onConflictsChange,
}: ConflictCheckerProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConflicts = async () => {
    if (!startTime) return;

    setIsChecking(true);
    try {
      const response = await fetch("/api/conflicts/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          venueId,
          teamHomeId,
          teamAwayId,
          startTime,
          endTime,
          assignedReferees: assignedReferees || [],
          coachUserIds: coachUserIds || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check conflicts");
      }

      const data = await response.json();
      setConflicts(data.conflicts || []);
      setLastChecked(new Date());
      
      if (onConflictsChange) {
        onConflictsChange(data.conflicts || []);
      }
    } catch (error) {
      console.error("Failed to check conflicts:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check when relevant fields change
  useEffect(() => {
    if (startTime) {
      const timeoutId = setTimeout(() => {
        checkConflicts();
      }, 500); // Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [eventId, venueId, teamHomeId, teamAwayId, startTime, endTime, assignedReferees?.join(","), coachUserIds?.join(",")]);

  if (conflicts.length === 0 && !isChecking && !lastChecked) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Conflict Detection</h3>
          {lastChecked && (
            <span className="text-xs text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={checkConflicts}
          disabled={isChecking || !startTime}
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Again"
          )}
        </Button>
      </div>

      {isChecking && conflicts.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4">
          <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
          Checking for conflicts...
        </div>
      )}

      <ConflictAlert conflicts={conflicts} />
    </div>
  );
}

