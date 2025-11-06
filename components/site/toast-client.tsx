'use client';

import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    __X_TOAST__?: string;
  }
}

export function ToastClient() {
  const { toast } = useToast();

  useEffect(() => {
    const value = window.__X_TOAST__;
    if (!value) return;
    window.__X_TOAST__ = undefined;

    if (value === "unauthorized") {
      toast({
        title: "You don’t have access to that page.",
        description: "Switch roles or contact an administrator to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notice",
      description: value,
    });
  }, [toast]);

  return null;
}
