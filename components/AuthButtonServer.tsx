import Link from "next/link";
import { getSessionServer } from "@/lib/auth";

export default async function AuthButtonServer() {
  const session = await getSessionServer();
  const email = session?.user?.email;
  const role = (session?.user as any)?.role as string | undefined;
  return (
    <div className="flex items-center gap-3 text-sm">
      {email ? (
        <>
          <span className="text-muted-foreground">{email}{role ? ` • ${role}` : ""}</span>
          <Link href="/logout" className="rounded border px-2 py-1 hover:bg-muted">Sign out</Link>
        </>
      ) : (
        <Link href="/login" className="rounded border px-3 py-1 hover:bg-muted">Sign in</Link>
      )}
    </div>
  );
}


