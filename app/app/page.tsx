"use client";

import { useEffect, useState } from "react";
import { AddToHomeScreenGuide } from "@/components/AddToHomeScreenGuide";
import { DesktopShortcutGuide } from "@/components/DesktopShortcutGuide";
import { getPlatformType } from "@/lib/platform";

const APPSHEET_URL = "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce";

export default function AppPage() {
  const [platform, setPlatform] = useState<"desktop" | "mobile" | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const detectedPlatform = getPlatformType();
    setPlatform(detectedPlatform);
    setIsRedirecting(true);
  }, []);

  // Show appropriate guide
  if (platform === "mobile") {
    return <AddToHomeScreenGuide redirectAfter={isRedirecting} />;
  }

  if (platform === "desktop") {
    return <DesktopShortcutGuide />;
  }

  // Loading state
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mb-4"></div>
        <p className="text-gray-600">Đang chuẩn bị...</p>
      </div>
    </div>
  );
}
