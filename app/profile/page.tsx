"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/StepIndicator";
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
      pushToast("Phien xac thuc khong ton tai. Vui long dang nhap lai.", "error");
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
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Ho so nhan su</p>
                <h2 className="text-xl font-bold text-slate-950">{employee.Name || "Thong tin nhan vien"}</h2>
              </div>
              <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#1E40AF]">Co the chinh sua</div>
            </div>

            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={async (event) => {
                event.preventDefault();

                if (!form.name.trim() || !form.username.trim()) {
                  pushToast("Ho ten va ten dang nhap khong duoc de trong.", "error");
                  return;
                }

                if (form.password && form.password.length < 8) {
                  pushToast("Mat khau can toi thieu 8 ky tu.", "error");
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
                    pushToast(result.message || "Khong the cap nhat thong tin.", "error");
                    return;
                  }

                  setSession({
                    identity: {
                      name: form.name.trim(),
                      phone: session.identity.phone,
                    },
                    employee: result.employee,
                  });

                  pushToast("Da luu thay doi vao Google Sheets.", "success");
                  router.push("/change-password");
                } catch (error) {
                  pushToast(error instanceof Error ? error.message : "Khong the cap nhat thong tin.", "error");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {[
                { key: "name", label: "Ho va ten", value: form.name },
                { key: "username", label: "Ten dang nhap", value: form.username },
                { key: "password", label: "Mat khau", value: form.password, type: "password" },
                { key: "email", label: "Email", value: form.email, type: "email" },
                { key: "zalo", label: "Zalo", value: form.zalo },
                { key: "address", label: "Dia chi", value: form.address },
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
                  { label: "So dien thoai doi chieu", value: employee.Phone },
                  { label: "Ngay sinh", value: employee.DoB },
                  { label: "Gioi tinh", value: employee.Sex },
                  { label: "Chi nhanh", value: employee.Branch },
                  { label: "Phong ban", value: employee.Department },
                  { label: "Chuc danh", value: employee.Title },
                  { label: "Noi lam viec", value: employee.Working_at },
                  { label: "Trang thai", value: employee.Status },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{item.value || "Chua cap nhat"}</p>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="sm:col-span-2 mt-2 flex w-full items-center justify-center rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Dang luu thay doi..." : "Luu thong tin va tiep tuc"}
              </button>
            </form>
          </section>

          <section className="glass-card rounded-[28px] p-6 page-fade">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Tiep theo</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Dang sua truc tiep tren Google Sheets</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Sau khi doi chieu ho ten va so dien thoai thanh cong, ban co the cap nhat ten dang nhap, mat khau va mot so thong tin lien he. Nut luu se ghi truc tiep ve Google Sheets thong qua Apps Script.
            </p>

            <div className="mt-6 rounded-3xl border border-blue-200 bg-blue-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E40AF]">Danh tinh da xac thuc</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{session.identity.name}</p>
              <p className="mt-1 text-sm text-slate-600">So dien thoai doi chieu: {session.identity.phone}</p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/change-password")}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Den buoc hoan tat
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}