"use client";

import { useEffect, useMemo, useState } from "react";

type DeviceType = "android" | "iphone" | "desktop";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const INSTALLED_KEY = "vnah-app-installed";

function detectDeviceType(): DeviceType {
  // UA check is enough here because we only need broad UX branches.
  const ua = navigator.userAgent.toLowerCase();
  const isIphone = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  if (isAndroid) {
    return "android";
  }

  if (isIphone) {
    return "iphone";
  }

  return "desktop";
}

function getAutoHint(device: DeviceType, hasPrompt: boolean): string {
  if (device === "android") {
    return hasPrompt
      ? "Android: Trình duyệt có hỗ trợ cài đặt, nhưng nút này chỉ hiển hướng dẫn để tránh tạo shortcut tự động."
      : "Android: Trình duyệt chưa hỗ trợ install prompt. Vui lòng mở menu trình duyệt và chọn Add to Home screen.";
  }

  if (device === "iphone") {
    return "iPhone: Nhấn nút Share (ở thanh dưới), chọn 'Add to Home Screen', sau đó bấm Add.";
  }

  return "Máy tính: Nhấn biểu tượng sao (bookmark) hoặc menu trình duyệt để tạo shortcut ra màn hình.";
}

export function InstallAppCard() {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasBrowserInstall, setHasBrowserInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState("Đang xác định thiết bị...");

  useEffect(() => {
    const currentDevice = detectDeviceType();
    setDevice(currentDevice);

    // Detect installed state from browser display mode, iOS standalone, or local persisted flag.
    const standaloneMatch = window.matchMedia?.("(display-mode: standalone)")?.matches;
    const iosStandalone = Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    const storedInstalled = window.localStorage.getItem(INSTALLED_KEY) === "1";
    const installed = Boolean(standaloneMatch || iosStandalone || storedInstalled);

    if (installed) {
      setIsInstalled(true);
      setMessage("Ứng dụng đã được cài đặt trên thiết bị này.");
      return;
    }

    setMessage(getAutoHint(currentDevice, false));

    const onBeforeInstallPrompt = (event: Event) => {
      // Prevent mini-infobar and store the event for explicit user click.
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setHasBrowserInstall(true);
      setDeferredPrompt(promptEvent);
      setMessage(getAutoHint(currentDevice, true));
    };

    const onAppInstalled = () => {
      window.localStorage.setItem(INSTALLED_KEY, "1");
      setIsInstalled(true);
      setHasBrowserInstall(false);
      setDeferredPrompt(null);
      setMessage("Ứng dụng đã được cài đặt thành công.");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (isInstalled) {
      return;
    }

    setMessage(getAutoHint(device, hasBrowserInstall));
  }, [hasBrowserInstall, device, isInstalled]);

  const buttonLabel = useMemo(() => {
    if (isInstalled) {
      return "✓ Đã cài đặt";
    }

    if (isInstalling) {
      return "Đang xử lý...";
    }

    return "Cài đặt ứng dụng";
  }, [isInstalled, isInstalling]);

  const handleInstall = async () => {
    if (isInstalled || isInstalling) {
      return;
    }

    setIsInstalling(true);

    try {
      if (device === "iphone") {
        setMessage("Hướng dẫn iPhone: Mở Share -> Add to Home Screen -> Add.");
        return;
      }

      if (device === "android") {
        if (deferredPrompt) {
          await deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;

          if (choice.outcome === "accepted") {
            setMessage("Android: Bạn đã chấp nhận cài đặt trong install prompt.");
          } else {
            setMessage("Android: Bạn đã đóng install prompt. Bạn có thể thử lại bất kỳ lúc nào.");
          }

          setDeferredPrompt(null);
          return;
        }

        setMessage(
          hasBrowserInstall
            ? "Android: Để tự cài đặt thủ công, mở menu trình duyệt và chọn Install app/Add to Home screen."
            : "Android: Vui lòng mở menu trình duyệt và chọn Add to Home screen để tạo shortcut thủ công.",
        );
        return;
      }

      if (device === "desktop") {
        setMessage("Hướng dẫn desktop: Mở menu trình duyệt và tạo bookmark/shortcut thủ công.");
      } else {
        setMessage("Trình duyệt không hỗ trợ install prompt. Vui lòng tạo shortcut thủ công từ menu trình duyệt.");
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="mt-5 rounded-3xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-4 shadow-[0_10px_30px_rgba(14,116,144,0.16)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-700">Cài đặt ứng dụng</p>
      <button
        type="button"
        disabled={isInstalled || isInstalling}
        onClick={handleInstall}
        className="mt-3 w-full rounded-2xl text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-[1px] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          padding: "14px",
          backgroundImage: "linear-gradient(135deg, #00a3ff 0%, #6a5af9 100%)",
        }}
      >
        {buttonLabel}
      </button>

      <p className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-sm leading-6 text-slate-700">{message}</p>
    </div>
  );
}