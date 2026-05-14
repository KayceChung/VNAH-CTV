"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/StepIndicator";
import { useAuth } from "@/context/AuthContext";
import { callGAS } from "@/lib/api";

// Title mapping (Code -> Name)
const TITLE_MAP: Record<number, string> = {
  7: "Nhân viên",
  13: "Điều dưỡng",
  14: "KTV",
  10: "Bác sĩ",
  11: "CTV",
  12: "Y sĩ",
  15: "Khác",
};

// Department mapping (Code -> Name)
const DEPARTMENT_MAP: Record<number, string> = {
  1: "Phòng Điều hành",
  2: "Phòng Tài chính",
  3: "Phòng Nhân sự",
  4: "Phòng IT",
  5: "Phòng Kỹ thuật",
};

// Format date to dd/mm/yyyy, removing time
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return dateStr;
  }
}

// Decode Title ID to name
function getTitleName(titleId: string | number): string {
  const id = typeof titleId === "string" ? parseInt(titleId, 10) : titleId;
  return TITLE_MAP[id] || String(titleId);
}

// Decode Department ID to name
function getDepartmentName(deptId: string | number): string {
  const id = typeof deptId === "string" ? parseInt(deptId, 10) : deptId;
  return DEPARTMENT_MAP[id] || String(deptId);
}

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

  return (
    <main className="app-shell px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center gap-6">
        <StepIndicator currentStep={2} />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-card rounded-[28px] p-6 page-fade">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Hồ sơ nhân sự</p>
                <h2 className="text-xl font-bold text-slate-950">{employee.Name || "Thông tin nhân viên"}</h2>
              </div>
              <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#1E40AF]">Có thể chỉnh sửa</div>
            </div>

            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={async (event) => {
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
              }}
            >
              {[
                { key: "name", label: "Họ và tên", value: form.name },
                { key: "username", label: "Tên đăng nhập", value: form.username },
                { key: "password", label: "Mật khẩu", value: form.password, type: "password" },
                { key: "email", label: "Email", value: form.email, type: "email" },
                { key: "zalo", label: "Zalo", value: form.zalo },
                { key: "address", label: "Địa chỉ", value: form.address },
              ].map((field) => (
                <label key={field.key} className={`block ${field.key === "address" ? "sm:col-span-2" : ""}`}>
                  <span className="mb-2 block text-sm font-semibold text-slate-800">{field.label}</span>
                  <input
                    type={field.type || "text"}
                    value={field.value}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              ))}

              <div className="sm:col-span-2 grid gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4 sm:grid-cols-2">
                {[
                  { label: "Số điện thoại đối chiếu", value: employee.Phone },
                  { label: "Ngày sinh", value: formatDate(employee.DoB) },
                  { label: "Giới tính", value: employee.Sex },
                  { label: "Chi nhánh", value: employee.Branch },
                  { label: "Phòng ban", value: getDepartmentName(employee.Department) },
                  { label: "Chức danh", value: getTitleName(employee.Title) },
                  { label: "Nơi làm việc", value: employee.Working_at },
                  { label: "Trạng thái", value: employee.Status },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{item.value || "Chưa cập nhật"}</p>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="sm:col-span-2 mt-2 flex w-full items-center justify-center rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Đang lưu thay đổi..." : "Lưu thông tin và tiếp tục"}
              </button>
            </form>
          </section>

          <section className="glass-card rounded-[28px] p-6 page-fade">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Tiếp theo</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Đang sửa trực tiếp trên Google Sheets</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sau khi đối chiếu họ tên và số điện thoại thành công, bạn có thể cập nhật tên đăng nhập, mật khẩu và một số thông tin liên hệ. Nút lưu sẽ ghi trực tiếp vào Google Sheets thông qua Apps Script.
            </p>

            <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E40AF]">Danh tính đã xác thực</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{session.identity.name}</p>
              <p className="mt-1 text-sm text-slate-600">Số điện thoại đối chiếu: {session.identity.phone}</p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/change-password")}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Đến bước hoàn tất
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}