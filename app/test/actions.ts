"use server";

import { revalidatePath } from "next/cache";
import { createEvent } from "@/lib/repos/events";
import { updateRequestStatus } from "@/lib/repos/requests";
import { createUser } from "@/lib/repos/users";
import { createAssignment, updateAssignmentStatus } from "@/lib/repos/assignments";

export async function actionCreateEvent(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const schoolId = String(formData.get("schoolId") ?? "");
  const startsAt = String(formData.get("startsAt") ?? new Date().toISOString());
  await createEvent(name, schoolId, startsAt);
  revalidatePath("/test");
}

export async function actionUpdateRequestStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("status") ?? "PENDING").toUpperCase() as "PENDING"|"APPROVED"|"DECLINED";
  await updateRequestStatus(id, next);
  revalidatePath("/test");
}

export async function actionCreateUser(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const role = String(formData.get("role") ?? "");
  await createUser(name, email, role || null);
  revalidatePath("/test");
}

export async function actionCreateAssignment(formData: FormData) {
  const eventId = String(formData.get("eventId") ?? "");
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "OFFICIAL");
  await createAssignment(eventId, userId, role);
  revalidatePath("/test");
}

export async function actionUpdateAssignmentStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "ASSIGNED").toUpperCase() as "ASSIGNED"|"COMPLETED"|"CANCELLED";
  await updateAssignmentStatus(id, status);
  revalidatePath("/test");
}
