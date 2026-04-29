# AppSheet Auto-Installer Landing Page

## Tổng Quan

Landing page mới cung cấp chức năng **tự động phát hiện nền tảng** và **cài đặt ứng dụng AppSheet** mà không cần tác động của người dùng.

---

## Tính Năng Chính

### 1. **Phát Hiện Nền Tảng Tự Động**

Component `AppSheetInstaller` tự động phát hiện loại thiết bị:

| Nền Tảng | Hành Động |
|----------|----------|
| **Windows/Mac/Linux** | Mở AppSheet với `platform=desktop` parameter → Tự động download & cài desktop app |
| **Android** | Mở `appsheet.com/newshortcut` → Cài từ Play Store, thêm icon tự động |
| **iOS** | Mở `appsheet.com/newshortcut` → Hướng dẫn thêm icon vào Home Screen |

### 2. **Quy Trình Auto-Install**

```
Tải trang → Delay 500ms → Hiển thị thông báo "Đang chuẩn bị..."
    ↓
Delay 1.5s → Mở URL AppSheet tương ứng
    ↓
Delay 2s → Hiển thị nút fallback nếu URL không mở
    ↓
iOS → Hiển thị guide modal
```

### 3. **AppSheet URLs**

#### Desktop (Windows/Mac/Linux)
```
https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank
```

#### Mobile (iOS/Android)
```
https://www.appsheet.com/newshortcut/44edd09d-1417-4503-a9aa-26111dd58fce
```

---

## Cấu Trúc Component

### `AppSheetInstaller.tsx`

```tsx
<AppSheetInstaller 
  autoInstall={true}  // Tự động cài khi tải trang (mặc định: true)
  showUI={true}       // Hiển thị notifications (mặc định: true)
/>
```

**Chức năng:**
- `detectPlatform()` - Phát hiện loại thiết bị
- `handleInstall()` - Xử lý cài đặt theo nền tảng
- `trackEvent()` - Ghi log analytics
- Fallback mechanism nếu URL không mở
- iOS guide modal

### Sử Dụng Trong `app/page.tsx`

```tsx
export default function HomePage() {
  const [skipAutoInstall, setSkipAutoInstall] = useState(false);

  useEffect(() => {
    const skipped = sessionStorage.getItem("skipAppSheetInstall");
    if (skipped) {
      setSkipAutoInstall(true);
    }
  }, []);

  return (
    <main className="app-shell px-4 py-10 sm:px-6 lg:px-8">
      {/* Auto-run AppSheet installer */}
      {!skipAutoInstall && <AppSheetInstaller autoInstall={true} showUI={true} />}
      
      {/* Phần còn lại của landing page */}
      ...
    </main>
  );
}
```

---

## Giao Diện & UX

### Notifications

1. **Thông báo chuẩn bị:**
   ```
   🔄 Đang chuyển hướng tới AppSheet để cài đặt ứng dụng desktop...
   ```

2. **Nút Fallback** (nếu cửa sổ không mở)
   ```
   🚀 Mở AppSheet
   ```

3. **Thông báo lỗi** (nếu có)
   ```
   ⚠️ Không thể mở liên kết cài đặt [Thử lại]
   ```

### iOS Guide Modal

Hiển thị hướng dẫn chi tiết 3 bước:
1. Bấm nút Share (⬆️)
2. Chọn "Add to Home Screen"
3. Bấm "Add"

---

## Analytics Tracking

Component tự động ghi log các sự kiện:

```javascript
trackEvent(action, category, label, value)
```

**Các sự kiện được track:**
- `install_initiated` - Bắt đầu cài đặt
- `install_desktop_initiated` - Desktop cài đặt bắt đầu
- `install_android_initiated` - Android cài đặt bắt đầu
- `install_ios_initiated` - iOS cài đặt bắt đầu
- `install_url_opened` - URL mở thành công
- `install_url_error` - Lỗi mở URL
- `install_fallback_shown` - Hiển thị nút fallback
- `install_fallback_clicked` - User click fallback button
- `install_error` - Lỗi cài đặt

**Để enable Google Analytics:**
```html
<!-- Thêm vào app/layout.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## Tùy Chỉnh

### Vô Hiệu Hóa Auto-Install

```tsx
// Skip auto-install lần này
sessionStorage.setItem("skipAppSheetInstall", "true");

// Clear để enable lại
sessionStorage.removeItem("skipAppSheetInstall");
```

### Thay Đổi URLs

Edit `APPSHEET_CONFIG` trong `components/AppSheetInstaller.tsx`:

```ts
const APPSHEET_CONFIG = {
  baseURL: "https://www.appsheet.com/start/...",
  desktopURL: "https://www.appsheet.com/start/...?platform=desktop#...",
  mobileURL: "https://www.appsheet.com/newshortcut/...",
};
```

### Thay Đổi Delays

```ts
const REDIRECT_DELAY = 1500; // ms - delay trước khi mở URL
```

---

## Lưu Ý

1. **Popup Blocker:** Một số trình duyệt có thể chặn popup. Người dùng cần allow popup cho trang.
2. **CORS:** AppSheet URL được mở qua `window.open()` với `noopener,noreferrer` flags.
3. **Mobile:** Trên mobile, `window.open()` thường mở tab mới thay vì popup.
4. **SessionStorage:** `skipAppSheetInstall` được lưu trong session, sẽ được xóa khi đóng tab.

---

## Testing

### Manual Testing

**Desktop:**
1. Mở `http://localhost:3000` trên Windows/Mac/Linux
2. Xác nhận AppSheet URL được mở tự động

**Mobile:**
1. Mở `http://localhost:3000` trên Android/iOS
2. Xác nhận AppSheet được mở từ Play Store / App Store
3. iOS: Xác nhận guide modal hiển thị

### Disable Auto-Install

Mở DevTools console:
```javascript
sessionStorage.setItem("skipAppSheetInstall", "true");
location.reload();
```

---

## File Structure

```
components/
├── AppSheetInstaller.tsx     ← Component chính
app/
├── page.tsx                  ← Import & sử dụng AppSheetInstaller
├── layout.tsx                ← Root layout
└── globals.css               ← Animations (fadeInZoom)
```

---

## Build & Deploy

```bash
# Build
npm run build

# Start production server
npm start

# Develop locally
npm run dev
```

Project đã build thành công ✓
