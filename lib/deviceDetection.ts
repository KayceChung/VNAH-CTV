/**
 * Device Detection Utilities
 * Identifies device type and OS for appropriate installation flow
 */

export type DeviceType = 'windows' | 'ios' | 'android' | 'mac' | 'linux' | 'unknown';

interface DeviceInfo {
  type: DeviceType;
  isStandalone: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
}

/**
 * Detect the current device type and characteristics
 */
export function detectDevice(): DeviceInfo {
  const ua = typeof window !== 'undefined' ? navigator.userAgent : '';
  
  // Check if running as standalone PWA
  const isStandalone = typeof window !== 'undefined' 
    ? (window.navigator as any).standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches
    : false;

  // Detect device type from user agent
  let type: DeviceType = 'unknown';
  let isMobile = false;
  let isTablet = false;
  let isDesktop = false;

  if (/windows|win32/i.test(ua)) {
    type = 'windows';
    isDesktop = true;
  } else if (/mac|iphone|ipad|ipod/i.test(ua)) {
    if (/iphone|ipod/i.test(ua)) {
      type = 'ios';
      isMobile = true;
    } else if (/ipad/i.test(ua)) {
      type = 'ios';
      isTablet = true;
    } else {
      type = 'mac';
      isDesktop = true;
    }
  } else if (/android/i.test(ua)) {
    type = 'android';
    isMobile = /mobile/i.test(ua);
    isTablet = !isMobile;
  } else if (/linux/i.test(ua)) {
    type = 'linux';
    isDesktop = true;
  }

  return {
    type,
    isStandalone,
    isMobile,
    isTablet,
    isDesktop,
    userAgent: ua,
  };
}

/**
 * Check if PWA is installable on current device
 */
export function isPWAInstallable(): boolean {
  if (typeof window === 'undefined') return false;
  
  const device = detectDevice();
  const supportsServiceWorker = 'serviceWorker' in navigator;
  const supportsWebApp = 'BeforeInstallPromptEvent' in window;
  const isNotStandalone = !device.isStandalone;
  
  return (device.isMobile || device.isTablet) && 
         supportsServiceWorker && 
         isNotStandalone &&
         (supportsWebApp || device.type === 'ios');
}

/**
 * Trigger Windows installer download
 */
export function downloadWindowsInstaller(): void {
  if (typeof window === 'undefined') return;
  
  // Create a link to the installer
  const installerUrl = '/VNAH_Installer.exe';
  const link = document.createElement('a');
  link.href = installerUrl;
  link.download = 'VNAH_Installer.exe';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get iOS installation instructions for PWA
 */
export function getIOSInstallationSteps(): string[] {
  return [
    'Nhấn nút chia sẻ (Share) tại thanh công cụ dưới cùng',
    'Nhấn "Thêm vào Màn hình chính" (Add to Home Screen)',
    'Nhập tên: VNAH',
    'Nhấn "Thêm" (Add) ở góc trên cùng bên phải',
  ];
}

/**
 * Get Android installation instructions for PWA
 */
export function getAndroidInstallationSteps(): string[] {
  return [
    'Mở menu (ba dấu chấm) ở góc trên cùng bên phải',
    'Chọn "Cài đặt ứng dụng này" (Install app) hoặc "Thêm vào màn hình chính"',
    'Xác nhận để hoàn tất',
  ];
}
