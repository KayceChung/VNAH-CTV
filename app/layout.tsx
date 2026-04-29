import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ServiceWorkerRegistry } from "@/components/ServiceWorkerRegistry";

export const metadata: Metadata = {
  title: "VNAH QLDL CTV",
  description: "Hệ thống xác thực danh tính và quản lý thông tin nhân sự",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VNAH QLDL CTV",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <ServiceWorkerRegistry />
      </body>
    </html>
  );
}