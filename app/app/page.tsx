"use client";

import { useEffect, useState } from "react";
import { getPlatformType } from "@/lib/platform";

const APPSHEET_URL = "https://www.appsheet.com/deploy/iosinappshortcut?appGuidString=44edd09d-1417-4503-a9aa-26111dd58fce&manifestToken=994eb862-0071-4941-b5a4-820facfe0910";

export default function AppPage() {
  const [platform, setPlatform] = useState<"desktop" | "mobile" | null>(null);

  useEffect(() => {
    const detectedPlatform = getPlatformType();
    setPlatform(detectedPlatform);

    // Mobile/Tablet: redirect directly to AppSheet
    if (detectedPlatform === "mobile") {
      window.location.href = APPSHEET_URL;
    }
  }, []);

  // Desktop: Show AppSheet in iframe (PWA wrapper)
  if (platform === "desktop") {
    return (
      <div className="w-full h-screen bg-white">
        <iframe
          src={APPSHEET_URL}
          title="AppSheet - VNAH QLNKT"
          className="w-full h-full border-none"
          allow="microphone;camera;geolocation;payment"
        />
      </div>
    );
  }

  // Loading state while detecting platform
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mb-4"></div>
        <p className="text-gray-600">Đang tải ứng dụng...</p>
      </div>
    </div>
  );
}
