'use client';

import { useEffect, useState } from 'react';
import { detectDevice, type DeviceType } from '@/lib/deviceDetection';

interface InstallButtonProps {
  onInstalled?: () => void;
}

/**
 * Install Button Component
 * Provides one-click installation of the PWA to home screen
 */
export function InstallButton({ onInstalled }: InstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [deferPrompt, setDeferPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    // Detect device
    const deviceInfo = detectDevice();
    setDevice(deviceInfo.type);
    setIsInstalled(deviceInfo.isStandalone);

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      if (onInstalled) {
        onInstalled();
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if ((window.navigator as any).standalone === true || document.referrer.includes('android-app://')) {
      setIsInstalled(true);
    }

    // On localhost, show the button for testing
    if (isLocalhost && !deviceInfo.isStandalone) {
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    setInstalling(true);

    if (device === 'ios') {
      // iOS needs manual steps
      alert(
        'Để cài đặt ứng dụng trên iPhone/iPad:\n\n' +
        '1️⃣ Chạm biểu tượng Chia sẻ (Share) ở dưới cùng\n' +
        '2️⃣ Chọn "Add to Home Screen"\n' +
        '3️⃣ Nhập tên ứng dụng và chạm "Add"\n\n' +
        'Ứng dụng sẽ xuất hiện trên màn hình chính!'
      );
      setInstalling(false);
      return;
    }

    if (deferPrompt) {
      try {
        deferPrompt.prompt();
        const { outcome } = await deferPrompt.userChoice;

        if (outcome === 'accepted') {
          setIsInstalled(true);
          onInstalled?.();
        }
      } catch (error) {
        console.error('Install prompt error:', error);
      }
    }

    setInstalling(false);
  };

  if (isInstalled || !device) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={installing}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
      title={device === 'ios' ? 'Hướng dẫn cài đặt trên iOS' : 'Cài đặt ứng dụng'}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m0 0h6M6 12h6m0 0H6"
        />
      </svg>
      {installing ? 'Đang cài đặt...' : 'Cài đặt ứng dụng'}
    </button>
  );
}
