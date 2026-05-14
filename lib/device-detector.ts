export type DeviceType = "ios" | "android" | "desktop";

export const detectDevice = (): DeviceType => {
  if (typeof navigator === "undefined") {
    return "desktop";
  }

  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) {
    return "ios";
  }

  if (/android/.test(ua)) {
    return "android";
  }

  return "desktop";
};

export const isStandalone = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const iosStandalone = Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  const displayModeStandalone = window.matchMedia("(display-mode: standalone)").matches;

  return iosStandalone || displayModeStandalone;
};
