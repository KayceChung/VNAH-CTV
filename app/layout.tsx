import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ServiceWorkerRegistry } from "@/components/ServiceWorkerRegistry";
import { InstallPrompt } from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "VNAH QLDL CTV",
  description: "Hệ thống xác thực danh tính và quản lý thông tin nhân sự",
  manifest: "/manifest.json",
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  ),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VNAH QLDL CTV",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#00a3ff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AuthProvider>
          <InstallPrompt />
          {children}
        </AuthProvider>
        <ServiceWorkerRegistry />
      </body>
    </html>
  );
}