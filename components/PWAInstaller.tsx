"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      console.log("✅ App installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt || installing) return;

    setInstalling(true);

    try {
      // Open AppSheet URL simultaneously
      window.open(
        "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank",
        "_blank",
        "noopener,noreferrer"
      );

      // Show the install prompt
      await deferredPrompt.prompt();

      // Get user choice
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("✅ User accepted install");
        setCanInstall(false);
      } else {
        console.log("❌ User dismissed install");
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error("Install error:", error);
    } finally {
      setInstalling(false);
    }
  };

  // Only show button on installable platforms (not on web-only)
  if (!canInstall) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      disabled={installing}
      className="w-full mt-3 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {installing ? "⏳ Đang cài đặt..." : "📥 Cài đặt ứng dụng"}
    </button>
  );
}
