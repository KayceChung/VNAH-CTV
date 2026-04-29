# VNAH Desktop App Installation Script
# This script creates a desktop shortcut to VNAH AppSheet application
# Run with: powershell -ExecutionPolicy Bypass -File vnah-install.ps1

param(
  [string]$InstallMode = "shortcut"  # shortcut, protocol, full
)

# Enable UTF-8 for Vietnamese characters
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Define paths
$desktopPath = [Environment]::GetFolderPath("Desktop")
$appDataPath = [Environment]::GetFolderPath("ApplicationData")
$vnah_AppFolder = Join-Path $appDataPath "VNAH"
$shortcutPath = Join-Path $desktopPath "VNAH_QLNKT_VER30_PUBLIC.lnk"
$targetUrl = "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank"

# Colors for console output
$colors = @{
  "Success" = "Green"
  "Error" = "Red"
  "Info" = "Cyan"
  "Warning" = "Yellow"
}

function Write-ColorOutput($message, $type = "Info") {
  $color = $colors[$type] ?? "White"
  Write-Host $message -ForegroundColor $color
}

function Create-VnahFolder {
  if (-not (Test-Path $vnah_AppFolder)) {
    New-Item -ItemType Directory -Path $vnah_AppFolder -Force | Out-Null
    Write-ColorOutput "✅ Tạo thư mục: $vnah_AppFolder" "Success"
  }
}

function Create-DesktopShortcut {
  Write-ColorOutput "Đang tạo shortcut trên Desktop..." "Info"
  
  # Create WshShell object to create shortcut
  $wshShell = New-Object -ComObject WScript.Shell
  $shortcut = $wshShell.CreateShortCut($shortcutPath)
  
  # Set shortcut properties
  $shortcut.TargetPath = "chrome.exe"  # Use default browser
  $shortcut.Arguments = "--app=`"$targetUrl`""
  $shortcut.WorkingDirectory = [Environment]::GetFolderPath("MyDocuments")
  $shortcut.Description = "VNAH - Quản Lý Nhân Kỹ Thuật (QLDL CTV)"
  
  # Try to set icon from AppSheet or use system globe icon
  try {
    # Try Chrome icon first
    $chromeIconPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    if (Test-Path $chromeIconPath) {
      $shortcut.IconLocation = "$chromeIconPath,0"
    } else {
      # Fallback to Windows globe icon
      $shortcut.IconLocation = "$env:SystemRoot\System32\SHELL32.dll,220"
    }
  } catch {
    Write-ColorOutput "Cảnh báo: Không thể đặt icon tùy chỉnh, sẽ dùng mặc định" "Warning"
  }
  
  # Save shortcut
  $shortcut.Save()
  Write-ColorOutput "✅ Shortcut đã tạo: $shortcutPath" "Success"
}

function Create-StartMenuShortcut {
  Write-ColorOutput "Đang tạo shortcut trong Start Menu..." "Info"
  
  $startMenuPath = Join-Path $appDataPath "Microsoft\Windows\Start Menu\Programs\VNAH"
  if (-not (Test-Path $startMenuPath)) {
    New-Item -ItemType Directory -Path $startMenuPath -Force | Out-Null
  }
  
  $menuShortcutPath = Join-Path $startMenuPath "VNAH_QLNKT_VER30_PUBLIC.lnk"
  
  $wshShell = New-Object -ComObject WScript.Shell
  $menuShortcut = $wshShell.CreateShortCut($menuShortcutPath)
  
  $menuShortcut.TargetPath = "chrome.exe"
  $menuShortcut.Arguments = "--app=`"$targetUrl`""
  $menuShortcut.WorkingDirectory = [Environment]::GetFolderPath("MyDocuments")
  $menuShortcut.Description = "VNAH - Quản Lý Nhân Kỹ Thuật (QLDL CTV)"
  
  try {
    $chromeIconPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    if (Test-Path $chromeIconPath) {
      $menuShortcut.IconLocation = "$chromeIconPath,0"
    } else {
      $menuShortcut.IconLocation = "$env:SystemRoot\System32\SHELL32.dll,220"
    }
  } catch {
    Write-ColorOutput "Cảnh báo: Không thể đặt icon cho Start Menu shortcut" "Warning"
  }
  
  $menuShortcut.Save()
  Write-ColorOutput "✅ Shortcut Start Menu đã tạo: $menuShortcutPath" "Success"
}

