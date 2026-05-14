"use client";

interface IOSInstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallGuide({ isOpen, onClose }: IOSInstallGuideProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Cài đặt ứng dụng</h2>
          <p className="mt-2 text-sm text-slate-600">iPhone/iPad chỉ cần 2 bước:</p>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              <span className="mr-2">1.</span>
              Bấm nút <span className="text-blue-700">Share</span> trên Safari
            </p>
          </div>

          <div className="text-center text-2xl text-blue-600">↓</div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              <span className="mr-2">2.</span>
              Chọn <span className="text-blue-700">Add to Home Screen</span> rồi bấm Add
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-[#1E40AF] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
}
