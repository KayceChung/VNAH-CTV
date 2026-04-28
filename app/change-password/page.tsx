"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { session, pushToast, clearSession } = useAuth();

  useEffect(() => {
    if (!session) {
      pushToast("Phiên xác thực không tồn tại. Vui lòng đăng nhập lại.", "error");
      router.replace("/");
    }
  }, [pushToast, router, session]);

  if (!session) {
    return null;
  }

  return (
    <main className="app-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 page-fade">
          <div className="rounded-full bg-gradient-to-br from-green-50 to-green-100 p-4">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8 page-fade">
          <h1 className="text-3xl font-bold text-slate-900">
            Cập nhật thành công!
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Thông tin của bạn đã được lưu vào Google Sheets
          </p>
        </div>

        {/* Updated Information */}
        <div className="glass-card p-6 mb-6 page-fade">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Thông tin đã cập nhật</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <span className="text-sm text-slate-600">Họ tên</span>
              <span className="text-sm font-semibold text-slate-900">
                {session.employee.Name || "—"}
              </span>
            </div>
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <span className="text-sm text-slate-600">Tên đăng nhập</span>
              <span className="text-sm font-semibold text-slate-900">
                {session.employee.ID_Employees || "—"}
              </span>
            </div>
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <span className="text-sm text-slate-600">Email</span>
              <span className="text-sm font-semibold text-slate-900">
                {session.employee.Email || "—"}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-600">Zalo</span>
              <span className="text-sm font-semibold text-slate-900">
                {session.employee.Zalo || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="glass-card p-4 mb-6 bg-blue-50 border-l-4 border-l-blue-500 page-fade">
          <p className="text-xs text-slate-700">
            ℹ️ Tất cả dữ liệu của bạn đã được xác minh và lưu trữ an toàn trên Google Sheets
          </p>
        </div>

        {/* Return Button */}
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.replace("/");
          }}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          Quay về trang đăng nhập
        </button>
      </div>
    </main>
  );
}