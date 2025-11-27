import { requireAuth } from "@/lib/auth-helpers";
import { getUserContexts } from "@/lib/repos/user-contexts";
import { listSchools } from "@/lib/repos/schools";
import { sql } from "@/lib/db";
import { ContextManagerClient } from "./ContextManagerClient";

export const metadata = { title: "Manage Roles & Schools" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getLeagues() {
  try {
    const { rows } = await sql<{
      id: string;
      name: string;
      slug: string;
    }>`
      SELECT id, name, slug
      FROM leagues
      ORDER BY name ASC
    `;
    return rows;
  } catch {
    return [];
  }
}

export default async function ContextsPage() {
  const session = await requireAuth({ requireSchool: false });
  const userId = (session.user as any)?.id;

  if (!userId) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Manage Roles & Schools</h1>
        <p className="text-sm text-muted-foreground">
          User ID not found. Please try logging out and back in.
        </p>
      </div>
    );
  }

  const [contexts, schools, leagues] = await Promise.all([
    getUserContexts(userId),
    listSchools(),
    getLeagues(),
  ]);

  return (
    <ContextManagerClient
      initialContexts={contexts}
      schools={schools}
      leagues={leagues}
    />
  );
}

