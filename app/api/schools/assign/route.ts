import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { assignUserToSchool, getSchoolById } from "@/lib/repos/schools";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { schoolId } = await request.json().catch(() => ({}));
    if (!schoolId || typeof schoolId !== "string") {
      return NextResponse.json({ message: "Select a school to continue." }, { status: 400 });
    }

    const school = await getSchoolById(schoolId);
    if (!school) {
      return NextResponse.json({ message: "School not found." }, { status: 404 });
    }

    await assignUserToSchool(session.user.email, school.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/schools/assign] failed", error);
    return NextResponse.json(
      { message: "Unable to join the selected school right now." },
      { status: 500 },
    );
  }
}
