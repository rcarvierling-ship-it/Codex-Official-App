import { requireRole } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Feature Flags" };
export const dynamic = "force-dynamic";

const featureFlags = [
  { id: "new-dashboard", name: "New Dashboard", enabled: true, description: "Enable the redesigned dashboard interface" },
  { id: "advanced-analytics", name: "Advanced Analytics", enabled: false, description: "Show detailed analytics and insights" },
  { id: "mobile-app", name: "Mobile App", enabled: true, description: "Enable mobile app features" },
  { id: "api-v2", name: "API v2", enabled: false, description: "Enable the new API version 2 endpoints" },
  { id: "real-time-updates", name: "Real-time Updates", enabled: true, description: "Enable WebSocket-based real-time updates" },
  { id: "beta-features", name: "Beta Features", enabled: false, description: "Show experimental features to beta users" },
];

export default async function FeatureFlagsPage() {
  await requireRole("SUPER_ADMIN");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Feature Flags</h1>
        <p className="text-sm text-muted-foreground">
          Control feature availability across the platform.
        </p>
      </header>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle>Available Features</CardTitle>
          <CardDescription>Toggle features on or off for all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureFlags.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground">{flag.name}</h3>
                    <Badge
                      variant={flag.enabled ? "default" : "outline"}
                      className="text-xs"
                    >
                      {flag.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  {flag.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

