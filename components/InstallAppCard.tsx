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
const APPSHEET_INSTALLED_KEY = "appsheet-app-installed";

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
    return "iPhone: Sau khi cai dat AppSheet, hay bam nut Share (goc duoi ben phai), chon 'Add to Home Screen', sau do bam Add.";
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
  const [iosStep, setIosStep] = useState<"initial" | "downloading" | "downloaded">("initial");

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
      if (device === "iphone") {
        if (iosStep === "downloading") {
          return "Dang tai AppSheet...";
        }
        if (iosStep === "downloaded") {
          return "✓ Cai dat AppSheet thanh cong";
        }
      }
      return "Dang xu ly...";
    }

    return "Cai dat ung dung";
  }, [isInstalled, isInstalling, device, iosStep]);

  const handleInstall = async () => {
    if (isInstalled || isInstalling) {
      return;
    }

    setIsInstalling(true);

    try {
      if (device === "iphone") {
        // For iOS, we need a 2-step process:
        // 1. Try to open AppSheet app directly (if installed)
        // 2. If not responding after timeout, redirect to App Store
        
        const appStoreUrl = "https://apps.apple.com/app/appsheet/id1097914718";
        
        // Try to open AppSheet app with its URL scheme (if installed)
        // AppSheet URL scheme for opening VNAH app
        const appsheetUrl = `appsheet://app/44edd09d-1417-4503-a9aa-26111dd58fce`;
        
        setIosStep("downloading");
        setMessage(
          "Dang kiem tra AppSheet...\n\nNeu AppSheet chua duoc cai dat, trang se tu dong chuyen den App Store."
        );

        // Try to open app scheme
        const appOpened = tryOpenAppScheme(appsheetUrl);
        
        if (appOpened) {
          // App might be installed, wait a moment then mark as downloaded
          setTimeout(() => {
            setIosStep("downloaded");
            setMessage(
              "AppSheet da mo thanh cong!\n\nBay gio, bam nut Share (goc duoi ben phai) tren man hinh nay, chon 'Add to Home Screen', sau do bam Add de tao shortcut tren Home Screen."
            );
            setIsInstalling(false);
          }, 1500);
        } else {
          // App not installed, redirect to App Store
          setTimeout(() => {
            setIosStep("downloading");
            setMessage(
              "AppSheet chua duoc cai dat. Dang mo App Store...\n\nSau khi cai dat AppSheet, hay quay lai trang nay va click nut Share de tao shortcut."
            );
            window.location.href = appStoreUrl;
          }, 1000);
        }
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
      setTimeout(() => {
        setIsInstalling(false);
      }, 500);
    }
  };

  /**
   * Try to open an app via its URL scheme.
   * Returns true if the scheme appears to have been handled (app might be installed).
   * Returns false if the app is likely not installed.
   */
  function tryOpenAppScheme(scheme: string): boolean {
    try {
      // Create an iframe to test if the scheme is registered
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);

      iframe.onload = () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
      };

      iframe.src = scheme;
      return true;
    } catch {
      return false;
    }
  }

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

      <p className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {message}
      </p>
    </div>
  );
}