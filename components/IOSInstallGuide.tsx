"use client";

const APPSHEET_APP_STORE_URL =
  "https://apps.apple.com/app/appsheet/id732548900";
const APPSHEET_URL =
  "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce";

interface IOSInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallGuide({ isOpen, onClose }: IOSInstallGuideProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Cài đặt AppSheet
            </h2>
            <p className="mt-1 text-sm text-slate-500">Chọn cách cài đặt bên dưới</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Option 1 — App Store (primary) */}
        <div className="rounded-2xl border-2 border-blue-600 bg-blue-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-600">
            ⭐ Khuyến nghị
          </p>
          <p className="mb-1 text-sm font-bold text-slate-900">
            Tải ứng dụng AppSheet từ App Store
          </p>
          <p className="mb-4 text-xs text-slate-500">
            Cài đặt chính thức — trải nghiệm đầy đủ nhất, hoạt động offline
          </p>
          <a
            href={APPSHEET_APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            {/* Apple logo SVG */}
            <svg viewBox="0 0 814 1000" className="h-5 w-5 fill-white" aria-hidden="true">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 134.4-317.3 266.5-317.3 70.1 0 128.1 46.4 171.6 46.4 43.6 0 111.5-49.2 190.1-49.2zm-655.3-161c28.7-33.8 49.9-80.8 49.9-127.8 0-6.5-.6-13-1.9-18.3-47.6 1.9-104.3 31.8-138.2 69.5C12.7 136.4 0 178.4 0 213.8c0 6.5 1.3 13 1.9 15.3 3.2.6 8.4 1.3 13.6 1.3 43.7 0 98.1-28.7 117.3-50.5z" />
            </svg>
            Mở App Store
          </a>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">HOẶC</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Option 2 — Web shortcut */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Thêm shortcut web vào màn hình chính
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E40AF] text-xs font-bold text-white">
                1
              </span>
              <p className="text-sm text-slate-700">
                Mở Safari, vào{" "}
                <a
                  href={APPSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 underline underline-offset-2"
                >
                  link AppSheet này
                </a>{" "}
                rồi bấm nút{" "}
                <span className="font-semibold text-[#1E40AF]">
                  Share{" "}
                  <svg
                    viewBox="0 0 24 24"
                    className="inline h-4 w-4 fill-none stroke-[#1E40AF]"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span>{" "}
                (ở thanh dưới màn hình)
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E40AF] text-xs font-bold text-white">
                2
              </span>
              <p className="text-sm text-slate-700">
                Cuộn xuống, chọn{" "}
                <span className="font-semibold text-[#1E40AF]">
                  Add to Home Screen
                </span>{" "}
                → bấm{" "}
                <span className="font-semibold text-[#1E40AF]">Add</span>
              </p>
            </div>
          </div>
        </div>

        {/* Done button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
