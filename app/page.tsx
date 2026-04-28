"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { InstallButton } from "@/components/InstallButton";
import { useAuth } from "@/context/AuthContext";
import { callGAS } from "@/lib/api";
import type { Employee } from "@/types/employee";

type VerifyIdentityResponse = {
  found: boolean;
  message?: string;
  employee?: Employee;
};

export default function HomePage() {
  const router = useRouter();
  const { session, setSession, pushToast, clearSession } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [employeePreview, setEmployeePreview] = useState<Employee | null>(null);
  const [loadingLookup, setLoadingLookup] = useState(false);

  useEffect(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (session) {
      router.replace("/profile");
    }
  }, [router, session]);

  return (
    <main className="app-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Header with Install Button */}
        <div className="mb-8 flex items-center justify-between page-fade">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">VNAH QLDL CTV</h1>
            <p className="mt-1 text-sm text-slate-600">Hệ thống quản lý cộng tác viên</p>
          </div>
          <InstallButton />
        </div>

        {/* Main Content */}
        <div className="glass-card mb-6 page-fade">
          <div className="space-y-5 p-6">
            {/* Intro */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Xác thực danh tính</h2>
              <p className="text-sm text-slate-600">
                Nhập thông tin cá nhân để truy cập hồ sơ và cập nhật dữ liệu của bạn
              </p>
            </div>

            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900 mb-2">
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setEmployeePreview(null);
                }}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setEmployeePreview(null);
                }}
                placeholder="Ví dụ: 0901234567"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Verify Button */}
            <button
              type="button"
              disabled={loadingLookup}
              onClick={async () => {
                if (!fullName.trim() || !phone.trim()) {
                  pushToast("Vui lòng nhập đầy đủ họ tên và số điện thoại", "error");
                  return;
                }

                setLoadingLookup(true);

                try {
                  const result = await callGAS<VerifyIdentityResponse>({
                    action: "verifyIdentity",
                    full_name: fullName.trim(),
                    phone: phone.trim(),
                  });

                  if (!result.found) {
                    setEmployeePreview(null);
                    pushToast(result.message || "Không tìm thấy thông tin khớp với họ tên và số điện thoại", "error");
                    return;
                  }

                  setEmployeePreview(result.employee || null);
                  pushToast("Xác thực thành công!", "success");
                } catch (error) {
                  setEmployeePreview(null);
                  pushToast(error instanceof Error ? error.message : "Lỗi xác thực danh tính", "error");
                } finally {
                  setLoadingLookup(false);
                }
              }}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loadingLookup ? (
                <>
                  <div className="spinner" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                "Xác thực thông tin"
              )}
            </button>
          </div>
        </div>

        {/* Employee Preview */}
        {employeePreview && (
          <div className="glass-card mb-6 page-fade border-l-4 border-l-green-500 p-6">
            {/* Success Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-full bg-green-100 p-2 mt-0.5">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-1">
                  Tìm thấy thông tin
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  {employeePreview.Name || fullName.trim()}
                </h2>
              </div>
            </div>

            {/* Employee Details */}
            <div className="space-y-3 mb-5 py-4 border-t border-b border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tên đăng nhập</span>
                <span className="text-sm font-semibold text-slate-900">
                  {employeePreview.ID_Employees || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Email</span>
                <span className="text-sm font-semibold text-slate-900">
                  {employeePreview.Email || "—"}
                </span>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={() => {
                setSession({
                  identity: {
                    name: fullName.trim(),
                    phone: phone.trim(),
                  },
                  employee: employeePreview,
                });
                router.push("/profile");
              }}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:bg-slate-700"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="glass-card p-4 text-center page-fade">
          <p className="text-xs text-slate-600">
            💡 Thông tin của bạn được bảo vệ và chỉ sử dụng cho mục đích xác minh danh tính
          </p>
        </div>
      </div>
    </main>
  );
}