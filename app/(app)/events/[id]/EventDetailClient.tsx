"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { RequestChangeForm } from "@/components/game-changes/RequestChangeForm";
import { ChangeRequestCard } from "@/components/game-changes/ChangeRequestCard";
import { ScoreSubmissionForm } from "@/components/score-reporting/ScoreSubmissionForm";
import { ScoreVerificationCard } from "@/components/score-reporting/ScoreVerificationCard";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  name: string;
  startsAt: string;
  endsAt?: string | null;
  venueId?: string | null;
};

type Request = {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  submittedAt: string;
  message?: string | null;
};

type Assignment = {
  id: string;
  eventId: string;
  userId: string;
  role: string;
  status: string;
  createdAt: string;
};

type ChangeRequest = {
  id: string;
  eventId: string;
  changeType: string;
  currentValue: string | null;
  requestedValue: string | null;
  reason: string | null;
  status: string;
  createdAt: string;
  event?: {
    id: string;
    name: string;
    startsAt: string;
  } | null;
  requester?: {
    name: string;
    email: string;
  } | null;
};

type GameResult = {
  id: string;
  eventId: string;
  teamHomeId: string;
  teamAwayId: string;
  homeScore: string | null;
  awayScore: string | null;
  status: string;
  recordedBy: string | null;
  recordedAt: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  isLocked: boolean;
  lockedBy: string | null;
  lockedAt: string | null;
} | null;

type EventDetailClientProps = {
  event: Event;
  requests: Request[];
  assignments: Assignment[];
  userMap: Map<string, { name: string; email: string }>;
  currentUserId: string;
  currentUserRole: string;
  changeRequests: ChangeRequest[];
  gameResult?: GameResult;
  teamHomeId?: string | null;
  teamAwayId?: string | null;
  teamHomeName?: string;
  teamAwayName?: string;
};

export function EventDetailClient({
  event,
  requests,
  assignments,
  userMap,
  currentUserId,
  currentUserRole,
  changeRequests,
  gameResult,
  teamHomeId,
  teamAwayId,
  teamHomeName = "Home Team",
  teamAwayName = "Away Team",
}: EventDetailClientProps) {
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const isCoach = currentUserRole === "COACH";
  const isOfficial = currentUserRole === "OFFICIAL";
  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN";
  const myChangeRequests = changeRequests.filter((cr) => cr.requester?.email === userMap.get(currentUserId)?.email);

  const handleScoreUpdate = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{event.name}</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
          {event.endsAt && ` - ${format(new Date(event.endsAt), "h:mm a")}`}
        </p>
      </header>

      {/* Score Reporting Section */}
      {teamHomeId && teamAwayId && (
        <div className="space-y-4">
          {/* Official Score Submission */}
          {isOfficial && (
            <ScoreSubmissionForm
              eventId={event.id}
              teamHomeId={teamHomeId}
              teamAwayId={teamAwayId}
              teamHomeName={teamHomeName}
              teamAwayName={teamAwayName}
              eventDate={event.startsAt}
              existingResult={gameResult ? {
                homeScore: gameResult.homeScore,
                awayScore: gameResult.awayScore,
                status: gameResult.status,
                isLocked: gameResult.isLocked,
                verifiedBy: gameResult.verifiedBy,
              } : null}
              onSuccess={handleScoreUpdate}
            />
          )}

          {/* Coach Verification & Admin Lock */}
          {gameResult && gameResult.status === "COMPLETED" && gameResult.homeScore && gameResult.awayScore && (
            <ScoreVerificationCard
              eventId={event.id}
              teamHomeName={teamHomeName}
              teamAwayName={teamAwayName}
              homeScore={gameResult.homeScore}
              awayScore={gameResult.awayScore}
              status={gameResult.status}
              isVerified={!!gameResult.verifiedBy}
              isLocked={gameResult.isLocked}
              verifiedAt={gameResult.verifiedAt}
              recordedAt={gameResult.recordedAt}
              canVerify={isCoach}
              canLock={isAdmin}
              onVerify={handleScoreUpdate}
              onLock={handleScoreUpdate}
              onUnlock={handleScoreUpdate}
            />
          )}
        </div>
      )}

      {/* Game Change Requests Section - For Coaches */}
      {isCoach && (
        <Card className="bg-card/80">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Game Change Requests</CardTitle>
            {!showChangeForm && (
              <Button
                size="sm"
                onClick={() => setShowChangeForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Request Change
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {showChangeForm ? (
              <RequestChangeForm
                event={event}
                onSuccess={() => {
                  setShowChangeForm(false);
                  setRefreshKey((k) => k + 1);
                  window.location.reload();
                }}
                onCancel={() => setShowChangeForm(false)}
              />
            ) : (
              <>
                {myChangeRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No change requests submitted. Click "Request Change" to submit one.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myChangeRequests.map((cr) => (
                      <ChangeRequestCard
                        key={cr.id}
                        request={cr}
                        onStatusChange={() => {
                          setRefreshKey((k) => k + 1);
                          window.location.reload();
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Official Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests for this event.</p>
            ) : (
              requests.map((request) => {
                const user = userMap.get(request.userId);
                return (
                  <div key={request.id} className="rounded-lg border bg-background/60 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(request.submittedAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === "APPROVED"
                            ? "default"
                            : request.status === "DECLINED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {request.status}
                      </Badge>
                    </div>
                    {request.message && (
                      <p className="text-xs text-muted-foreground mt-2">{request.message}</p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle className="text-lg">Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assignments for this event.</p>
            ) : (
              assignments.map((assignment) => {
                const user = userMap.get(assignment.userId);
                return (
                  <div key={assignment.id} className="rounded-lg border bg-background/60 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{user?.name ?? "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{assignment.role}</p>
                      </div>
                      <Badge
                        variant={
                          assignment.status === "COMPLETED"
                            ? "default"
                            : assignment.status === "CANCELLED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confirmed: {format(new Date(assignment.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

