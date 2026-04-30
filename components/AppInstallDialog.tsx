"use client";

import { useState } from "react";

interface AppInstallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  appUrl?: string;
  onConfirm?: (appName: string) => void;
}

export function AppInstallDialog({
  isOpen,
  onClose,
  appName = "VNAH_QLNKT_VER3.0_PUBLIC",
  appUrl = "www.appsheet.com",
  onConfirm,
}: AppInstallDialogProps) {
  const [inputValue, setInputValue] = useState(appName);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(inputValue);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Cài đặt trang này dưới dạng ứng dụng
          </h2>
          <p className="text-sm text-slate-600">
            Ứng dụng sẽ mở trong một cửa số
          </p>
        </div>

        {/* App Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Tên ứng dụng
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 border-2 border-red-600 rounded-lg text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 transition"
            placeholder="Nhập tên ứng dụng"
          />
        </div>

        {/* URL Display */}
        <div className="text-center text-sm text-slate-500">
          {appUrl}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-orange-200 text-slate-700 font-semibold rounded-full hover:bg-orange-300 transition text-sm"
          >
            Cài đặt
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-amber-700 text-white font-semibold rounded-full hover:bg-amber-800 transition text-sm"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
