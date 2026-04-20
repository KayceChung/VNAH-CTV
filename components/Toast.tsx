"use client";

type ToastItem = {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
};

const toneClasses: Record<ToastItem["tone"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
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
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 shadow-lg ${toneClasses[toast.tone]}`}
          >
            <p className="text-sm font-medium leading-6">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] opacity-70 transition hover:opacity-100"
            >
              Dong
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}