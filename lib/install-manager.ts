import { detectDevice } from "@/lib/device-detector";

type InstallResult = "show-ios-guide" | "installed" | "dismissed" | "error" | "not-available";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export class InstallManager {
  private static deferredPrompt: BeforeInstallPromptEvent | null = null;
  private static listeners: Array<() => void> = [];
  private static initialized = false;

  static init() {
    if (typeof window === "undefined" || InstallManager.initialized) {
      return;
    }

    InstallManager.initialized = true;

    window.addEventListener("beforeinstallprompt", (event: Event) => {
      event.preventDefault();
      InstallManager.deferredPrompt = event as BeforeInstallPromptEvent;
      InstallManager.notifyListeners();
    });

    window.addEventListener("appinstalled", () => {
      InstallManager.deferredPrompt = null;
      InstallManager.notifyListeners();
      console.log("App installed successfully");
    });
  }

  static async promptInstall(): Promise<InstallResult> {
    const device = detectDevice();

    if (device === "ios") {
      return "show-ios-guide";
    }

    if (!InstallManager.deferredPrompt) {
      return "not-available";
    }

    try {
      await InstallManager.deferredPrompt.prompt();
      const { outcome } = await InstallManager.deferredPrompt.userChoice;

      if (outcome === "accepted") {
        InstallManager.deferredPrompt = null;
        InstallManager.notifyListeners();
        return "installed";
      }

      return "dismissed";
    } catch (error) {
      console.error("Install prompt error:", error);
      return "error";
    }
  }

  static canInstall(): boolean {
    const device = detectDevice();

    if (device === "ios") {
      return true;
    }

    return InstallManager.deferredPrompt !== null;
  }

  static subscribe(callback: () => void): () => void {
    InstallManager.listeners.push(callback);

    return () => {
      InstallManager.listeners = InstallManager.listeners.filter((listener) => listener !== callback);
    };
  }

  private static notifyListeners() {
    InstallManager.listeners.forEach((listener) => listener());
  }
}

if (typeof window !== "undefined") {
  InstallManager.init();
}
