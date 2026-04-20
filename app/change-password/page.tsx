"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/StepIndicator";
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
    <main className="app-shell px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col justify-center gap-6">
        <StepIndicator currentStep={3} />

        <section className="glass-card rounded-[30px] p-8 text-center page-fade">
          <div className="mb-6 flex items-center justify-center gap-3">
            <img src="/logo.png" alt="VNAH Logo" className="h-10 object-contain" />
            <h1 className="text-2xl font-bold text-slate-950">VNAH QLDL CTV</h1>
          </div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
            ✓
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Đã cập nhật thông tin thành công</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Thông tin nhân sự, tên đăng nhập và mật khẩu đã được ghi trực tiếp vào Google Sheets thông qua Apps Script.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 text-left text-sm leading-7 text-slate-700">
            <p><strong>Họ tên:</strong> {session.employee.Name || "Chưa cập nhật"}</p>
            <p><strong>Tên đăng nhập:</strong> {session.employee.ID_Employees || "Chưa cập nhật"}</p>
            <p><strong>Email:</strong> {session.employee.Email || "Chưa cập nhật"}</p>
            <p><strong>Zalo:</strong> {session.employee.Zalo || "Chưa cập nhật"}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSession();
              router.replace("/");
            }}
            className="mt-6 inline-flex rounded-2xl bg-[#1E40AF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Quay về trang xác thực
          </button>

          <a
            href="https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl"
          >
            🚀 Truy cập ứng dụng CTV
          </a>
        </section>
      </div>
    </main>
  );
}