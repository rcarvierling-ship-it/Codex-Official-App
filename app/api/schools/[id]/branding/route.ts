import { NextResponse } from "next/server";
import { getSessionServer } from "@/lib/auth";
import { requireAuth, getAuthRole } from "@/lib/auth-helpers";
import { updateSchoolBranding, getSchoolById } from "@/lib/repos/schools";
import { revalidatePath } from "next/cache";
import type { SessionUser } from "@/lib/types/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const role = await getAuthRole();
    const user = session.user as SessionUser;
    
    // Only AD, ADMIN, or SUPER_ADMIN can update branding
    if (role !== "athletic_director" && role !== "league_admin") {
      return NextResponse.json(
        { message: "Unauthorized. Only school administrators can update branding." },
        { status: 403 }
      );
    }

    // Verify user has access to this school
    const school = await getSchoolById(params.id);
    if (!school) {
      return NextResponse.json(
        { message: "School not found." },
        { status: 404 }
      );
    }

    // Check if user has access to this school (unless SUPER_ADMIN/ADMIN)
    if (role !== "league_admin") {
      const accessibleSchools = user?.accessibleSchools ?? [];
      if (!accessibleSchools.includes(params.id)) {
        return NextResponse.json(
          { message: "Unauthorized. You don't have access to this school." },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { primaryColor, secondaryColor, logoUrl, mascotName, mascotImageUrl, themeJson } = body;

    await updateSchoolBranding(params.id, {
      primaryColor: primaryColor || null,
      secondaryColor: secondaryColor || null,
      logoUrl: logoUrl || null,
      mascotName: mascotName || null,
      mascotImageUrl: mascotImageUrl || null,
      themeJson: themeJson || null,
    });

    revalidatePath(`/admin/schools/${params.id}`);
    revalidatePath("/dashboard");
    revalidatePath("/admin/schools");

    return NextResponse.json({ message: "School branding updated successfully." });
  } catch (error: any) {
    console.error("[api/schools/branding] PATCH error:", error);
    return NextResponse.json(
      { message: error?.message || "Failed to update school branding." },
      { status: 500 }
    );
  }
}

