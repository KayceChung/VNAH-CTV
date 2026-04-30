"use client";

import { useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function PasswordForm({
  onSubmit,
}: {
  onSubmit: (payload: { newPassword: string; confirmPassword: string }) => Promise<void>;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="glass-card rounded-[28px] p-6 page-fade"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
          await onSubmit({ newPassword, confirmPassword });
          setNewPassword("");
          setConfirmPassword("");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Bao mat tai khoan</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Dat mat khau moi</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Mat khau moi phai tu 8 ky tu tro len va duoc xac nhan chinh xac truoc khi luu.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Mat khau moi</span>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-100"
            placeholder="Nhap mat khau moi"
            required
            minLength={8}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">Xac nhan mat khau</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1E40AF] focus:ring-4 focus:ring-blue-100"
            placeholder="Nhap lai mat khau moi"
            required
            minLength={8}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#1E40AF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <LoadingSpinner label="Đang lưu mật khẩu..." /> : "Cập nhật mật khẩu"}
      </button>
    </form>
  );
}