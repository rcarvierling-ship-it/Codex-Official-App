"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";

type ScoreVerificationCardProps = {
  eventId: string;
  teamHomeName: string;
  teamAwayName: string;
  homeScore: string | null;
  awayScore: string | null;
  status: string;
  isVerified: boolean;
  isLocked: boolean;
  verifiedAt: string | null;
  recordedAt: string | null;
  onVerify?: () => void;
  onLock?: () => void;
  onUnlock?: () => void;
  canVerify?: boolean; // Coach can verify
  canLock?: boolean; // League admin can lock
};

export function ScoreVerificationCard({
  eventId,
  teamHomeName,
  teamAwayName,
  homeScore,
  awayScore,
  status,
  isVerified,
  isLocked,
  verifiedAt,
  recordedAt,
  onVerify,
  onLock,
  onUnlock,
  canVerify = false,
  canLock = false,
}: ScoreVerificationCardProps) {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch("/api/game-results/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to verify score");
      }

      toast({
        title: "Score Verified",
        description: "The game score has been verified.",
      });

      if (onVerify) {
        onVerify();
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLock = async () => {
    setIsLocking(true);
    try {
      const response = await fetch("/api/game-results/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "lock" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to lock score");
      }

      toast({
        title: "Score Finalized",
        description: "The game score has been locked and finalized.",
      });

      if (onLock) {
        onLock();
      }
    } catch (error: any) {
      toast({
        title: "Lock Failed",
        description: error.message || "Failed to lock score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlock = async () => {
    setIsLocking(true);
    try {
      const response = await fetch("/api/game-results/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "unlock" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to unlock score");
      }

      toast({
        title: "Score Unlocked",
        description: "The game score has been unlocked and can be modified.",
      });

      if (onUnlock) {
        onUnlock();
      }
    } catch (error: any) {
      toast({
        title: "Unlock Failed",
        description: error.message || "Failed to unlock score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLocking(false);
    }
  };

  if (status !== "COMPLETED" || !homeScore || !awayScore) {
    return null; // Only show for completed games with scores
  }

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Score Verification</CardTitle>
          <div className="flex gap-2">
            {isLocked && (
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <Lock className="mr-1 h-3 w-3" />
                Finalized
              </Badge>
            )}
            {isVerified && !isLocked && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
            {!isVerified && !isLocked && (
              <Badge variant="outline" className="text-amber-500 border-amber-500/40">
                Pending Verification
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-background/60 p-4 text-center">
          <p className="text-2xl font-bold">
            {teamHomeName} {homeScore} - {awayScore} {teamAwayName}
          </p>
          {parseInt(homeScore) > parseInt(awayScore) ? (
            <p className="text-sm text-muted-foreground mt-2">
              Winner: <span className="font-semibold">{teamHomeName}</span>
            </p>
          ) : parseInt(awayScore) > parseInt(homeScore) ? (
            <p className="text-sm text-muted-foreground mt-2">
              Winner: <span className="font-semibold">{teamAwayName}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Tie Game</p>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {recordedAt && (
            <p>Submitted: {format(new Date(recordedAt), "MMM d, yyyy 'at' h:mm a")}</p>
          )}
          {verifiedAt && (
            <p>Verified: {format(new Date(verifiedAt), "MMM d, yyyy 'at' h:mm a")}</p>
          )}
        </div>

        <div className="flex gap-2">
          {canVerify && !isVerified && !isLocked && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isVerifying ? "Verifying..." : "Verify Score"}
              </Button>
            </motion.div>
          )}
          {canLock && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              {isLocked ? (
                <Button
                  type="button"
                  onClick={handleUnlock}
                  disabled={isLocking}
                  variant="outline"
                  className="w-full"
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  {isLocking ? "Unlocking..." : "Unlock Score"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleLock}
                  disabled={isLocking || !isVerified}
                  className="w-full"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {isLocking ? "Locking..." : "Finalize Score"}
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

