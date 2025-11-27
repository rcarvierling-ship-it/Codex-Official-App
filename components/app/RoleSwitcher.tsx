"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, Building2, Users, Trophy, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type UserContext = {
  id: string;
  schoolId: string | null;
  leagueId: string | null;
  role: string;
  isActive: boolean;
  school?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  league?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type RoleSwitcherProps = {
  contexts: UserContext[];
  currentContext: UserContext | null;
};

const roleLabels: Record<string, string> = {
  USER: "User",
  COACH: "Coach",
  OFFICIAL: "Official",
  AD: "Athletic Director",
  ADMIN: "Administrator",
  SUPER_ADMIN: "Super Admin",
};

const roleIcons: Record<string, any> = {
  USER: Users,
  COACH: Users,
  OFFICIAL: Trophy,
  AD: Building2,
  ADMIN: Building2,
  SUPER_ADMIN: Building2,
};

export function RoleSwitcher({ contexts, currentContext }: RoleSwitcherProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (contextId: string) => {
    if (contextId === currentContext?.id) return;

    setIsSwitching(true);
    try {
      const response = await fetch("/api/user/switch-context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contextId }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to switch context");
      }

      toast({
        title: "Context Switched",
        description: "Your view has been updated.",
      });

      // Force a full page reload to refresh session
      window.location.href = window.location.pathname;
    } catch (error: any) {
      toast({
        title: "Switch Failed",
        description: error?.message || "Could not switch context.",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  if (contexts.length <= 1) {
    return null; // Don't show switcher if user only has one context
  }

  const currentLabel = currentContext
    ? `${currentContext.school?.name || currentContext.league?.name || "No Organization"} · ${roleLabels[currentContext.role] || currentContext.role}`
    : "Select Context";

  const CurrentIcon = currentContext
    ? roleIcons[currentContext.role] || Building2
    : Building2;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs sm:text-sm"
            disabled={isSwitching}
          >
            {isSwitching ? (
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <CurrentIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="hidden sm:inline truncate max-w-[150px]">
              {currentLabel}
            </span>
            <span className="sm:hidden">
              {currentContext?.role || "Switch"}
            </span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      {/* @ts-expect-error - JSX components don't have full TS types */}
      <DropdownMenuContent align="end" className="w-64">
        {/* @ts-expect-error - JSX components don't have full TS types */}
        <DropdownMenuLabel>
          Switch Role & Organization
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {contexts.map((context) => {
          const label = context.school?.name || context.league?.name || "No Organization";
          const isCurrent = context.id === currentContext?.id;
          
          // Render icon based on role
          const renderIcon = () => {
            switch (context.role) {
              case "USER":
              case "COACH":
                return <Users className="h-4 w-4 shrink-0" />;
              case "OFFICIAL":
                return <Trophy className="h-4 w-4 shrink-0" />;
              case "AD":
              case "ADMIN":
              case "SUPER_ADMIN":
                return <Building2 className="h-4 w-4 shrink-0" />;
              default:
                return <Building2 className="h-4 w-4 shrink-0" />;
            }
          };

          return (
            /* @ts-expect-error - JSX components don't have full TS types */
            <DropdownMenuItem
              key={context.id}
              onClick={() => handleSwitch(context.id)}
              className="cursor-pointer"
              disabled={isCurrent || isSwitching}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {renderIcon()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {roleLabels[context.role] || context.role}
                    </p>
                  </div>
                </div>
                {isCurrent && (
                  <Badge variant="default" className="text-xs shrink-0">
                    Active
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

