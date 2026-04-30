"use client";

import { useState } from "react";

const APPSHEET_URL = "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce";

export function DesktopShortcutGuide() {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(APPSHEET_URL);
  };

  if (showInstructions) {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6 text-white flex items-center justify-between sticky top-0 z-10 shadow-md">
          <h1 className="text-xl font-bold">🖥️ Tạo Shortcut</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="w-full max-w-md space-y-4">
            {/* Step 1 */}
            <div className="rounded-2xl bg-white p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  1
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-blue-900 mb-2">Mở trình duyệt</h2>
                  <p className="text-gray-700 text-sm">
                    Mở ứng dụng bằng cách nhấn nút <strong>"Mở ứng dụng"</strong> bên dưới.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-white p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-blue-900 mb-2">Tạo shortcut</h2>
                  <p className="text-gray-700 text-sm">
                    Khi trang AppSheet đã tải, hãy <strong>nhấp chuột phải vào thanh địa chỉ URL</strong> và chọn:
                  </p>
                  <div className="mt-3 bg-gray-100 p-2 rounded text-xs text-gray-800">
                    <strong>Chọn:</strong> "Tạo shortcut" hoặc "Create shortcut"
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-white p-5 border-2 border-blue-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  3
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-blue-900 mb-2">Đặt tên & chọn vị trí</h2>
                  <p className="text-gray-700 text-sm">
                    Đặt tên: <strong>"VNAH QLNKT"</strong>
                  </p>
                  <p className="text-gray-700 text-sm mt-2">
                    Chọn vị trí: <strong>Desktop</strong> để dễ truy cập.
                  </p>
                </div>
              </div>
            </div>

            {/* URL Box */}
            <div className="rounded-2xl bg-yellow-50 p-5 border-2 border-yellow-200">
              <div className="flex items-start gap-4">
                <div className="text-2xl">🔗</div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-2">URL ứng dụng:</h3>
                  <div className="bg-white p-3 rounded text-xs text-gray-700 break-all font-mono border border-yellow-200 mb-3">
                    {APPSHEET_URL}
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    📋 Sao chép
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 sticky bottom-0 shadow-lg space-y-3">
          <button
            onClick={() => (window.location.href = APPSHEET_URL)}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-md"
          >
            🚀 Mở ứng dụng
          </button>
          <button
            onClick={() => setShowInstructions(false)}
            className="w-full px-6 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Main screen
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-5xl">
            🖥️
          </div>
        </div>

        {/* Content */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VNAH QLNKT</h1>
          <p className="text-gray-700 mb-4">
            Ứng dụng Quản lý Nhân viên trên Desktop
          </p>
          <p className="text-sm text-gray-600">
            Hãy tạo một shortcut trên Desktop để truy cập nhanh chóng.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Mẹo:</strong> Bạn cũng có thể ghim ứng dụng vào Taskbar để tiện dàng hơn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => setShowInstructions(true)}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-md"
          >
            📋 Xem hướng dẫn
          </button>
          <button
            onClick={() => (window.location.href = APPSHEET_URL)}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 transition shadow-md"
          >
            🚀 Mở ứng dụng ngay
          </button>
        </div>
      </div>
    </div>
  );
}
