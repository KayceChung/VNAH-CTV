"use client";

import { useState } from "react";
import { InstallGuide } from "./InstallGuide";

type Platform = "desktop" | "mobile" | null;

export function PlatformSelector() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);

  if (selectedPlatform) {
    return (
      <InstallGuide
        platform={selectedPlatform}
        onBack={() => setSelectedPlatform(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Chọn thiết bị của bạn</h1>
          <p className="text-blue-100 mt-2">Để nhận hướng dẫn cài đặt phù hợp</p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8">
          {/* Desktop Card */}
          <button
            onClick={() => setSelectedPlatform("desktop")}
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-gray-200 p-8 transition hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="mb-4 rounded-full bg-blue-100 p-4 text-4xl group-hover:scale-110 transition">
              🖥️
            </div>
            <h3 className="text-lg font-bold text-gray-900">Máy Tính</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Windows, Mac, Linux
            </p>
            <div className="mt-4 inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 group-hover:bg-blue-100">
              Bấm để xem
            </div>
          </button>

          {/* Mobile/Tablet Card */}
          <button
            onClick={() => setSelectedPlatform("mobile")}
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-gray-200 p-8 transition hover:border-green-500 hover:bg-green-50"
          >
            <div className="mb-4 rounded-full bg-green-100 p-4 text-4xl group-hover:scale-110 transition">
              📱
            </div>
            <h3 className="text-lg font-bold text-gray-900">Điện thoại / iPad</h3>
            <p className="text-sm text-gray-600 mt-2 text-center">
              iOS, Android
            </p>
            <div className="mt-4 inline-flex rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 group-hover:bg-green-100">
              Bấm để xem
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4">
          <p className="text-xs text-gray-600 text-center">
            💡 Chọn loại thiết bị bạn đang sử dụng để nhận hướng dẫn chi tiết
          </p>
        </div>
      </div>
    </div>
  );
}
