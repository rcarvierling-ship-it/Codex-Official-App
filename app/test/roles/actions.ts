"use server";

import { revalidatePath } from "next/cache";
import { createEvent } from "@/lib/repos/events";
import { createUser } from "@/lib/repos/users";
import { createRequest, updateRequestStatus } from "@/lib/repos/requests";
import { createAssignment, updateAssignmentStatus, acceptAssignment, declineAssignment } from "@/lib/repos/assignments";

export async function actionAdminCreateUser(fd: FormData) {
  await createUser(String(fd.get("name") ?? ""), String(fd.get("email") ?? ""), String(fd.get("role") ?? "") || null);
  revalidatePath("/test/roles/admin");
}

export async function actionAdminCreateEvent(fd: FormData) {
  await createEvent(String(fd.get("name") ?? ""), String(fd.get("schoolId") ?? ""), String(fd.get("startsAt") ?? new Date().toISOString()));
  revalidatePath("/test/roles/admin");
}

export async function actionADApprove(fd: FormData) {
  await updateRequestStatus(String(fd.get("id") ?? ""), "APPROVED");
  revalidatePath("/test/roles/ad");
}

export async function actionADDecline(fd: FormData) {
  await updateRequestStatus(String(fd.get("id") ?? ""), "DECLINED");
  revalidatePath("/test/roles/ad");
}

export async function actionADCreateEvent(fd: FormData) {
  await createEvent(String(fd.get("name") ?? ""), String(fd.get("schoolId") ?? ""), String(fd.get("startsAt") ?? new Date().toISOString()));
  revalidatePath("/test/roles/ad");
}

export async function actionCoachRequest(fd: FormData) {
  await createRequest(String(fd.get("eventId") ?? ""), String(fd.get("userId") ?? ""), String(fd.get("message") ?? "") || null);
  revalidatePath("/test/roles/coach");
}

export async function actionOfficialAccept(fd: FormData) {
  await acceptAssignment(String(fd.get("id") ?? ""));
  revalidatePath("/test/roles/official");
}

export async function actionOfficialDecline(fd: FormData) {
  await declineAssignment(String(fd.get("id") ?? ""));
  revalidatePath("/test/roles/official");
}

export async function actionOfficialComplete(fd: FormData) {
  await updateAssignmentStatus(String(fd.get("id") ?? ""), "COMPLETED");
  revalidatePath("/test/roles/official");
}

