"use client";

import { useEffect, useState } from "react";

interface AddToHomeScreenGuideProps {
  redirectAfter?: boolean;
}

const APPSHEET_URL = "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce";

export function AddToHomeScreenGuide({ redirectAfter = false }: AddToHomeScreenGuideProps) {
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    if (redirectAfter && !showGuide) {
      // Redirect after user confirms
      const timer = setTimeout(() => {
        window.location.href = APPSHEET_URL;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [redirectAfter, showGuide]);

  const handleClose = () => {
    setShowGuide(false);
  };

  if (!showGuide) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-6 text-white flex items-center justify-between sticky top-0 z-10 shadow-md">
        <h1 className="text-xl font-bold">📱 Cài đặt ứng dụng</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-full max-w-md space-y-4">
          {/* Step 1 */}
          <div className="rounded-2xl bg-white p-5 border-2 border-green-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                1
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-green-900 mb-2">Mở menu trình duyệt</h2>
                <p className="text-gray-700 text-sm">
                  Nhấn nút <strong className="text-lg">⋮</strong> (ba chấm) hoặc <strong className="text-lg">⋯</strong> ở góc màn hình.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-white p-5 border-2 border-green-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                2
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-green-900 mb-2">Chọn "Thêm vào màn hình chính"</h2>
                <p className="text-gray-700 text-sm">
                  Tìm option <strong>"Add to Home Screen"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-white p-5 border-2 border-green-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                3
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-green-900 mb-2">Xác nhận</h2>
                <p className="text-gray-700 text-sm">
                  Nhấn <strong>"Thêm"</strong> hoặc <strong>"Add"</strong> để hoàn tất. Icon sẽ xuất hiện trên màn hình chính!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 sticky bottom-0 shadow-lg">
        <button
          onClick={handleClose}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 transition shadow-md"
        >
          ✓ Đã hiểu, tiếp tục
        </button>
      </div>
    </div>
  );
}
