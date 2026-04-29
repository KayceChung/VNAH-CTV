@echo off
REM VNAH Desktop Application Installation Wrapper
REM This batch file downloads and runs the PowerShell installation script
REM 
REM Usage: vnah-install.bat [source-url]

setlocal enabledelayedexpansion
chcp 65001 >nul
color 0A
cls

REM Set default source URL (will be replaced with actual URL when downloaded)
set "sourceUrl=https://localhost:3000"
if not "%~1"=="" set "sourceUrl=%~1"

REM Set paths
set "tempDir=%temp%\vnah-install"
set "psScript=%tempDir%\vnah-install.ps1"

REM Create temp directory
if not exist "!tempDir!" mkdir "!tempDir!"

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║      VNAH Desktop Application Installer               ║
echo ║      Quản Lý Nhân Kỹ Thuật (QLDL CTV)                ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if PowerShell is available
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ Lỗi: PowerShell không được tìm thấy!
    echo Vui lòng cài đặt PowerShell trước.
    pause
    exit /b 1
)

echo Đang tải PowerShell installation script...
echo Source: !sourceUrl!
echo Destination: !psScript!
echo.

REM Download PowerShell script using certutil (available in Windows 7+)
certutil -urlcache -split -f "!sourceUrl!/vnah-install.ps1" "!psScript!" >nul 2>&1

if not exist "!psScript!" (
    echo ⚠ Lỗi: Không thể tải script từ !sourceUrl!
    echo.
    echo Vui lòng:
    echo 1. Kiểm tra kết nối Internet
    echo 2. Kiểm tra URL: !sourceUrl!
    echo.
    pause
    exit /b 1
)

echo ✅ Script đã tải thành công
echo.
echo Đang khởi chạy PowerShell installer...
echo.
echo (Cửa sổ PowerShell sẽ hiện ra - hãy chấp nhận các yêu cầu nếu có)
echo.
timeout /t 2 /nobreak

REM Run PowerShell with ByPass execution policy
powershell -ExecutionPolicy Bypass -File "!psScript!"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Cài đặt hoàn tất!
    echo.
) else (
    echo.
    echo ⚠ Cài đặt có lỗi, vui lòng thử lại.
    echo.
)

REM Cleanup
if exist "!tempDir!" (
    timeout /t 3 /nobreak
    rmdir /s /q "!tempDir!" 2>nul
)

pause
endlocal
