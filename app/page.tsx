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
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-card rounded-[32px] p-6 sm:p-8 page-fade">
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="VNAH Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1E40AF]">VNAH QLDL CTV</p>
            </div>
            <h1 className="mt-3 max-w-lg text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
              Xac thuc danh tinh de xem va dieu chinh thong tin nhan su.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Nguoi dung nhap ho va ten cung so dien thoai. Neu khop voi du lieu trong Google Sheets, he thong se mo form cho phep xem va cap nhat ten dang nhap, mat khau va thong tin lien he.
            </p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Ho va ten</span>
                <input
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setEmployeePreview(null);
                  }}
                  placeholder="VD: Nguyen Van A"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-800">So dien thoai</span>
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
                    pushToast("Vui long nhap day du ho ten va so dien thoai.", "error");
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
                      pushToast(result.message || "Khong tim thay ban ghi khop voi ho ten va so dien thoai da nhap.", "error");
                      return;
                    }

                    setEmployeePreview(result.employee || null);
                    pushToast("Xac thuc thanh cong. Ban co the mo form dieu chinh thong tin.", "success");
                  } catch (error) {
                    setEmployeePreview(null);
                    pushToast(error instanceof Error ? error.message : "Khong the xac thuc danh tinh.", "error");
                  } finally {
                    setLoadingLookup(false);
                  }
                }}
                className="flex w-full items-center justify-center rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingLookup ? <LoadingSpinner label="Dang xac thuc danh tinh..." /> : "Xac thuc thong tin"}
              </button>
            </div>

            {employeePreview ? (
              <div className="mt-6 rounded-[28px] border border-blue-200 bg-blue-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E40AF]">Da tim thay ban ghi</p>
                <p className="mt-2 text-base font-semibold leading-7 text-slate-900">{employeePreview.Name || fullName.trim()}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Ban ghi nay khop voi ho ten va so dien thoai da nhap. Chuyen sang buoc tiep theo de xem va dieu chinh thong tin nhan su.
                </p>

                <div className="mt-4 grid gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ten dang nhap hien tai</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{employeePreview.ID_Employees || "Chua cap nhat"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{employeePreview.Email || "Chua cap nhat"}</p>
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
                  Xem va dieu chinh thong tin
                </button>
              </div>
            ) : null}
          </section>

          <div className="space-y-6">
            <StepIndicator currentStep={1} />

            <section className="glass-card rounded-[32px] p-6 page-fade">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Quy trinh</p>
              <div className="mt-4 space-y-4">
                {[
                  "Nhap ho va ten cung so dien thoai de xac thuc danh tinh.",
                  "Xem va dieu chinh ten dang nhap, mat khau va thong tin lien he.",
                  "Luu thay doi truc tiep ve Google Sheets qua Apps Script.",
                ].map((item, index) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-[#1E40AF]">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}