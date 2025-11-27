"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays, startOfDay, endOfDay, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, X, Plus, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type AvailabilityBlock = {
  id: string;
  officialId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type AvailabilityCalendarProps = {
  officialId: string;
};

export function AvailabilityCalendar({ officialId }: AvailabilityCalendarProps) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AvailabilityBlock | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // Fetch availability blocks
  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const threeMonthsFromNow = addDays(now, 90);
      const response = await fetch(
        `/api/availability?startDate=${now.toISOString()}&endDate=${threeMonthsFromNow.toISOString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch availability");
      const data = await response.json();
      setBlocks(data.blocks || []);
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast({
        title: "Error",
        description: "Failed to load availability blocks.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  // Get blocks for a specific date
  const getBlocksForDate = (date: Date): AvailabilityBlock[] => {
    return blocks.filter((block) => {
      const blockStart = new Date(block.startTime);
      const blockEnd = new Date(block.endTime);
      return (
        isSameDay(blockStart, date) ||
        isSameDay(blockEnd, date) ||
        (blockStart <= date && blockEnd >= date)
      );
    });
  };

  // Get modifiers for calendar
  const getDateModifiers = () => {
    const modifiers: Record<string, Date[]> = {
      available: [],
      unavailable: [],
    };

    blocks.forEach((block) => {
      const start = new Date(block.startTime);
      const end = new Date(block.endTime);
      const days = [];
      let current = startOfDay(start);
      const endDay = endOfDay(end);

      while (current <= endDay) {
        days.push(new Date(current));
        current = addDays(current, 1);
      }

      if (block.isAvailable) {
        modifiers.available.push(...days);
      } else {
        modifiers.unavailable.push(...days);
      }
    });

    return modifiers;
  };

  const handleCreateBlock = async () => {
    if (!selectedDate || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and provide start and end times.",
        variant: "destructive",
      });
      return;
    }

    try {
      const start = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${startTime}`);
      const end = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${endTime}`);

      if (start >= end) {
        toast({
          title: "Invalid Time Range",
          description: "Start time must be before end time.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          isAvailable,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create availability block");
      }

      toast({
        title: "Success",
        description: `Availability block ${isAvailable ? "created" : "marked as unavailable"}.`,
      });

      setIsDialogOpen(false);
      resetForm();
      fetchBlocks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create availability block.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBlock = async () => {
    if (!editingBlock || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please provide start and end times.",
        variant: "destructive",
      });
      return;
    }

    try {
      const start = new Date(`${format(selectedDate || new Date(), "yyyy-MM-dd")}T${startTime}`);
      const end = new Date(`${format(selectedDate || new Date(), "yyyy-MM-dd")}T${endTime}`);

      if (start >= end) {
        toast({
          title: "Invalid Time Range",
          description: "Start time must be before end time.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/availability/${editingBlock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          isAvailable,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update availability block");
      }

      toast({
        title: "Success",
        description: "Availability block updated successfully.",
      });

      setIsDialogOpen(false);
      setEditingBlock(null);
      resetForm();
      fetchBlocks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update availability block.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Are you sure you want to delete this availability block?")) {
      return;
    }

    try {
      const response = await fetch(`/api/availability/${blockId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete availability block");
      }

      toast({
        title: "Success",
        description: "Availability block deleted successfully.",
      });

      fetchBlocks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete availability block.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setStartTime("");
    setEndTime("");
    setIsAvailable(true);
    setNotes("");
    setSelectedDate(new Date());
  };

  const openCreateDialog = () => {
    setEditingBlock(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (block: AvailabilityBlock) => {
    setEditingBlock(block);
    const start = new Date(block.startTime);
    const end = new Date(block.endTime);
    setSelectedDate(start);
    setStartTime(format(start, "HH:mm"));
    setEndTime(format(end, "HH:mm"));
    setIsAvailable(block.isAvailable);
    setNotes(block.notes || "");
    setIsDialogOpen(true);
  };

  const modifiers = getDateModifiers();
  const selectedDateBlocks = selectedDate ? getBlocksForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Availability Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Mark your available and unavailable times to help with assignments.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Availability
            </Button>
          </DialogTrigger>
          {/* @ts-expect-error - DialogContent accepts children but TypeScript types may be incomplete */}
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="">
              {/* @ts-expect-error - DialogTitle accepts children but TypeScript types may be incomplete */}
              <DialogTitle>
                {editingBlock ? "Edit Availability Block" : "Add Availability Block"}
              </DialogTitle>
              {/* @ts-expect-error - DialogDescription accepts children but TypeScript types may be incomplete */}
              <DialogDescription>
                {editingBlock
                  ? "Update your availability or unavailability block."
                  : "Mark a time period as available or unavailable."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  classNames={{}}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={isAvailable ? "default" : "outline"}
                    onClick={() => setIsAvailable(true)}
                    className="flex-1"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Available
                  </Button>
                  <Button
                    type="button"
                    variant={!isAvailable ? "default" : "outline"}
                    onClick={() => setIsAvailable(false)}
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Unavailable
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                  placeholder="e.g., Prefer morning games"
                />
              </div>
            </div>
            {/* @ts-expect-error - DialogFooter accepts children but TypeScript types may be incomplete */}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingBlock ? handleUpdateBlock : handleCreateBlock}>
                {editingBlock ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersClassNames={{
                available: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
                unavailable: "bg-red-500/20 text-red-700 dark:text-red-300",
              }}
              className="rounded-md border"
              classNames={{}}
            />
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-500/20 border border-red-500/40" />
                <span className="text-muted-foreground">Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Blocks for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : selectedDateBlocks.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No availability blocks for this date.
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {selectedDateBlocks.map((block) => {
                    const start = new Date(block.startTime);
                    const end = new Date(block.endTime);
                    return (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between rounded-lg border bg-background/60 p-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={block.isAvailable ? "default" : "destructive"}
                              className={
                                block.isAvailable
                                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                  : "bg-red-500/20 text-red-700 dark:text-red-300"
                              }
                            >
                              {block.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                            <span className="text-sm font-medium">
                              {format(start, "h:mm a")} - {format(end, "h:mm a")}
                            </span>
                          </div>
                          {block.notes && (
                            <p className="mt-1 text-xs text-muted-foreground">{block.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(block)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlock(block.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

