"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event fired");
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      setIsInstalled(true);
      setShowInstallBanner(false);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      console.log("Install prompt not available");
      return;
    }

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted install prompt");
        setIsInstalled(true);
      } else {
        console.log("User dismissed install prompt");
      }

      setInstallPrompt(null);
      setShowInstallBanner(false);
    } catch (error) {
      console.error("Error during install:", error);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
  };

  if (isInstalled || !showInstallBanner || !installPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white shadow-2xl">
        <div className="flex-1">
          <p className="font-semibold text-sm sm:text-base">Cài đặt ứng dụng</p>
          <p className="text-xs sm:text-sm opacity-90">Thêm VNAH QLDL CTV vào màn hình chính của bạn</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg text-sm transition hover:bg-gray-100"
          >
            Cài đặt
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-white/80 font-semibold rounded-lg text-sm transition hover:text-white hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
