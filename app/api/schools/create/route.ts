import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { assignUserToSchool, createSchool } from "@/lib/repos/schools";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await getSessionServer();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, leagueId } = await request.json().catch(() => ({}));
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName) {
      return NextResponse.json({ message: "Provide a school name to continue." }, { status: 400 });
    }

    const school = await createSchool(trimmedName, typeof leagueId === "string" ? leagueId : null);
    if (!school) {
      return NextResponse.json(
        { message: "Unable to create a school at this time." },
        { status: 500 },
      );
    }

    await assignUserToSchool(session.user.email, school.id);

    return NextResponse.json({ ok: true, school });
  } catch (error) {
    console.error("[api/schools/create] failed", error);
    return NextResponse.json(
      { message: "Unable to create a school right now." },
      { status: 500 },
    );
  }
}
