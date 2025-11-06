'use client';

import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

export function ToastListener({ reason }: { reason: string | null }) {
  const { toast } = useToast();

  useEffect(() => {
    if (!reason) return;
    if (reason === "unauthorized") {
      toast({
        title: "You don't have access to that page",
        description: "Switch roles or contact an admin to unlock this section.",
      });
    }
  }, [reason, toast]);

  return null;
}
