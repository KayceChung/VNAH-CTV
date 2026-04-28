import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AppInstallWrapper } from "@/components/AppInstallWrapper";

export const metadata: Metadata = {
  title: "VNAH QLDL CTV",
  description: "Xac thuc danh tinh va doi mat khau nhan su tren Google Sheets.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VNAH",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#00a3ff",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VNAH" />
        <meta name="theme-color" content="#00a3ff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/logo.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <AppInstallWrapper>
          <AuthProvider>{children}</AuthProvider>
        </AppInstallWrapper>
      </body>
    </html>
  );
}