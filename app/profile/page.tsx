"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { callGAS } from "@/lib/api";

type UpdateEmployeeResponse = {
  success: boolean;
  message?: string;
  employee?: {
    ID_Employees: string;
    Name: string;
    DoB: string;
    Sex: string;
    Phone: string;
    Zalo: string;
    Email: string;
    Address: string;
    Branch: string;
    Department: string;
    Title: string;
    Working_at: string;
    Ward: string;
    ID_number: string;
    Status: string;
    Pass_word?: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const { session, pushToast, setSession } = useAuth();
  const [form, setForm] = useState(() => ({
    name: session?.employee.Name || "",
    username: session?.employee.ID_Employees || "",
    password: session?.employee.Pass_word || "",
    email: session?.employee.Email || "",
    address: session?.employee.Address || "",
    zalo: session?.employee.Zalo || "",
  }));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) {
      pushToast("Phiên xác thực không tồn tại. Vui lòng đăng nhập lại.", "error");
      router.replace("/");
    }
  }, [pushToast, router, session]);

  if (!session) {
    return null;
  }

  const employee = session.employee;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.username.trim()) {
      pushToast("Họ tên và tên đăng nhập không được để trống.", "error");
      return;
    }

    if (form.password && form.password.length < 8) {
      pushToast("Mật khẩu cần tối thiểu 8 ký tự.", "error");
      return;
    }

    setSaving(true);

    try {
      const result = await callGAS<UpdateEmployeeResponse>({
        action: "updateEmployee",
        full_name: session.identity.name,
        phone: session.identity.phone,
        updates: {
          name: form.name.trim(),
          username: form.username.trim(),
          password: form.password,
          email: form.email.trim(),
          address: form.address.trim(),
          zalo: form.zalo.trim(),
        },
      });

      if (!result.success || !result.employee) {
        pushToast(result.message || "Không thể cập nhật thông tin.", "error");
        return;
      }

      setSession({
        identity: {
          name: form.name.trim(),
          phone: session.identity.phone,
        },
        employee: result.employee,
      });

      pushToast("Đã lưu thay đổi vào Google Sheets.", "success");
      router.push("/change-password");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Không thể cập nhật thông tin.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center page-fade">
          <h1 className="text-2xl font-bold text-slate-900">{employee.Name}</h1>
          <p className="mt-1 text-sm text-slate-600">Chỉnh sửa thông tin nhân sự</p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Editable Fields Section */}
          <div className="glass-card p-6 page-fade">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Thông tin chỉnh sửa</h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-900 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((current) => ({ ...current, username: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                  Mật khẩu <span className="text-xs text-slate-500">(min 8 ký tự)</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
                  placeholder="Để trống để giữ nguyên"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Zalo */}
              <div>
                <label htmlFor="zalo" className="block text-sm font-semibold text-slate-900 mb-2">
                  Zalo
                </label>
                <input
                  id="zalo"
                  type="text"
                  value={form.zalo}
                  onChange={(e) => setForm((current) => ({ ...current, zalo: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-slate-900 mb-2">
                  Địa chỉ
                </label>
                <input
                  id="address"
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full mt-6 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="spinner" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>

          {/* Read-only Information */}
          <div className="glass-card p-6 page-fade">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Thông tin hồ sơ</h2>
            
            <div className="space-y-3">
              {[
                { label: "Số điện thoại kiểm tra", value: employee.Phone },
                { label: "Ngày sinh", value: employee.DoB },
                { label: "Giới tính", value: employee.Sex },
                { label: "Phòng ban", value: employee.Department },
                { label: "Chức danh", value: employee.Title },
                { label: "Chi nhánh", value: employee.Branch },
                { label: "Nơi làm việc", value: employee.Working_at },
                { label: "Trạng thái", value: employee.Status },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-semibold text-slate-900 text-right max-w-[200px]">
                    {item.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Identity */}
          <div className="glass-card p-6 page-fade border-l-4 border-l-green-500">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-1">
                  Danh tính đã xác thực
                </p>
                <p className="text-sm font-semibold text-slate-900">{session.identity.name}</p>
                <p className="text-xs text-slate-600 mt-1">Điện thoại: {session.identity.phone}</p>
              </div>
            </div>
          </div>

          {/* Next Step Button */}
          <button
            type="button"
            onClick={() => router.push("/change-password")}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:bg-slate-700"
          >
            Bước tiếp theo
          </button>
        </form>
      </div>
    </main>
  );
}