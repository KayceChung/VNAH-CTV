"use client";

import { useEffect, useState } from "react";

type ToastItem = {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
};

const toneConfig: Record<ToastItem["tone"], { bg: string; border: string; icon: string }> = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "✓",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "✕",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "ℹ",
  },
};

const toneTextConfig: Record<ToastItem["tone"], string> = {
  success: "text-emerald-900",
  error: "text-red-900",
  info: "text-blue-900",
};

const toneIconBgConfig: Record<ToastItem["tone"], string> = {
  success: "bg-emerald-200",
  error: "bg-red-200",
  info: "bg-blue-200",
};

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-md flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const config = toneConfig[toast.tone];
  const textColor = toneTextConfig[toast.tone];
  const iconBgColor = toneIconBgConfig[toast.tone];

  return (
    <div
      className={`pointer-events-auto transform transition-all duration-300 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`flex items-start gap-3 rounded-2xl border-2 ${config.border} ${config.bg} px-4 py-3 shadow-lg backdrop-blur-sm`}
      >
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold text-sm ${iconBgColor}`}
        >
          {config.icon}
        </div>
        <p className={`flex-1 text-sm font-medium leading-6 ${textColor}`}>
          {toast.message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition hover:opacity-100 ${textColor} opacity-70`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}