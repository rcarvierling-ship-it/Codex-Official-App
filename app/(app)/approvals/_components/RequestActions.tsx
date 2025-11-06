"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateRequestStatus } from "./actions";

export function ApproveRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  return (
    <Button
      className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
      onClick={async () => {
        await updateRequestStatus(requestId, "APPROVED");
        router.refresh();
      }}
    >
      Approve
    </Button>
  );
}

export function DeclineRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="border-red-500/40 text-red-300 hover:bg-red-500/10"
      onClick={async () => {
        await updateRequestStatus(requestId, "DECLINED");
        router.refresh();
      }}
    >
      Decline
    </Button>
  );
}

