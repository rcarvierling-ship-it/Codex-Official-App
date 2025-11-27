"use client";

import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Upload, Palette, Image as ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SchoolBranding = {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  mascotName?: string | null;
  mascotImageUrl?: string | null;
  themeJson?: Record<string, unknown> | null;
};

type BrandingManagerProps = {
  schoolId: string;
  schoolName: string;
  initialBranding: SchoolBranding;
  onSuccess?: () => void;
};

export function BrandingManager({
  schoolId,
  schoolName,
  initialBranding,
  onSuccess,
}: BrandingManagerProps) {
  const [primaryColor, setPrimaryColor] = useState(initialBranding.primaryColor || "#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState(initialBranding.secondaryColor || "#1E40AF");
  const [logoUrl, setLogoUrl] = useState(initialBranding.logoUrl || "");
  const [mascotName, setMascotName] = useState(initialBranding.mascotName || "");
  const [mascotImageUrl, setMascotImageUrl] = useState(initialBranding.mascotImageUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/schools/${schoolId}/branding`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryColor: primaryColor || null,
          secondaryColor: secondaryColor || null,
          logoUrl: logoUrl || null,
          mascotName: mascotName || null,
          mascotImageUrl: mascotImageUrl || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save branding");
      }

      toast({
        title: "Branding Updated",
        description: "Your school's branding has been updated successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update branding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isValidHexColor = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            School Colors
          </CardTitle>
          <CardDescription>
            Set your school's primary and secondary colors. These will be used throughout the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryColor(e.target.value)}
                  placeholder="#3B82F6"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1"
                />
              </div>
              {primaryColor && !isValidHexColor(primaryColor) && (
                <p className="text-xs text-red-500">Please enter a valid hex color (e.g., #3B82F6)</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondaryColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondaryColor(e.target.value)}
                  placeholder="#1E40AF"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1"
                />
              </div>
              {secondaryColor && !isValidHexColor(secondaryColor) && (
                <p className="text-xs text-red-500">Please enter a valid hex color (e.g., #1E40AF)</p>
              )}
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-background/60">
            <p className="text-sm font-medium mb-2">Preview</p>
            <div className="flex gap-2">
              <div
                className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: primaryColor || "#3B82F6" }}
              >
                Primary
              </div>
              <div
                className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: secondaryColor || "#1E40AF" }}
              >
                Secondary
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo
          </CardTitle>
          <CardDescription>
            Upload your school logo. Use a direct image URL or upload to a hosting service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              type="url"
              value={logoUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct URL to your school logo image
            </p>
          </div>
          {logoUrl && (
            <div className="rounded-lg border p-4 bg-background/60">
              <p className="text-sm font-medium mb-2">Logo Preview</p>
              <div className="flex items-center justify-center h-32 bg-background rounded-lg">
                <img
                  src={logoUrl}
                  alt={`${schoolName} logo`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Mascot
          </CardTitle>
          <CardDescription>
            Add your school mascot name and image for a personalized touch.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mascot-name">Mascot Name</Label>
            <Input
              id="mascot-name"
              type="text"
              value={mascotName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotName(e.target.value)}
              placeholder="e.g., Eagles, Tigers, Warriors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mascot-image-url">Mascot Image URL</Label>
            <Input
              id="mascot-image-url"
              type="url"
              value={mascotImageUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMascotImageUrl(e.target.value)}
              placeholder="https://example.com/mascot.png"
            />
            <p className="text-xs text-muted-foreground">
              Enter a direct URL to your mascot image
            </p>
          </div>
          {mascotImageUrl && (
            <div className="rounded-lg border p-4 bg-background/60">
              <p className="text-sm font-medium mb-2">Mascot Preview</p>
              <div className="flex items-center justify-center h-32 bg-background rounded-lg">
                <img
                  src={mascotImageUrl}
                  alt={mascotName || "Mascot"}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handleSave}
          disabled={isSaving || !isValidHexColor(primaryColor) || !isValidHexColor(secondaryColor)}
          className="w-full"
          size="lg"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Branding"}
        </Button>
      </motion.div>
    </div>
  );
}

