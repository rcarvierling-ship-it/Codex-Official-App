"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, MapPin, Users, X, Calendar, Check, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

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

type ChangeRequestCardProps = {
  request: ChangeRequest;
  onStatusChange?: () => void;
  showActions?: boolean;
};

const changeTypeIcons: Record<string, any> = {
  TIME: Clock,
  LOCATION: MapPin,
  OPPONENT: Users,
  CANCELLATION: X,
  POSTPONEMENT: Calendar,
};

const changeTypeLabels: Record<string, string> = {
  TIME: "Time Change",
  LOCATION: "Location Change",
  OPPONENT: "Opponent Swap",
  CANCELLATION: "Cancellation",
  POSTPONEMENT: "Postponement",
};

export function ChangeRequestCard({
  request,
  onStatusChange,
  showActions = false,
}: ChangeRequestCardProps) {
  const { toast } = useToast();
  const Icon = changeTypeIcons[request.changeType] || Clock;

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/game-change-requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to approve request");
      }

      toast({
        title: "Request Approved",
        description: "The change request has been approved.",
      });

      onStatusChange?.();
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error?.message || "Could not approve request.",
        variant: "destructive",
      });
    }
  };

  const handleDeny = async () => {
    try {
      const response = await fetch(`/api/game-change-requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DENIED" }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to deny request");
      }

      toast({
        title: "Request Denied",
        description: "The change request has been denied.",
      });

      onStatusChange?.();
    } catch (error: any) {
      toast({
        title: "Denial Failed",
        description: error?.message || "Could not deny request.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
              <CardTitle className="text-lg">
                {changeTypeLabels[request.changeType] || request.changeType}
              </CardTitle>
            </div>
            <Badge
              variant={
                request.status === "APPROVED"
                  ? "default"
                  : request.status === "DENIED"
                  ? "destructive"
                  : "outline"
              }
            >
              {request.status}
            </Badge>
          </div>
          {request.event && (
            <p className="text-sm text-muted-foreground">
              {request.event.name} · {format(new Date(request.event.startsAt), "MMM d, yyyy")}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {request.currentValue && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Current:</p>
              <p className="text-sm text-foreground">{request.currentValue}</p>
            </div>
          )}
          {request.requestedValue && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Requested:</p>
              <p className="text-sm text-foreground font-medium">{request.requestedValue}</p>
            </div>
          )}
          {request.reason && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Reason:</p>
              <p className="text-sm text-muted-foreground">{request.reason}</p>
            </div>
          )}
          {request.requester && (
            <p className="text-xs text-muted-foreground">
              Requested by {request.requester.name} ·{" "}
              {format(new Date(request.createdAt), "MMM d, h:mm a")}
            </p>
          )}
          {showActions && request.status === "PENDING" && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleApprove}
                className="flex-1 gap-2"
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeny}
                className="flex-1 gap-2"
              >
                <XCircle className="h-4 w-4" />
                Deny
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

