"use server";

import { updateRequestStatus as updateStatus } from "@/lib/repos/requests";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(id: string, status: "APPROVED" | "DECLINED") {
  await updateStatus(id, status);
  revalidatePath("/approvals");
  revalidatePath("/requests");
}