function Register-UrlProtocol {
  Write-ColorOutput "Đang đăng ký custom protocol: vnahapp://" "Info"
  
  $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.vnahapp\UserChoice"
  
  # Register vnahapp protocol
  $protocolPath = "HKCU:\Software\Classes\vnahapp"
  
  # Create registry entries
  if (-not (Test-Path $protocolPath)) {
    New-Item -Path $protocolPath -Force | Out-Null
    New-ItemProperty -Path $protocolPath -Name "(Default)" -Value "URL:VNAH Application" -PropertyType String -Force | Out-Null
    New-ItemProperty -Path $protocolPath -Name "URL Protocol" -Value "" -PropertyType String -Force | Out-Null
    
    # Add shell command
    $shellPath = Join-Path $protocolPath "shell\open\command"
    New-Item -Path $shellPath -Force | Out-Null
    New-ItemProperty -Path $shellPath -Name "(Default)" -Value "`"chrome.exe`" --app=`"$targetUrl`"" -PropertyType String -Force | Out-Null
    
    Write-ColorOutput "✅ Protocol vnahapp:// đã đăng ký thành công" "Success"
  }
}

function Show-Summary {
  Write-Host ""
  Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
  Write-Host "║         ✅ CÀI ĐẶT HOÀN TẤT                          ║" -ForegroundColor Cyan
  Write-Host "║                                                       ║" -ForegroundColor Cyan
  Write-Host "║  Các thành phần được cài đặt:                        ║" -ForegroundColor Cyan
  Write-Host "║  ✓ Desktop Shortcut                                  ║" -ForegroundColor Cyan
  Write-Host "║  ✓ Start Menu Shortcut                               ║" -ForegroundColor Cyan
  Write-Host "║  ✓ Custom Protocol Handler (vnahapp://)              ║" -ForegroundColor Cyan
  Write-Host "║                                                       ║" -ForegroundColor Cyan
  Write-Host "║  Bạn có thể chạy ứng dụng bằng:                     ║" -ForegroundColor Cyan
  Write-Host "║  • Click shortcut trên Desktop                       ║" -ForegroundColor Cyan
  Write-Host "║  • Tìm trong Start Menu → VNAH                       ║" -ForegroundColor Cyan
  Write-Host "║  • Chạy lệnh: vnahapp://open                         ║" -ForegroundColor Cyan
  Write-Host "║                                                       ║" -ForegroundColor Cyan
  Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
  Write-Host ""
}

# Main execution
try {
  Write-Host ""
  Write-ColorOutput "╔════════════════════════════════════════════════════╗" "Info"
  Write-ColorOutput "║  VNAH Desktop Application Installer               ║" "Info"
  Write-ColorOutput "║  Quản Lý Nhân Kỹ Thuật (QLDL CTV)                ║" "Info"
  Write-ColorOutput "╚════════════════════════════════════════════════════╝" "Info"
  Write-Host ""
  
  # Create installation directory
  Create-VnahFolder
  
  # Create shortcuts
  Create-DesktopShortcut
  Create-StartMenuShortcut
  
  # Register protocol handler
  Register-UrlProtocol
  
  # Show summary
  Show-Summary
  
  # Keep window open
  Write-ColorOutput "Nhấn phím bất kỳ để đóng..." "Success"
  $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
  
} catch {
  Write-ColorOutput "❌ Lỗi: $_" "Error"
  Write-ColorOutput "Nhấn phím bất kỳ để đóng..." "Error"
  $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
  exit 1
}

exit 0
