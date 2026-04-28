'use client';

import { useEffect, useState } from 'react';
import {
  detectDevice,
  isPWAInstallable,
  downloadWindowsInstaller,
  getIOSInstallationSteps,
  getAndroidInstallationSteps,
  type DeviceType,
} from '@/lib/deviceDetection';

interface InstallationPromptProps {
  onClose?: () => void;
  autoShow?: boolean;
}

/**
 * Installation Prompt Component
 * Shows device-specific installation instructions
 */
export function InstallationPrompt({ onClose, autoShow = true }: InstallationPromptProps) {
  const [device, setDevice] = useState<DeviceType | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferPrompt, setDeferPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect device
    const deviceInfo = detectDevice();
    setDevice(deviceInfo.type);
    setIsInstalled(deviceInfo.isStandalone);

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferPrompt(e);
      if (autoShow && !isInstalled) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [autoShow, isInstalled]);

  if (isInstalled || !device) return null;

  // Windows - Show installer download prompt
  if (device === 'windows') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
        <div className="w-full bg-white p-4 shadow-lg sm:max-w-md sm:rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900">Cài đặt VNAH trên máy tính</h3>
          <p className="mt-2 text-sm text-slate-600">
            Tải xuống và cài đặt ứng dụng VNAH trên máy tính của bạn để truy cập nhanh hơn.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => {
                downloadWindowsInstaller();
                setShowPrompt(false);
              }}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Tải về và Cài đặt
            </button>
            <button
              onClick={() => {
                setShowPrompt(false);
                onClose?.();
              }}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Không phải bây giờ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS - Show PWA installation instructions
  if (device === 'ios') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
        <div className="w-full bg-white p-4 shadow-lg sm:max-w-md sm:rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900">Thêm VNAH vào Màn hình chính</h3>
          <p className="mt-2 text-sm text-slate-600">
            Thêm ứng dụng vào màn hình chính để truy cập nhanh hơn.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-slate-700">
            {getIOSInstallationSteps().map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-semibold text-blue-600">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <button
            onClick={() => {
              setShowPrompt(false);
              onClose?.();
            }}
            className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    );
  }

  // Android - Show PWA installation instructions
  if (device === 'android') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
        <div className="w-full bg-white p-4 shadow-lg sm:max-w-md sm:rounded-lg">
          <h3 className="text-lg font-semibold text-slate-900">Cài đặt Ứng dụng VNAH</h3>
          <p className="mt-2 text-sm text-slate-600">
            Cài đặt ứng dụng trên điện thoại của bạn để truy cập nhanh hơn.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-slate-700">
            {getAndroidInstallationSteps().map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="font-semibold text-blue-600">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex gap-3">
            {deferPrompt && (
              <button
                onClick={async () => {
                  if (deferPrompt) {
                    deferPrompt.prompt();
                    const { outcome } = await deferPrompt.userChoice;
                    if (outcome === 'accepted') {
                      setShowPrompt(false);
                    }
                  }
                }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Cài đặt
              </button>
            )}
            <button
              onClick={() => {
                setShowPrompt(false);
                onClose?.();
              }}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Không phải bây giờ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
