"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle, MapPin, Users, User, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Conflict } from "@/lib/repos/conflicts";

type ConflictAlertProps = {
  conflicts: Conflict[];
  onDismiss?: (conflictIndex: number) => void;
};

const conflictIcons = {
  VENUE_DOUBLE_BOOK: MapPin,
  COACH_DOUBLE_BOOK: Users,
  REFEREE_TOO_CLOSE: User,
  TEAM_BACK_TO_BACK: Calendar,
};

const conflictLabels = {
  VENUE_DOUBLE_BOOK: "Venue Conflict",
  COACH_DOUBLE_BOOK: "Coach Conflict",
  REFEREE_TOO_CLOSE: "Referee Conflict",
  TEAM_BACK_TO_BACK: "Team Conflict",
};

export function ConflictAlert({ conflicts, onDismiss }: ConflictAlertProps) {
  if (conflicts.length === 0) {
    return null;
  }

  const errors = conflicts.filter((c) => c.severity === "ERROR");
  const warnings = conflicts.filter((c) => c.severity === "WARNING");

  return (
    <div className="space-y-3">
      {errors.map((conflict, index) => {
        const Icon = conflictIcons[conflict.type] || AlertTriangle;
        return (
          <motion.div
            key={`${conflict.type}-${conflict.eventId2}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <XCircle className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {conflictLabels[conflict.type]}
                <Badge variant="destructive" className="text-xs">
                  Error
                </Badge>
              </AlertTitle>
              <AlertDescription className="space-y-2 mt-2">
                <p className="font-medium">{conflict.message}</p>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>
                    <span className="font-medium">Conflicting Event:</span> {conflict.event2Name}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {format(new Date(conflict.event2Start), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {conflict.details && (
                    <div className="mt-2 pt-2 border-t border-red-500/20">
                      {Object.entries(conflict.details).map(([key, value]) => (
                        <p key={key}>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>{" "}
                          {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        );
      })}

      {warnings.map((conflict, index) => {
        const Icon = conflictIcons[conflict.type] || AlertTriangle;
        return (
          <motion.div
            key={`${conflict.type}-${conflict.eventId2}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (errors.length + index) * 0.1 }}
          >
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {conflictLabels[conflict.type]}
                <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-500">
                  Warning
                </Badge>
              </AlertTitle>
              <AlertDescription className="space-y-2 mt-2">
                <p className="font-medium">{conflict.message}</p>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>
                    <span className="font-medium">Conflicting Event:</span> {conflict.event2Name}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {format(new Date(conflict.event2Start), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {conflict.details && (
                    <div className="mt-2 pt-2 border-t border-amber-500/20">
                      {Object.entries(conflict.details).map(([key, value]) => (
                        <p key={key}>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>{" "}
                          {String(value)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        );
      })}
    </div>
  );
}

