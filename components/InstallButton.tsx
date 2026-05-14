"use client";

import { useEffect, useState } from "react";
import { detectDevice, isStandalone, type DeviceType } from "@/lib/device-detector";
import { InstallManager } from "@/lib/install-manager";

interface InstallButtonProps {
  onIOSGuide?: (show: boolean) => void;
  onInstallSuccess?: () => void;
  onRedirectApp?: () => void;
}

export function InstallButton({
  onIOSGuide,
  onInstallSuccess,
  onRedirectApp,
}: InstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyInstalled, setAlreadyInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    const updateState = () => {
      setDeviceType(detectDevice());
      setCanInstall(InstallManager.canInstall());
      setAlreadyInstalled(isStandalone());
    };

    updateState();

    const unsubscribe = InstallManager.subscribe(updateState);

    const handleAppInstalled = () => {
      setAlreadyInstalled(true);
      setCanInstall(false);
      onInstallSuccess?.();
      setTimeout(() => {
        onRedirectApp?.();
      }, 1000);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [onInstallSuccess, onRedirectApp]);

  const handleClick = async () => {
    setStatusMessage("");
    setIsLoading(true);

    const result = await InstallManager.promptInstall();

    if (result === "show-ios-guide") {
      onIOSGuide?.(true);
    } else if (result === "installed") {
      onInstallSuccess?.();
      setCanInstall(false);
      setTimeout(() => {
        onRedirectApp?.();
      }, 1000);
    } else if (result === "not-available") {
      setStatusMessage("Trình duyệt chưa sẵn sàng cài đặt. Hãy mở bằng Chrome/Edge và thử lại sau vài giây.");
    } else if (result === "dismissed") {
      setStatusMessage("Bạn đã đóng hộp thoại cài đặt.");
    } else if (result === "error") {
      setStatusMessage("Có lỗi khi mở hộp thoại cài đặt. Vui lòng thử lại.");
    }

    setIsLoading(false);
  };

  const shouldRenderButton = !alreadyInstalled && (deviceType === "ios" || canInstall || deviceType === "android" || deviceType === "desktop");

  if (!shouldRenderButton) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#1E40AF] px-6 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#1D4ED8] hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:h-16 sm:px-8 sm:text-base"
      >
        <span aria-hidden>📱</span>
        {isLoading ? "Đang xử lý..." : "CÀI ĐẶT ỨNG DỤNG"}
      </button>
      {statusMessage ? (
        <p className="max-w-md text-center text-xs font-medium text-amber-700 sm:text-sm">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
