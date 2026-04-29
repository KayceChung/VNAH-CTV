param(
  [string]$ShortcutName = "VNAH_QLNKT_VER30_PUBLIC.url",
  [string]$TargetUrl = "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank"
)

$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath $ShortcutName

# Use a professional website icon from Windows System32
# Icon 220 is a globe/website icon in shell32.dll
$shortcutContent = @"
[InternetShortcut]
URL=$TargetUrl
IconFile=%SystemRoot%\System32\SHELL32.dll
IconIndex=220
HotKey=0
"@

$needsWrite = $true

if (Test-Path -LiteralPath $shortcutPath) {
  $existingContent = Get-Content -LiteralPath $shortcutPath -Raw -ErrorAction SilentlyContinue
  if ($existingContent -and $existingContent -match [Regex]::Escape("URL=$TargetUrl")) {
    $needsWrite = $false
  }
}

if ($needsWrite) {
  Set-Content -LiteralPath $shortcutPath -Value $shortcutContent -Encoding ASCII
  Write-Output "Created or updated shortcut: $shortcutPath"
} else {
  Write-Output "Shortcut already valid: $shortcutPath"
}
