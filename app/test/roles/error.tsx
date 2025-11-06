"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <pre className="mt-2 overflow-auto rounded bg-muted p-3 text-xs">{error.message}</pre>
    </div>
  );
}

