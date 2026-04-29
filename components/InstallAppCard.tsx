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
      ? "Android: Trinh duyet co ho tro cai dat, nhung nut nay chi hien huong dan de tranh tao shortcut tu dong."
      : "Android: Trinh duyet chua ho tro install prompt. Vui long mo menu trinh duyet va chon Add to Home screen.";
  }

  if (device === "iphone") {
    return "iPhone: Nhan nut Share (o thanh duoi), chon 'Add to Home Screen', sau do bam Add.";
  }

  return "May tinh: Nhan bieu tuong sao (bookmark) hoac menu trinh duyet de tao shortcut ra man hinh.";
}

export function InstallAppCard() {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasBrowserInstall, setHasBrowserInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState("Dang xac dinh thiet bi...");

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
      setMessage("Ung dung da duoc cai dat tren thiet bi nay.");
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
      setMessage("Ung dung da duoc cai dat thanh cong.");
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
      return "Dang xu ly...";
    }

    return "Cai dat ung dung";
  }, [isInstalled, isInstalling]);

  const handleInstall = async () => {
    if (isInstalled || isInstalling) {
      return;
    }

    setIsInstalling(true);

    try {
      if (device === "iphone") {
        setMessage("Huong dan iPhone: Mo Share -> Add to Home Screen -> Add.");
        return;
      }

      if (device === "android") {
        if (deferredPrompt) {
          await deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;

          if (choice.outcome === "accepted") {
            setMessage("Android: Ban da chap nhan cai dat trong install prompt.");
          } else {
            setMessage("Android: Ban da dong install prompt. Ban co the thu lai bat ky luc nao.");
          }

          setDeferredPrompt(null);
          return;
        }

        setMessage(
          hasBrowserInstall
            ? "Android: De tu cai dat thu cong, mo menu trinh duyet va chon Install app/Add to Home screen."
            : "Android: Vui long mo menu trinh duyet va chon Add to Home screen de tao shortcut thu cong.",
        );
        return;
      }

      if (device === "desktop") {
        setMessage("Huong dan desktop: Mo menu trinh duyet va tao bookmark/shortcut thu cong.");
      } else {
        setMessage("Trinh duyet khong ho tro install prompt. Vui long tao shortcut thu cong tu menu trinh duyet.");
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="mt-5 rounded-3xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 p-4 shadow-[0_10px_30px_rgba(14,116,144,0.16)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-700">Cai dat ung dung</p>
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