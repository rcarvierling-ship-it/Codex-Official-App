import { requireRole } from "@/lib/auth-helpers";
import { ConflictsDashboard } from "@/components/conflicts/ConflictsDashboard";

export const metadata = { title: "Scheduling Conflicts" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ConflictsPage() {
  await requireRole("league_admin");

  return (
    <div className="space-y-6">
      <ConflictsDashboard />
    </div>
  );
}

