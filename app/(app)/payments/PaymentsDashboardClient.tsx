"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/animations/AnimatedCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { AnimatedNumber } from "@/components/animations/AnimatedNumber";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Download, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";

type Payment = {
  id: string;
  assignmentId: string;
  userId: string;
  eventId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID" | "CANCELLED";
  approvedBy?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
  user?: { name: string; email: string };
  event?: { name: string; startsAt: string };
  approver?: { name: string; email: string };
};

type PayoutSettings = {
  id: string;
  leagueId?: string | null;
  schoolId?: string | null;
  defaultAmount: number;
  roleBasedAmounts?: Record<string, number>;
  autoApprove: boolean;
  updatedAt: string;
};

type PaymentsDashboardClientProps = {
  role: string;
  currentUserId: string;
  payments: Payment[];
  stats: {
    totalPending: number;
    totalApproved: number;
    totalPaid: number;
    totalOwed: number;
    pendingCount: number;
    approvedCount: number;
    paidCount: number;
  };
  payoutSettings: PayoutSettings | null;
};

export function PaymentsDashboardClient({
  role,
  currentUserId,
  payments,
  stats,
  payoutSettings,
}: PaymentsDashboardClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    defaultAmount: payoutSettings?.defaultAmount || 75,
    autoApprove: payoutSettings?.autoApprove || false,
  });

  const handleApprove = async (paymentId: string) => {
    if (role !== "athletic_director" && role !== "school_admin" && role !== "league_admin") return;

    setIsProcessing(paymentId);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", paymentId }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to approve payment");
      }

      toast({
        title: "Payment Approved",
        description: "The payment has been approved successfully.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to approve payment.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    if (role !== "athletic_director" && role !== "school_admin" && role !== "league_admin") return;

    setIsProcessing(paymentId);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markPaid", paymentId }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to mark payment as paid");
      }

      toast({
        title: "Payment Marked as Paid",
        description: "The payment has been marked as paid successfully.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to mark payment as paid.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/payments/export");
      if (!response.ok) throw new Error("Failed to export");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: "Payments exported to CSV file.",
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error?.message || "Failed to export payments.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    if (role !== "league_admin" && role !== "school_admin") return;

    try {
      const response = await fetch("/api/payout-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultAmount: settingsForm.defaultAmount,
          autoApprove: settingsForm.autoApprove,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || "Failed to save settings");
      }

      toast({
        title: "Settings Saved",
        description: "Payout settings have been updated successfully.",
      });
      setShowSettings(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  const isOfficial = role === "official";
  const isAD = role === "athletic_director";
  const isAdmin = role === "league_admin" || role === "school_admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isOfficial ? "My Payments" : "Payments Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isOfficial
              ? "View your payment history and what you're owed"
              : isAD
              ? "Approve and manage official payments"
              : "Manage payments and payout settings"}
          </p>
        </div>
        {!isOfficial && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="button" onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </motion.div>
        )}
      </motion.header>

      {/* Stats Cards */}
      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <AnimatedCard>
            <Card className="bg-card/80 border-amber-500/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                  {isOfficial ? "Total Owed" : "Pending Approval"}
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  <AnimatedNumber value={isOfficial ? stats.totalOwed : stats.totalPending} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isOfficial
                    ? "Awaiting payment"
                    : `${stats.pendingCount} payment${stats.pendingCount !== 1 ? "s" : ""}`}
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerItem>

        {!isOfficial && (
          <>
            <StaggerItem>
              <AnimatedCard>
                <Card className="bg-card/80 border-blue-500/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-foreground">
                      <AnimatedNumber value={stats.totalApproved} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.approvedCount} payment{stats.approvedCount !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </StaggerItem>

            <StaggerItem>
              <AnimatedCard>
                <Card className="bg-card/80 border-emerald-500/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">Paid</CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-foreground">
                      <AnimatedNumber value={stats.totalPaid} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.paidCount} payment{stats.paidCount !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </StaggerItem>
          </>
        )}

        {isOfficial && (
          <StaggerItem>
            <AnimatedCard>
              <Card className="bg-card/80 border-emerald-500/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">Total Paid</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground">
                    <AnimatedNumber value={stats.totalPaid} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.paidCount} payment{stats.paidCount !== 1 ? "s" : ""} received
                  </p>
                </CardContent>
              </Card>
            </AnimatedCard>
          </StaggerItem>
        )}
      </StaggerContainer>

      {/* Payout Settings (Admin Only) */}
      {isAdmin && (
        <AnimatedCard>
          <Card className="bg-card/80">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Payout Settings</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure default payment amounts and approval settings
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? "Hide" : "Edit Settings"}
              </Button>
            </CardHeader>
            {showSettings && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultAmount">Default Payment Amount ($)</Label>
                  <Input
                    id="defaultAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settingsForm.defaultAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingsForm({ ...settingsForm, defaultAmount: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoApprove"
                    checked={settingsForm.autoApprove}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingsForm({ ...settingsForm, autoApprove: e.target.checked })
                    }
                    className="rounded border-border"
                  />
                  <Label htmlFor="autoApprove" className="cursor-pointer">
                    Auto-approve payments
                  </Label>
                </div>
                <Button type="button" onClick={handleSaveSettings} className="w-full">
                  Save Settings
                </Button>
              </CardContent>
            )}
          </Card>
        </AnimatedCard>
      )}

      {/* Payments List */}
      <div className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold tracking-tight"
        >
          {isOfficial ? "Payment History" : "All Payments"}
        </motion.h2>
        {payments.length === 0 ? (
          <AnimatedCard delay={0.3}>
            <Card className="bg-card/80">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No payments found.
              </CardContent>
            </Card>
          </AnimatedCard>
        ) : (
          <StaggerContainer className="space-y-3" staggerDelay={0.05}>
            {payments.map((payment) => (
              <StaggerItem key={payment.id}>
                <AnimatedCard>
                  <Card className="bg-card/80">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium text-foreground">
                              {isOfficial ? payment.event?.name : payment.user?.name || "Unknown"}
                            </p>
                            <Badge
                              variant={
                                payment.status === "PAID"
                                  ? "default"
                                  : payment.status === "APPROVED"
                                  ? "secondary"
                                  : payment.status === "PENDING"
                                  ? "outline"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          {!isOfficial && (
                            <p className="text-sm text-muted-foreground">
                              {payment.event?.name} · {payment.user?.email}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {payment.event?.startsAt &&
                              format(new Date(payment.event.startsAt), "MMM d, yyyy")}
                            {payment.approvedAt &&
                              ` · Approved ${format(new Date(payment.approvedAt), "MMM d, yyyy")}`}
                            {payment.paidAt &&
                              ` · Paid ${format(new Date(payment.paidAt), "MMM d, yyyy")}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-foreground">
                              ${payment.amount.toFixed(2)}
                            </p>
                          </div>
                          {isAD || isAdmin ? (
                            <div className="flex gap-2">
                              {payment.status === "PENDING" && (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => handleApprove(payment.id)}
                                  disabled={isProcessing === payment.id}
                                >
                                  {isProcessing === payment.id ? "Processing..." : "Approve"}
                                </Button>
                              )}
                              {payment.status === "APPROVED" && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleMarkPaid(payment.id)}
                                  disabled={isProcessing === payment.id}
                                >
                                  {isProcessing === payment.id ? "Processing..." : "Mark Paid"}
                                </Button>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </motion.div>
  );
}

