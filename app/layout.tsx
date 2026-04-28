import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ServiceWorkerRegistry } from "@/components/ServiceWorkerRegistry";

export const metadata: Metadata = {
  title: "VNAH QLNKT PUBLIC",
  description: "Xac thuc danh tinh va doi mat khau nhan su tren Google Sheets.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VNAH QLNKT PUBLIC",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VNAH QLNKT PUBLIC" />
        <link rel="icon" href="/logo.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <ServiceWorkerRegistry />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}