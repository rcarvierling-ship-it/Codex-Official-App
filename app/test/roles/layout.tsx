import React from "react";

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <nav className="flex gap-3 text-sm" aria-label="Role navigation">
        <a className="rounded border px-3 py-1 hover:bg-muted" href="/test">↩ Test Hub</a>
        <a className="rounded border px-3 py-1 hover:bg-muted" href="/test/roles/admin">Admin</a>
        <a className="rounded border px-3 py-1 hover:bg-muted" href="/test/roles/ad">Athletic Director</a>
        <a className="rounded border px-3 py-1 hover:bg-muted" href="/test/roles/coach">Coach</a>
        <a className="rounded border px-3 py-1 hover:bg-muted" href="/test/roles/official">Official</a>
      </nav>
      {children}
    </div>
  );
}
