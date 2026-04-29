"use client";

import { useEffect, useState } from "react";

interface PlatformInfo {
  type: "windows" | "mac" | "linux" | "android" | "ios" | "other";
  isDesktop: boolean;
  isMobile: boolean;
  userAgent: string;
}

interface InstallState {
  loading: boolean;
  redirecting: boolean;
  error: string | null;
  message: string;
}

const APPSHEET_CONFIG = {
  // URL gốc
  baseURL: "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce",
  // URL desktop với platform=desktop
  desktopURL:
    "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank",
  // URL mobile cho AppSheet shortcut
  mobileURL:
    "https://www.appsheet.com/newshortcut/44edd09d-1417-4503-a9aa-26111dd58fce",
};

const REDIRECT_DELAY = 1500; // ms

export function detectPlatform(): PlatformInfo {
  if (typeof navigator === "undefined") {
    return {
      type: "other",
      isDesktop: false,
      isMobile: false,
      userAgent: "",
    };
  }

  const ua = navigator.userAgent.toLowerCase();

  const isWindows = /windows nt/.test(ua);
  const isMac = /macintosh|mac os x/.test(ua);
  const isLinux = /linux/.test(ua);
  const isAndroid = /android/.test(ua);
  const isIOS = /iphone|ipad|ipod/.test(ua);

  let type: "windows" | "mac" | "linux" | "android" | "ios" | "other" =
    "other";
  if (isWindows) type = "windows";
  else if (isMac) type = "mac";
  else if (isLinux) type = "linux";
  else if (isAndroid) type = "android";
  else if (isIOS) type = "ios";

  const isDesktop = isWindows || isMac || isLinux;
  const isMobile = isAndroid || isIOS;

  return {
    type,
    isDesktop,
    isMobile,
    userAgent: ua,
  };
}

/**
 * Ghi log analytics event
 */
function trackEvent(
  action: string,
  category: string = "AppSheet",
  label?: string,
  value?: number
) {
  // Google Analytics tracking (nếu có GA script)
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Console log for debugging
  console.log(`[Analytics] ${action}:`, { category, label, value });
}

