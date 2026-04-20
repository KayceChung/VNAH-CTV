"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/StepIndicator";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
    <main className="app-shell px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center gap-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <section className="glass-card rounded-[32px] p-6 sm:p-8 page-fade">
            <div className="mb-6 flex items-center gap-3">
              <img src="/logo.png" alt="VNAH Logo" className="h-10 shrink-0 object-contain" />
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1E40AF]">VNAH QLDL CTV</p>
            </div>
            <h1 className="mt-3 max-w-lg text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              Xác thực danh tính để xem và điều chỉnh thông tin nhân sự.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Người dùng nhập họ và tên cùng số điện thoại. Nếu khớp với dữ liệu trong CSDL, hệ thống sẽ mở form cho phép xem và cập nhật tên đăng nhập, mật khẩu và thông tin liên hệ.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Họ và tên</span>
                <input
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setEmployeePreview(null);
                  }}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Số điện thoại</span>
                <input
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setEmployeePreview(null);
                  }}
                  placeholder="VD: 0901234567"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <button
                type="button"
                disabled={loadingLookup}
                onClick={async () => {
                  if (!fullName.trim() || !phone.trim()) {
                    pushToast("Vui lòng nhập đầy đủ họ tên và số điện thoại.", "error");
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
                      pushToast(result.message || "Không tìm thấy bản ghi khớp với họ tên và số điện thoại đã nhập.", "error");
                      return;
                    }

                    setEmployeePreview(result.employee || null);
                    pushToast("Xác thực thành công. Bạn có thể mở form điều chỉnh thông tin.", "success");
                  } catch (error) {
                    setEmployeePreview(null);
                    pushToast(error instanceof Error ? error.message : "Không thể xác thực danh tính.", "error");
                  } finally {
                    setLoadingLookup(false);
                  }
                }}
                className="flex w-full items-center justify-center rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingLookup ? <LoadingSpinner label="Đang xác thực danh tính..." /> : "Xác thực thông tin"}
              </button>
            </div>

            {employeePreview ? (
              <div className="mt-6 rounded-[28px] border border-blue-200 bg-blue-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E40AF]">Đã tìm thấy bản ghi</p>
                <p className="mt-2 text-base font-semibold leading-7 text-slate-900">{employeePreview.Name || fullName.trim()}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Bản ghi này khớp với họ tên và số điện thoại đã nhập. Chuyển sang bước tiếp theo để xem và điều chỉnh thông tin nhân sự.
                </p>

                <div className="mt-4 grid gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tên đăng nhập hiện tại</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{employeePreview.ID_Employees || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{employeePreview.Email || "Chưa cập nhật"}</p>
                  </div>
                </div>

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
                  className="mt-4 flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Xem và điều chỉnh thông tin
                </button>
              </div>
            ) : null}
          </section>

          <div className="space-y-6">
            <StepIndicator currentStep={1} />

            <section className="glass-card rounded-[32px] p-6 page-fade">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Quy trình</p>
              <div className="mt-4 space-y-4">
                {[
                  "Nhập họ và tên cùng số điện thoại để xác thực danh tính.",
                  "Xem và điều chỉnh tên đăng nhập, mật khẩu và thông tin liên hệ.",
                  "Lưu và thay đổi dữ liệu.",
                ].map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-[#1E40AF]">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>

              <a
                href="https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-4 text-base font-bold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl"
              >
                🚀 Truy cập ứng dụng CTV
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}