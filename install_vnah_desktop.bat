@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM VNAH Desktop Shortcut Installation Script
REM This script creates a shortcut to VNAH on your desktop and Start Menu

color 0A
cls

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║                                                       ║
echo ║        VNAH - Quản Lý Nhân Kỹ Thuật (QLDL CTV)       ║
echo ║                 Cài Đặt Shortcut Desktop             ║
echo ║                                                       ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠ Lỗi: Cần chạy với quyền Administrator!
    echo.
    echo Vui lòng:
    echo 1. Nhấp chuột phải vào file này
    echo 2. Chọn "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ✓ Quyền Administrator: OK
echo.

REM Get the directory where the script is located
set "SCRIPT_DIR=%~dp0"

REM Ensure we're in the correct directory
if not exist "%SCRIPT_DIR%scripts\ensure_vnah_shortcut.ps1" (
    echo ✗ Lỗi: Không tìm thấy scripts\ensure_vnah_shortcut.ps1
    echo.
    echo Vui lòng đảm bảo rằng:
    echo - File này được đặt trong thư mục gốc của VNAH
    echo - Không move hoặc rename thư mục script
    echo.
    pause
    exit /b 1
)

echo ⏳ Đang tạo shortcut trên Desktop...
echo.

REM Run PowerShell script to create shortcut
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "& '!SCRIPT_DIR!scripts\ensure_vnah_shortcut.ps1'" 2>&1

if errorlevel 1 (
    echo.
    echo ✗ Lỗi: Không thể tạo shortcut!
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓
echo.
echo ✓ Cài đặt thành công!
echo.
echo ✓ VNAH shortcut đã được tạo trên Desktop của bạn
echo.
echo ✓ Bạn có thể:
echo   - Nhấp đúp vào shortcut để mở VNAH
echo   - Di chuyển shortcut đến Start Menu hoặc Quick Launch
echo   - Pin shortcut lên Taskbar (nhấp chuột phải, chọn "Pin to Taskbar")
echo.
echo ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓
echo.

pause

exit /b 0