export default function AppSheetInstaller({
  autoInstall = true,
  showUI = true,
}: {
  autoInstall?: boolean;
  showUI?: boolean;
}) {
  const [platform, setPlatform] = useState<PlatformInfo | null>(null);
  const [state, setState] = useState<InstallState>({
    loading: false,
    redirecting: false,
    error: null,
    message: "",
  });
  const [showFallback, setShowFallback] = useState(false);
  const [iosGuideVisible, setIosGuideVisible] = useState(false);

  useEffect(() => {
    // Detect platform
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);

    // Auto-install if enabled
    if (autoInstall) {
      setTimeout(() => {
        handleInstall(detectedPlatform);
      }, 500); // Delay nhỏ để trang được render
    }
  }, [autoInstall]);

  const handleInstall = async (platformInfo: PlatformInfo = platform!) => {
    if (!platformInfo) return;

    setState((prev) => ({
      ...prev,
      loading: true,
      redirecting: true,
      message: "Đang chuẩn bị cài đặt ứng dụng...",
      error: null,
    }));

    trackEvent("install_initiated", "AppSheet", platformInfo.type);

    try {
      let urlToOpen = "";
      let messageText = "";

      if (platformInfo.isDesktop) {
        // Desktop: mở URL với platform=desktop
        urlToOpen = APPSHEET_CONFIG.desktopURL;
        messageText =
          "🔄 Đang chuyển hướng tới AppSheet để cài đặt ứng dụng desktop...";

        trackEvent("install_desktop_initiated", "AppSheet");
      } else if (platformInfo.type === "android") {
        // Android: mở URL mobile install
        urlToOpen = APPSHEET_CONFIG.mobileURL;
        messageText =
          "🔄 Đang chuyển hướng tới Play Store để cài đặt ứng dụng...";

        trackEvent("install_android_initiated", "AppSheet");
      } else if (platformInfo.type === "ios") {
        // iOS: mở URL và hiện guide
        urlToOpen = APPSHEET_CONFIG.mobileURL;
        messageText =
          "🔄 Đang chuyển hướng tới App Store để cài đặt ứng dụng...";

        trackEvent("install_ios_initiated", "AppSheet");

        // Show iOS guide sau khi open URL
        setTimeout(() => {
          setIosGuideVisible(true);
        }, REDIRECT_DELAY + 500);
      } else {
        // Other: use base URL
        urlToOpen = APPSHEET_CONFIG.baseURL;
        messageText =
          "🔄 Đang chuyển hướng tới AppSheet để cài đặt ứng dụng...";

        trackEvent("install_other_initiated", "AppSheet");
      }

      setState((prev) => ({
        ...prev,
        message: messageText,
      }));

      // Delay để người dùng thấy thông báo
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY));

      // Mở URL
      try {
        window.open(urlToOpen, "_blank", "noopener,noreferrer");
        trackEvent("install_url_opened", "AppSheet", platformInfo.type);
      } catch (openError) {
        console.error("Error opening URL:", openError);
        trackEvent("install_url_error", "AppSheet", platformInfo.type);
        throw new Error("Không thể mở liên kết cài đặt");
      }

      // Fallback: show notification
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          loading: false,
          redirecting: false,
          message:
            "✅ Cửa sổ AppSheet đã được mở. Nếu không hiện ra, hãy bấm nút bên dưới.",
        }));
        setShowFallback(true);
        trackEvent("install_fallback_shown", "AppSheet", platformInfo.type);
      }, 2000);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi không xác định";
      setState((prev) => ({
        ...prev,
        loading: false,
        redirecting: false,
        error: errorMsg,
        message: "",
      }));
      trackEvent(
        "install_error",
        "AppSheet",
        platformInfo.type,
        1
      );
      setShowFallback(true);
    }
  };

  const handleFallbackClick = () => {
    if (!platform) return;

    const url =
      platform.isDesktop && platform.type !== "ios" && platform.type !== "android"
        ? APPSHEET_CONFIG.desktopURL
        : platform.type === "ios"
          ? APPSHEET_CONFIG.mobileURL
          : APPSHEET_CONFIG.mobileURL;

    window.open(url, "_blank", "noopener,noreferrer");
    trackEvent("install_fallback_clicked", "AppSheet", platform.type);
  };

  if (!showUI) {
    return null;
  }

  if (!platform) {
    return null;
  }

  return (
    <>
      {/* Notification/Message */}
      {state.message && (
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-center px-4 py-4 sm:py-8">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-4 text-sm font-medium text-blue-900 shadow-lg ring-1 ring-blue-200 sm:px-6 sm:py-5 sm:text-base">
            {state.redirecting && <div className="spinner" />}
            {state.message}
          </div>
        </div>
      )}

      {/* Error message */}
      {state.error && (
        <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-center px-4 py-4 sm:py-8">
          <div className="inline-flex flex-col items-center gap-2 rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-900 shadow-lg ring-1 ring-red-200 sm:flex-row sm:px-6 sm:py-5 sm:text-base">
            <span>⚠️ {state.error}</span>
            {showFallback && (
              <button
                onClick={handleFallbackClick}
                className="ml-2 rounded-lg bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* Fallback button (only show if URL didn't auto-open) */}
      {showFallback && !state.redirecting && !state.error && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center px-4 py-4 sm:py-6">
          <button
            onClick={handleFallbackClick}
            disabled={state.loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:px-8 sm:py-4 sm:text-base"
          >
            {state.loading ? (
              <>
                <div className="spinner" /> Đang xử lý...
              </>
            ) : (
              <>
                🚀 Mở AppSheet
              </>
            )}
          </button>
        </div>
      )}

      {/* iOS Guide Modal */}
      {iosGuideVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Hướng dẫn cài đặt iOS"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out sm:p-8 opacity-100 scale-100" style={{animation: "fadeInZoom 0.3s ease-out"}}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl">📱</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Cài đặt ứng dụng trên iPhone
              </h2>
            </div>

            <p className="text-sm text-slate-600">
              AppSheet đã được mở. Làm theo 3 bước để thêm icon ra màn hình chính:
            </p>

            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                  1
                </span>
                <span>
                  Trong app AppSheet vừa mở, bấm nút <strong>Share</strong> (hình
                  vuông có mũi tên ⬆️).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                  2
                </span>
                <span>
                  Cuộn xuống và chọn <strong>&quot;Add to Home Screen&quot;</strong>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                  3
                </span>
                <span>
                  Bấm <strong>&quot;Add&quot;</strong> — icon sẽ xuất hiện trên màn
                  hình chính.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setIosGuideVisible(false)}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Đã hiểu ✓
            </button>
          </div>
        </div>
      )}
    </>
  );
}
