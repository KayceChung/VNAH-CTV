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
