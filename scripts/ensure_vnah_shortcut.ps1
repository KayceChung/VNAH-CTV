param(
  [string]$ShortcutName = "VNAH_QLNKT_VER30_PUBLIC.lnk",
  [string]$TargetUrl = "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank"
)

$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath $ShortcutName

# Get the logo ICO path from the app root (use .ico instead of .png for better Windows support)
$scriptRoot = Split-Path -Parent $PSScriptRoot
$icoPath = Join-Path $scriptRoot "public\logo.ico"
$pngPath = Join-Path $scriptRoot "public\logo.png"

# Ensure logo ICO exists, fallback to PNG if not
if (-not (Test-Path -LiteralPath $icoPath)) {
  Write-Warning "Logo ICO not found at: $icoPath. Attempting to convert PNG..."
  
  if (Test-Path -LiteralPath $pngPath) {
    try {
      Add-Type -AssemblyName System.Drawing
      $img = [System.Drawing.Image]::FromFile($pngPath)
      $bitmap = New-Object System.Drawing.Bitmap($img)
      $resized = New-Object System.Drawing.Bitmap($bitmap, 256, 256)
      $icon = [System.Drawing.Icon]::FromHandle($resized.GetHicon())
      $fileStream = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
      $icon.Save($fileStream)
      $fileStream.Close()
      
      $img.Dispose()
      $bitmap.Dispose()
      $resized.Dispose()
      $icon.Dispose()
      
      Write-Host "Converted PNG to ICO successfully."
      $iconPath = $icoPath
    } catch {
      Write-Warning "Could not convert PNG to ICO: $_. Using PNG instead."
      $iconPath = $pngPath
    }
  } else {
    Write-Warning "Neither ICO nor PNG found. Using system icon."
    $iconPath = "%SystemRoot%\System32\SHELL32.dll,220"
  }
} else {
  $iconPath = $icoPath
}

# Create .lnk shortcut using COM object (proper Windows shortcut with custom icon)
try {
  # Create a batch file to open URL with default browser
  $batchPath = Join-Path $env:TEMP "vnah_open_url.bat"
  $batchContent = "@echo off`r`nstart `"`" `"$TargetUrl`"`r`n"
  Set-Content -LiteralPath $batchPath -Value $batchContent -Encoding ASCII -Force
  
  $ws = New-Object -ComObject WScript.Shell
  $shortcut = $ws.CreateShortcut($shortcutPath)
  
  # Use the batch file as target - it will open URL with default browser
  $shortcut.TargetPath = $batchPath
  $shortcut.Arguments = ""
  $shortcut.Description = "VNAH - Ứng dụng Quản lý Nhân Kỹ Thuật"
  $shortcut.WorkingDirectory = $env:USERPROFILE
  $shortcut.IconLocation = $iconPath
  $shortcut.Save()
  
  Write-Output "Created or updated shortcut: $shortcutPath with logo"
  Write-Output "Icon: $iconPath"
} catch {
  Write-Error "Failed to create shortcut: $_"
  exit 1
}
