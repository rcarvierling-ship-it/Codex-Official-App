'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoStore } from "@demo/_state/demoStore";

export default function DemoProfilePage() {
  const activeUserId = useDemoStore((state) => state.activeUserId);
  const users = useDemoStore((state) => state.users);
  const user = users.find((entry) => entry.id === activeUserId) ?? users[0];

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Role:</strong> {user.role}
          </p>
          <p>
            <strong className="text-foreground">Sports:</strong> {user.sports.join(", ")}
          </p>
          <p>
            <strong className="text-foreground">Availability:</strong> {user.availability.join(", ")}
          </p>
          <p>
            This profile is read-only in demo mode. Update personas to preview how permissions shift across roles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
