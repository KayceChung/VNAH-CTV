"use client";

interface InstallGuideProps {
  platform: "desktop" | "mobile";
  onBack: () => void;
}

export function InstallGuide({ platform, onBack }: InstallGuideProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Hướng dẫn cài đặt {platform === "desktop" ? "Máy Tính" : "Điện thoại"}
          </h1>
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {platform === "desktop" ? (
            <>
              <div className="rounded-2xl bg-blue-50 p-6 border border-blue-200">
                <h2 className="font-bold text-lg text-blue-900 mb-4">
                  📌 Bước 1: Nhấn nút "Cài đặt" khi trình duyệt yêu cầu
                </h2>
                <img
                  src="https://via.placeholder.com/400x300?text=Desktop+Install+Step+1"
                  alt="Desktop install step 1"
                  className="w-full rounded-lg border border-blue-300"
                />
                <p className="mt-4 text-blue-800 text-sm">
                  Khi mở ứng dụng, trình duyệt sẽ hiển thị popup hỏi có muốn cài đặt ứng dụng. Hãy click "Cài đặt".
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-6 border border-blue-200">
                <h2 className="font-bold text-lg text-blue-900 mb-4">
                  📌 Bước 2: Kiểm tra icon trên desktop
                </h2>
                <img
                  src="https://via.placeholder.com/400x300?text=Desktop+Install+Step+2"
                  alt="Desktop install step 2"
                  className="w-full rounded-lg border border-blue-300"
                />
                <p className="mt-4 text-blue-800 text-sm">
                  Sau khi cài đặt, icon ứng dụng sẽ xuất hiện trên desktop. Double-click để mở.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-green-50 p-6 border border-green-200">
                <h2 className="font-bold text-lg text-green-900 mb-4">
                  📌 Bước 1: Nhấn "Thêm vào Màn hình chính"
                </h2>
                <img
                  src="https://via.placeholder.com/400x300?text=Mobile+Install+Step+1"
                  alt="Mobile install step 1"
                  className="w-full rounded-lg border border-green-300"
                />
                <p className="mt-4 text-green-800 text-sm">
                  Khi mở ứng dụng, nhấn nút "Thêm vào màn hình chính" hoặc tìm option tương tự trong menu.
                </p>
              </div>

              <div className="rounded-2xl bg-green-50 p-6 border border-green-200">
                <h2 className="font-bold text-lg text-green-900 mb-4">
                  📌 Bước 2: Tìm icon trên màn hình chính
                </h2>
                <img
                  src="https://via.placeholder.com/400x300?text=Mobile+Install+Step+2"
                  alt="Mobile install step 2"
                  className="w-full rounded-lg border border-green-300"
                />
                <p className="mt-4 text-green-800 text-sm">
                  Sau khi cài đặt, icon ứng dụng sẽ xuất hiện trên màn hình chính. Tap để mở.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            ← Quay lại
          </button>
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            Hoàn tất ✓
          </button>
        </div>
      </div>
    </div>
  );
}
