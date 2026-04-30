export function getPlatformType(): "desktop" | "mobile" {
  if (typeof window === "undefined") return "desktop";

  const ua = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  return isMobile ? "mobile" : "desktop";
}

export function useDetectPlatform() {
  if (typeof window === "undefined") return "desktop";
  return getPlatformType();
}
