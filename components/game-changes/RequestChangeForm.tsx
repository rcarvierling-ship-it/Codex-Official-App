"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, MapPin, Users, X, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

type ChangeType = "TIME" | "LOCATION" | "OPPONENT" | "CANCELLATION" | "POSTPONEMENT";

type Event = {
  id: string;
  name: string;
  startsAt: string;
  endsAt?: string | null;
  venueId?: string | null;
};

type RequestChangeFormProps = {
  event: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const changeTypeLabels: Record<ChangeType, string> = {
  TIME: "Time Change",
  LOCATION: "Location Change",
  OPPONENT: "Opponent Swap",
  CANCELLATION: "Cancellation",
  POSTPONEMENT: "Postponement",
};

const changeTypeIcons: Record<ChangeType, any> = {
  TIME: Clock,
  LOCATION: MapPin,
  OPPONENT: Users,
  CANCELLATION: X,
  POSTPONEMENT: Calendar,
};

export function RequestChangeForm({ event, onSuccess, onCancel }: RequestChangeFormProps) {
  const { toast } = useToast();
  const [changeType, setChangeType] = useState<ChangeType | "">("");
  const [requestedValue, setRequestedValue] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentValue = (): string => {
    switch (changeType) {
      case "TIME":
        return `${format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}${
          event.endsAt ? ` - ${format(new Date(event.endsAt), "h:mm a")}` : ""
        }`;
      case "LOCATION":
        return "Current venue (TBD)";
      case "OPPONENT":
        return "Current opponent (TBD)";
      case "CANCELLATION":
      case "POSTPONEMENT":
        return event.name;
      default:
        return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!changeType) {
      toast({
        title: "Change Type Required",
        description: "Please select a type of change.",
        variant: "destructive",
      });
      return;
    }

    if ((changeType === "TIME" || changeType === "LOCATION" || changeType === "OPPONENT") && !requestedValue.trim()) {
      toast({
        title: "Requested Value Required",
        description: "Please provide the requested change value.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/game-change-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          changeType,
          currentValue: getCurrentValue(),
          requestedValue: requestedValue.trim() || null,
          reason: reason.trim() || null,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to submit change request");
      }

      toast({
        title: "Request Submitted",
        description: "Your change request has been sent to the Athletic Director for approval.",
      });

      setChangeType("");
      setRequestedValue("");
      setReason("");
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error?.message || "Could not submit change request.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="change-type">Type of Change</Label>
        <Select
          value={changeType}
          onValueChange={(value: string) => setChangeType(value as ChangeType)}
        >
          <SelectTrigger id="change-type">
            <SelectValue placeholder="Select change type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TIME">Time Change</SelectItem>
            <SelectItem value="LOCATION">Location Change</SelectItem>
            <SelectItem value="OPPONENT">Opponent Swap</SelectItem>
            <SelectItem value="POSTPONEMENT">Postponement</SelectItem>
            <SelectItem value="CANCELLATION">Cancellation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {changeType && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4"
        >
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Current:</p>
            <p className="text-sm text-foreground">{getCurrentValue()}</p>
          </div>

          {(changeType === "TIME" || changeType === "LOCATION" || changeType === "OPPONENT") && (
            <div className="space-y-2">
              <Label htmlFor="requested-value">
                Requested {changeType === "TIME" ? "Date & Time" : changeType === "LOCATION" ? "Location" : "Opponent"}
              </Label>
              {changeType === "TIME" ? (
                <Input
                  id="requested-value"
                  type="datetime-local"
                  value={requestedValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedValue(e.target.value)}
                  required
                />
              ) : (
                <Input
                  id="requested-value"
                  value={requestedValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestedValue(e.target.value)}
                  placeholder={
                    changeType === "LOCATION"
                      ? "e.g., Main Gym, Field 2"
                      : "e.g., Central High School"
                  }
                  required
                />
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              placeholder="Explain why this change is needed..."
              rows={3}
            />
          </div>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </motion.form>
  );
}

