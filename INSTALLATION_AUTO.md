# Hướng Dẫn Cài Đặt Tự Động VNAH

## Tổng Quan

Ứng dụng VNAH hiện nay hỗ trợ cài đặt tự động trên các thiết bị khác nhau:

- **Windows/Laptop**: Tải về và cài đặt ứng dụng desktop
- **iOS**: Thêm vào màn hình chính (PWA - Progressive Web App)
- **Android**: Cài đặt ứng dụng web hoặc thêm vào màn hình chính

## Cách Hoạt Động

### 1. Phát Hiện Thiết Bị (Device Detection)

Khi người dùng truy cập vào ứng dụng, hệ thống sẽ:

1. **Phát hiện loại thiết bị** (Windows, iOS, Android, Mac, Linux)
2. **Kiểm tra trạng thái cài đặt** (đã cài hay chưa)
3. **Hiển thị thông báo phù hợp** với từng thiết bị

### 2. Windows / Laptop

**Tự động hiển thị:**
- Thông báo "Cài đặt VNAH trên máy tính"
- Nút "Tải về và Cài đặt"
- Nút "Không phải bây giờ"

**Khi bấm "Tải về và Cài đặt":**
1. Tự động tải file `VNAH_Installer.exe`
2. Người dùng chạy trình cài đặt
3. Ứng dụng được cài vào `Program Files\VNAH`
4. Tạo shortcut trên Desktop
5. Tạo mục trong Start Menu

**Lợi ích:**
- ✅ Truy cập nhanh từ Desktop
- ✅ Tích hợp với hệ thống Windows
- ✅ Có thể mở từ Start Menu
- ✅ Hỗ trợ Add/Remove Programs

### 3. iOS

**Tự động hiển thị:**
- Thông báo "Thêm VNAH vào Màn hình chính"
- Hướng dẫn 4 bước chi tiết bằng Tiếng Việt

**Hướng dẫn cài đặt:**

1. **Nhấn nút chia sẻ (Share)**
   - Nhấn nút mũi tên vuông ở thanh công cụ dưới cùng

2. **Chọn "Thêm vào Màn hình chính"**
   - Cuộn sang phải nếu không thấy ngay

3. **Nhập tên: VNAH**
   - Có thể giữ tên mặc định hoặc đổi theo ý

4. **Nhấn "Thêm" (Add)**
   - Ở góc trên cùng bên phải

**Lợi ích:**
- ✅ Truy cập nhanh từ màn hình chính
- ✅ Hoạt động như ứng dụng native
- ✅ Có thể làm việc offline (với cache)
- ✅ Không cần đến App Store

### 4. Android

**Tự động hiển thị:**
- Thông báo "Cài đặt Ứng dụng VNAH"
- Hướng dẫn 3 bước chi tiết bằng Tiếng Việt
- Nút "Cài đặt" (nếu hỗ trợ)
- Nút "Không phải bây giờ"

**Hướng dẫn cài đặt (Cách 1 - Tự động):**

1. **Bấm nút "Cài đặt"** trong thông báo
2. Hệ thống sẽ tự động cài đặt
3. Biểu tượng ứng dụng xuất hiện trên màn hình chính

**Hướng dẫn cài đặt (Cách 2 - Thủ công):**

1. **Mở menu (ba dấu chấm)**
   - Ở góc trên cùng bên phải

2. **Chọn "Cài đặt ứng dụng này"**
   - Hoặc "Thêm vào màn hình chính"

3. **Xác nhận để hoàn tất**
   - Biểu tượng sẽ xuất hiện trên màn hình chính

**Lợi ích:**
- ✅ Truy cập nhanh từ màn hình chính
- ✅ Hoạt động như ứng dụng native
- ✅ Có thể làm việc offline
- ✅ Không cần đến Play Store

## Các Tệp Được Tạo/Cập Nhật

### Phía Backend:
- `lib/deviceDetection.ts` - Phát hiện thiết bị
- `components/InstallationPrompt.tsx` - Thông báo cài đặt
- `components/AppInstallWrapper.tsx` - Wrapper để bao bọc ứng dụng
- `lib/useServiceWorkerRegistration.ts` - Đăng ký Service Worker

### Phía Frontend (Public):
- `public/sw.js` - Service Worker cho hỗ trợ offline
- `public/manifest.json` - Cập nhật PWA manifest

### Cập nhật Hiện Có:
- `app/layout.tsx` - Thêm meta tags PWA
- `context/AuthContext.tsx` - Đăng ký Service Worker

## Cách Kiểm Thử

### 1. Kiểm Thử Trên Desktop (Windows):
```bash
npm run dev
# Truy cập http://localhost:3000
# Bạn sẽ thấy thông báo "Cài đặt VNAH trên máy tính"
```

### 2. Kiểm Thử Trên iOS (Simulator hoặc Device):
```bash
# Truy cập từ Safari
# Thông báo sẽ hiển thị: "Thêm VNAH vào Màn hình chính"
```

### 3. Kiểm Thử Trên Android (Emulator hoặc Device):
```bash
# Truy cập từ Chrome
# Thông báo sẽ hiển thị: "Cài đặt Ứng dụng VNAH"
```

## Cách Bỏ Cài Đặt PWA

### Trên iOS:
1. Chạm và giữ biểu tượng ứng dụng
2. Chọn "Xóa" hoặc "Remove App"

### Trên Android:
1. Chạm và giữ biểu tượng ứng dụng
2. Chọn "Gỡ cài đặt" hoặc "Uninstall"

### Trên Windows:
1. Mở "Bảng điều khiển" (Control Panel)
2. Chọn "Chương trình và tính năng" (Programs and Features)
3. Tìm "VNAH"
4. Chọn "Gỡ cài đặt" (Uninstall)

## Lưu Ý Quan Trọng

1. **PWA Manifest**: Đã cập nhật để hỗ trợ cả iOS và Android
2. **Service Worker**: Cho phép ứng dụng hoạt động offline
3. **Device Detection**: Tự động phát hiện loại thiết bị
4. **Thông báo Tự Động**: Hiển thị khi lần đầu truy cập (có thể tắt)

## Cấu Hình PWA

Nếu muốn tùy chỉnh:

1. **Tên ứng dụng**: Sửa `manifest.json` → `name`
2. **Biểu tượng**: Thay thế `/public/logo.png` và `/public/logo.ico`
3. **Màu sắc**: Sửa `theme_color` trong `manifest.json`
4. **URL bắt đầu**: Sửa `start_url` trong `manifest.json`

## Hỗ Trợ

Nếu có vấn đề:
- Xóa cache trình duyệt
- Cập nhật Service Worker (F5 hoặc Ctrl+F5)
- Kiểm tra console có lỗi không
