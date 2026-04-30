"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastViewport } from "@/components/Toast";
import { AppInstallDialog } from "@/components/AppInstallDialog";
import { AppMenu } from "@/components/AppMenu";
import { GuideImageGallery } from "@/components/GuideImageGallery";

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M15 11l1.5 1.5L19 10" />
      </svg>
    ),
    accentColor: "text-[#1E40AF]",
    accentBg: "bg-blue-100",
    borderHover: "hover:border-blue-300",
    badgeColor: "bg-blue-50 text-[#1E40AF]",
    badge: "Tai khoan",
    title: "Kiem tra va thay doi thong tin tai khoan",
    description:
      "Cap nhat va quan ly thong tin ca nhan, mat khau va cac cai dat tai khoan",
    btnLabel: "Truy cap",
    btnClass:
      "bg-[#1E40AF] text-white hover:bg-[#1D4ED8]",
    action: "verify",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h1.5M14 17.5h4M17.5 14v4" />
      </svg>
    ),
    accentColor: "text-red-700",
    accentBg: "bg-red-100",
    borderHover: "hover:border-red-300",
    badgeColor: "bg-red-50 text-red-700",
    badge: "Ung dung",
    title: "Truy cap va cai dat ung dung",
    description:
      "Truy cap ung dung hoac cai dat tren man hinh chinh cua ban",
    btnLabel: "Truy cap",
    btnClass:
      "bg-red-600 text-white hover:bg-red-700",
    action: "appsheet",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
    accentColor: "text-green-700",
    accentBg: "bg-green-100",
    borderHover: "hover:border-green-300",
    badgeColor: "bg-green-50 text-green-700",
    badge: "Dang ky",
    title: "Dang ky tai khoan",
    description: "Tao tai khoan moi de tham gia he thong",
    btnLabel: "Dang ky",
    btnClass:
      "bg-green-600 text-white hover:bg-green-700",
    action: "register",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; tone: "success" | "error" | "info" }>>([]);
  const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false);

  const showToast = (message: string, tone: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, tone }]);
    const duration = tone === "info" && message.includes("HUONG DAN") ? 10000 : 6000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const createDesktopShortcut = async () => {
    try {
      showToast("Dang tai file cai dat...", "info");

      const response = await fetch("/api/create-shortcut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appUrl: "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank",
          appName: "VNAH QLNKT",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "create-appsheet-shortcut.bat";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showToast(
          "File da duoc tai xuong! Hay mo file 'create-appsheet-shortcut.bat' de tao shortcut tren Desktop.",
          "success"
        );
      } else {
        showToast(
          "Loi: Khong the tai file. Hay thu lai.",
          "error"
        );
      }
    } catch (error) {
      showToast(
        `Loi: ${error instanceof Error ? error.message : "Khong biet"}`,
        "error"
      );
    }
  };

  function handleAction(action: string) {
    if (action === "verify") router.push("/verify");
    else if (action === "register") router.push("/register");
    else if (action === "appsheet") {
      window.open("https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce", "_blank");
    }
  }

  const handleInstallConfirm = (appName: string) => {
    showToast("App will be installed!", "success");
    console.log("Install app:", appName);
  };

  return (
    <main className="app-shell px-4 py-10 sm:px-6 lg:px-8">
      {/* Header with Menu */}
      <div className="mx-auto max-w-5xl flex justify-between items-start mb-8">
        <div></div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsInstallDialogOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            title="Cai dat ung dung"
          >
            Download
          </button>
          <AppMenu />
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center gap-10">
        <div className="flex flex-col items-center gap-3 text-center page-fade">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png?v=1"
              alt="VNAH Logo"
              width="48"
              height="48"
              className="h-12 w-12 shrink-0 object-contain"
            />
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1E40AF]">
              VNAH QLDL CTV
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            He thong quan ly cong tac vien
          </h1>
          <p className="max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Chon chuc nang ban can ben duoi de bat dau.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3 page-fade">
          {features.map((feat) => (
            <div
              key={feat.action}
              className={`glass-card flex flex-col rounded-[28px] border border-slate-200/70 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${feat.borderHover} cursor-default`}
            >
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feat.accentBg} ${feat.accentColor}`}>
                {feat.icon}
              </div>

              <span className={`mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${feat.badgeColor}`}>
                {feat.badge}
              </span>

              <h2 className="text-base font-bold leading-snug text-slate-900">
                {feat.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                {feat.description}
              </p>

              <button
                type="button"
                onClick={() => handleAction(feat.action)}
                className={`mt-6 flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition hover:shadow-lg ${feat.btnClass}`}
              >
                {feat.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Section */}
      <GuideImageGallery deviceType="desktop" />
      
      {/* Mobile Phone Guide Section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <GuideImageGallery deviceType="mobile" />
      </div>
      
      {/* App Install Dialog */}
      <AppInstallDialog
        isOpen={isInstallDialogOpen}
        onClose={() => setIsInstallDialogOpen(false)}
        appName="VNAH_QLNKT_VER3.0_PUBLIC"
        appUrl="www.appsheet.com"
        onConfirm={handleInstallConfirm}
      />

      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </main>
  );
}
