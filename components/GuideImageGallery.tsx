"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface GuideImage {
  src: string;
  alt: string;
  title: string;
}

interface GuideImageGalleryProps {
  images?: GuideImage[];
  deviceType?: "desktop" | "mobile" | "both";
}

export function GuideImageGallery({ 
  images,
  deviceType = "both" 
}: GuideImageGalleryProps) {
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">(
    deviceType === "mobile" ? "mobile" : "desktop"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Reset to appropriate tab when deviceType changes
    if (deviceType !== "both") {
      setActiveTab(deviceType as "desktop" | "mobile");
      setCurrentImageIndex(0);
    }
  }, [deviceType]);

  // Auto-switch tabs based on screen size when deviceType is "both"
  useEffect(() => {
    if (deviceType !== "both" || !isHydrated) return;

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActiveTab("mobile");
      } else {
        setActiveTab("desktop");
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [deviceType, isHydrated]);

  // Default desktop images
  const desktopImages: GuideImage[] = images || [
    {
      src: "/images/guide-desktop1.png",
      alt: "Hướng dẫn Desktop - Bước 1",
      title: "Bước 1: Truy cập trang chủ",
    },
    {
      src: "/images/guide-desktop2.png",
      alt: "Hướng dẫn Desktop - Bước 2",
      title: "Bước 2: Đăng nhập tài khoản",
    },
    {
      src: "/images/guide-desktop3.png",
      alt: "Hướng dẫn Desktop - Bước 3",
      title: "Bước 3: Chọn chức năng",
    },
    {
      src: "/images/guide-desktop4.png",
      alt: "Hướng dẫn Desktop - Bước 4",
      title: "Bước 4: Hoàn tất",
    },
    {
      src: "/images/guide-desktop5.png",
      alt: "Hướng dẫn Desktop - Bước 5",
      title: "Bước 5: Xem kết quả",
    },
  ];

  const mobileImages: GuideImage[] = [
    {
      src: "/images/guide-mobile1.jpg",
      alt: "Hướng dẫn Mobile - Bước 1",
      title: "Bước 1: Cài đặt ứng dụng",
    },
    {
      src: "/images/guide-mobile2.jpg",
      alt: "Hướng dẫn Mobile - Bước 2",
      title: "Bước 2: Mở ứng dụng",
    },
    {
      src: "/images/guide-mobile3.jpg",
      alt: "Hướng dẫn Mobile - Bước 3",
      title: "Bước 3: Đăng nhập tài khoản",
    },
    {
      src: "/images/guide-mobile4.jpg",
      alt: "Hướng dẫn Mobile - Bước 4",
      title: "Bước 4: Xác nhận thông tin",
    },
    {
      src: "/images/guide-mobile5.jpg",
      alt: "Hướng dẫn Mobile - Bước 5",
      title: "Bước 5: Chọn chức năng",
    },
    {
      src: "/images/guide-mobile6.jpg",
      alt: "Hướng dẫn Mobile - Bước 6",
      title: "Bước 6: Xem chi tiết",
    },
    {
      src: "/images/guide-mobile7.jpg",
      alt: "Hướng dẫn Mobile - Bước 7",
      title: "Bước 7: Cập nhật thông tin",
    },
    {
      src: "/images/guide-mobile8.jpg",
      alt: "Hướng dẫn Mobile - Bước 8",
      title: "Bước 8: Lưu thay đổi",
    },
    {
      src: "/images/guide-mobile9.jpg",
      alt: "Hướng dẫn Mobile - Bước 9",
      title: "Bước 9: Xác nhận lưu",
    },
    {
      src: "/images/guide-mobile10.jpg",
      alt: "Hướng dẫn Mobile - Bước 10",
      title: "Bước 10: Hoàn tất",
    },
    {
      src: "/images/guide-mobile11.jpg",
      alt: "Hướng dẫn Mobile - Bước 11",
      title: "Bước 11: Xem kết quả",
    },
  ];

  const currentImages = activeTab === "desktop" ? desktopImages : mobileImages;
  const currentImage = currentImages[currentImageIndex];

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="w-full py-8 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        {isHydrated && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {deviceType === "mobile" ? "📱 Hướng dẫn sử dụng trên điện thoại" : deviceType === "desktop" ? "💻 Hướng dẫn sử dụng trên Desktop" : activeTab === "mobile" ? "📱 Hướng dẫn sử dụng trên điện thoại" : "💻 Hướng dẫn sử dụng trên Desktop"}
            </h2>
            <p className="text-slate-600">
              {deviceType === "both" ? "Chọn loại thiết bị để xem hướng dẫn chi tiết" : `${deviceType === "mobile" ? "Hướng dẫn chi tiết cài đặt trên điện thoại" : "Hướng dẫn chi tiết cài đặt trên Desktop"}`}
            </p>
          </div>
        )}

        {/* Device Tabs */}
        {deviceType === "both" && isHydrated && (
          <div className="flex gap-2 mb-6 justify-center">
            <button
              onClick={() => {
                setActiveTab("desktop");
                setCurrentImageIndex(0);
              }}
              className={`px-6 py-2 font-semibold rounded-lg transition ${
                activeTab === "desktop"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              💻 Desktop
            </button>
            <button
              onClick={() => {
                setActiveTab("mobile");
                setCurrentImageIndex(0);
              }}
              className={`px-6 py-2 font-semibold rounded-lg transition ${
                activeTab === "mobile"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              📱 Mobile Phone
            </button>
          </div>
        )}

        {/* Image Gallery */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
          {/* Main Image */}
          <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
            {isHydrated && (
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            )}
            
            {/* Placeholder text if image doesn't exist yet */}
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-center pointer-events-none">
              <div>
                <p className="text-lg font-semibold">{currentImage.title}</p>
                <p className="text-sm">(Cho anh duoc tai len)</p>
              </div>
            </div>
          </div>

          {/* Image Title */}
          <p className="text-center text-lg font-semibold text-slate-900 mb-4">
            {currentImage.title}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
            >
              ← Trước
            </button>

            {/* Step Indicators */}
            <div className="flex gap-2">
              {currentImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-10 h-10 rounded-full font-semibold text-sm transition ${
                    index === currentImageIndex
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Tiếp →
            </button>
          </div>

          {/* Step Info */}
          <p className="text-center text-sm text-slate-600 mt-4">
            Bước {currentImageIndex + 1} / {currentImages.length}
          </p>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-1">💡 Mẹo</p>
            <p className="text-sm text-blue-800">
              Bạn có thể nhấp vào các số để chuyển đến bước cụ thể
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-900 mb-1">📚 Hỗ trợ</p>
            <p className="text-sm text-green-800">
              Nếu cần giúp đỡ, liên hệ với bộ phận hỗ trợ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
