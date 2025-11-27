import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-0 shadow-xl max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <SettingsIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Settings Coming Soon
            </h3>
            <p className="text-slate-600">
              App settings and preferences will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  ); */
}