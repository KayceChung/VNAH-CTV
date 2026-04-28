'use client';

import { useEffect, useState } from 'react';
import { detectDevice, type DeviceType } from '@/lib/deviceDetection';

interface ShortcutPromptProps {
  onClose?: () => void;
}

/**
 * Modern One-Click Shortcut Creation Prompt
 */
export function ShortcutPrompt({ onClose }: ShortcutPromptProps) {
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
      if (!isInstalled) {
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
  }, [isInstalled]);

  if (isInstalled || !device || !showPrompt) return null;

  const handleInstallClick = async () => {
    if (deferPrompt) {
      deferPrompt.prompt();
      const { outcome } = await deferPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setIsInstalled(true);
      }
    }
  };

  const handleIOSInstall = () => {
    alert(
      'Để thêm ứng dụng vào màn hình chính:\n\n' +
      '1. Tap biểu tượng Chia sẻ (Share) ở dưới cùng\n' +
      '2. Chọn "Add to Home Screen"\n' +
      '3. Đặt tên và chạm "Add"\n\n' +
      'Ứng dụng sẽ xuất hiện trên màn hình chính của bạn!'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => {
          setShowPrompt(false);
          onClose?.();
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6M6 12h6m0 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {device === 'ios' ? 'Thêm vào Màn hình chính' : 'Cài đặt ứng dụng'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {device === 'ios'
              ? 'Truy cập nhanh hơn với chỉ một cú chạm'
              : 'Mở ứng dụng nhanh chóng từ bàn làm việc'}
          </p>
        </div>

        {/* Body */}
        <div className="mt-6 space-y-3">
          {device === 'ios' && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm leading-relaxed text-slate-700">
              <p className="font-semibold text-slate-900">Làm thế nào:</p>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Chạm biểu tượng <strong>Chia sẻ</strong></li>
                <li>Chọn <strong>Add to Home Screen</strong></li>
                <li>Chạm <strong>Add</strong></li>
              </ol>
            </div>
          )}

          {(device === 'android' || device === 'windows') && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm leading-relaxed text-slate-700">
              <p className="font-semibold text-slate-900">Lợi ích:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Truy cập nhanh từ màn hình chính</li>
                <li>Không cần mở trình duyệt</li>
                <li>Toàn bộ dữ liệu của bạn được bảo vệ</li>
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setShowPrompt(false);
              onClose?.();
            }}
            className="flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
          >
            Bỏ qua
          </button>
          <button
            onClick={device === 'ios' ? handleIOSInstall : handleInstallClick}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            {device === 'ios' ? 'Hướng dẫn' : 'Cài đặt'}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setShowPrompt(false);
            onClose?.();
          }}
          className="absolute top-3 right-3 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
