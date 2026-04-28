"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const APPSHEET_URL =
  "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce";

// AppSheet-provided URL: installs AppSheet app then adds icon to home screen
const MOBILE_INSTALL_URL =
  "https://www.appsheet.com/newshortcut/44edd09d-1417-4503-a9aa-26111dd58fce";

const LOCAL_INSTALL_PROTOCOL = "vnahshortcut://install";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

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
    badge: "Tài khoản",
    title: "Kiểm tra & thay đổi thông tin tài khoản",
    description:
      "Cập nhật và quản lý thông tin cá nhân, mật khẩu và các cài đặt tài khoản",
    btnLabel: "Truy cập",
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
    badge: "Ứng dụng",
    title: "Truy cập ứng dụng",
    description:
      "Đăng nhập và truy cập các ứng dụng quản lý của hệ thống",
    btnLabel: "Truy cập",
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
    badge: "Đăng ký",
    title: "Đăng ký tài khoản",
    description: "Tạo tài khoản mới để tham gia hệ thống",
    btnLabel: "Đăng ký",
    btnClass:
      "bg-green-600 text-white hover:bg-green-700",
    action: "register",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [installHint, setInstallHint] = useState("");
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  function handleAction(action: string) {
    if (action === "verify") router.push("/verify");
    else if (action === "register") router.push("/register");
    else if (action === "appsheet") window.open(APPSHEET_URL, "_blank", "noopener,noreferrer");
  }

  const handleInstallShortcut = async () => {
    if (installing) {
      return;
    }

    setInstalling(true);

    try {
      const ua = navigator.userAgent.toLowerCase();
      const isWindowsDesktop = /windows nt/.test(ua) && !/android|iphone|ipad|ipod/.test(ua);
      const isAndroid = /android/.test(ua);
      const isIOS = /iphone|ipad|ipod/.test(ua);

      // On Windows, always prioritize OS-level shortcut installer protocol.
      if (isWindowsDesktop) {
        setInstallHint("Dang goi trinh cai shortcut tren may tinh... Neu chua cai protocol, hay chay setup_vnah_oneclick_protocol.bat mot lan.");

        const protocolLink = document.createElement("a");
        protocolLink.href = LOCAL_INSTALL_PROTOCOL;
        protocolLink.style.display = "none";
        document.body.appendChild(protocolLink);
        protocolLink.click();
        protocolLink.remove();

        // Fallback: if protocol not registered, open browser install URL
        window.setTimeout(() => {
          window.open(MOBILE_INSTALL_URL, "_blank", "noopener,noreferrer");
        }, 1200);

        return;
      }

      // Android: AppSheet newshortcut URL installs the AppSheet app (via Play Store
      // if needed) then automatically adds the app icon to the home screen.
      if (isAndroid) {
        setInstallHint("Dang chuyen den Play Store / AppSheet de cai dat va them icon...");
        window.open(MOBILE_INSTALL_URL, "_blank", "noopener,noreferrer");
        return;
      }

      // iOS: AppSheet newshortcut URL redirects to App Store if AppSheet not
      // installed, then guides user to add the icon. Show a brief popup.
      if (isIOS) {
        setInstallHint("Da mo AppSheet. Lam theo huong dan popup de hoan tat.");
        setShowIosGuide(true);
        window.open(MOBILE_INSTALL_URL, "_blank", "noopener,noreferrer");
        return;
      }

      // Other mobile/desktop without Windows protocol: open install URL directly.
      setInstallHint("Dang mo lien ket cai dat AppSheet...");
      window.open(MOBILE_INSTALL_URL, "_blank", "noopener,noreferrer");
    } finally {
      setInstalling(false);
    }
  };

  return (
    <main className="app-shell px-4 py-10 sm:px-6 lg:px-8">
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
            Hệ thống quản lý cộng tác viên
          </h1>
          <p className="max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Chọn chức năng bạn cần bên dưới để bắt đầu.
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

              {feat.action === "appsheet" ? (
                <button
                  type="button"
                  onClick={handleInstallShortcut}
                  disabled={installing}
                  className="mt-3 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] px-4 py-[14px] text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {installing ? "Dang xu ly..." : "Cai dat ung dung"}
                </button>
              ) : null}
            </div>
          ))}
        </div>

        {installHint ? (
          <p className="mt-4 whitespace-pre-line text-center text-sm font-medium text-slate-600">{installHint}</p>
        ) : null}
      </div>

      {showIosGuide ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4" role="dialog" aria-modal="true" aria-label="Huong dan cai dat tren iPhone">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Cai dat icon tren iPhone / iPad</h2>
            <p className="mt-2 text-sm text-slate-600">
              AppSheet da duoc mo. Lam theo 3 buoc de them icon ra man hinh chinh:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>Trong app AppSheet vua mo, bam nut <strong>Share</strong> (hinh vuong co mui ten &uarr;).</li>
              <li>Chon <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
              <li>Bam <strong>&ldquo;Add&rdquo;</strong> — icon se hien ngay tren man hinh chinh.</li>
            </ol>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="rounded-xl bg-[#1E40AF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
              >
                Da hieu
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
