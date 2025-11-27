"use client";

import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

type ScoreSubmissionFormProps = {
  eventId: string;
  teamHomeId: string;
  teamAwayId: string;
  teamHomeName: string;
  teamAwayName: string;
  eventDate: string;
  existingResult?: {
    homeScore: string | null;
    awayScore: string | null;
    status: string;
    isLocked: boolean;
    verifiedBy: string | null;
  } | null;
  onSuccess?: () => void;
};

export function ScoreSubmissionForm({
  eventId,
  teamHomeId,
  teamAwayId,
  teamHomeName,
  teamAwayName,
  eventDate,
  existingResult,
  onSuccess,
}: ScoreSubmissionFormProps) {
  const [homeScore, setHomeScore] = useState(existingResult?.homeScore || "");
  const [awayScore, setAwayScore] = useState(existingResult?.awayScore || "");
  const [status, setStatus] = useState(existingResult?.status || "COMPLETED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (status === "COMPLETED" && (!homeScore || !awayScore)) {
      toast({
        title: "Missing Scores",
        description: "Please enter scores for both teams when marking as completed.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/game-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          teamHomeId,
          teamAwayId,
          homeScore: homeScore || null,
          awayScore: awayScore || null,
          status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit score");
      }

      toast({
        title: "Score Submitted",
        description: "The game score has been submitted and is awaiting coach verification.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = existingResult?.isLocked;
  const isVerified = !!existingResult?.verifiedBy;

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Submit Game Score</CardTitle>
          {isLocked && (
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              Finalized
            </Badge>
          )}
          {isVerified && !isLocked && (
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
              Verified
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Game Date: {format(new Date(eventDate), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLocked ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            This score has been finalized and cannot be modified.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="home-score">Home: {teamHomeName}</Label>
                <Input
                  id="home-score"
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setHomeScore(e.target.value)}
                  placeholder="0"
                  disabled={isSubmitting || status !== "COMPLETED"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="away-score">Away: {teamAwayName}</Label>
                <Input
                  id="away-score"
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAwayScore(e.target.value)}
                  placeholder="0"
                  disabled={isSubmitting || status !== "COMPLETED"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Game Status</Label>
              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant={status === "COMPLETED" ? "default" : "outline"}
                    onClick={() => setStatus("COMPLETED")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Completed
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant={status === "CANCELLED" ? "default" : "outline"}
                    onClick={() => setStatus("CANCELLED")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelled
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant={status === "POSTPONED" ? "default" : "outline"}
                    onClick={() => setStatus("POSTPONED")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Postponed
                  </Button>
                </motion.div>
              </div>
            </div>

            {status === "COMPLETED" && homeScore && awayScore && (
              <div className="rounded-lg border bg-background/60 p-3 text-center">
                <p className="text-sm font-medium">
                  {teamHomeName} {homeScore} - {awayScore} {teamAwayName}
                </p>
                {parseInt(homeScore) > parseInt(awayScore) ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Winner: {teamHomeName}
                  </p>
                ) : parseInt(awayScore) > parseInt(homeScore) ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Winner: {teamAwayName}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Tie Game</p>
                )}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : existingResult ? "Update Score" : "Submit Score"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

