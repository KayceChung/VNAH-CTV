param(
  [string]$ProtocolName = "vnahshortcut",
  [string]$EnsureScriptRelativePath = "scripts\ensure_vnah_shortcut.ps1"
)

$repoRoot = Split-Path -Parent $PSScriptRoot
$ensureScriptPath = Join-Path $repoRoot $EnsureScriptRelativePath
$icoPath = Join-Path $repoRoot "public\logo.ico"
$pngPath = Join-Path $repoRoot "public\logo.png"

if (-not (Test-Path -LiteralPath $ensureScriptPath)) {
  Write-Error "Missing ensure script: $ensureScriptPath"
  exit 1
}

$baseKey = "HKCU:\Software\Classes\$ProtocolName"
$commandKey = "$baseKey\shell\open\command"

New-Item -Path $baseKey -Force | Out-Null
Set-ItemProperty -Path $baseKey -Name "(Default)" -Value "URL:VNAH Shortcut Installer" -Force
Set-ItemProperty -Path $baseKey -Name "URL Protocol" -Value "" -Force

New-Item -Path "$baseKey\DefaultIcon" -Force | Out-Null
# Use the logo.ico if it exists, fallback to PNG, then system icon
if (Test-Path -LiteralPath $icoPath) {
  Set-ItemProperty -Path "$baseKey\DefaultIcon" -Name "(Default)" -Value $icoPath -Force
  Write-Output "Using ICO icon"
} elseif (Test-Path -LiteralPath $pngPath) {
  Set-ItemProperty -Path "$baseKey\DefaultIcon" -Name "(Default)" -Value $pngPath -Force
  Write-Output "Using PNG icon (fallback)"
} else {
  Set-ItemProperty -Path "$baseKey\DefaultIcon" -Name "(Default)" -Value "%SystemRoot%\System32\SHELL32.dll,220" -Force
  Write-Output "Using system icon (fallback)"
}

New-Item -Path $commandKey -Force | Out-Null
$cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ensureScriptPath`""
Set-ItemProperty -Path $commandKey -Name "(Default)" -Value $cmd -Force

Write-Output "Installed URL protocol: ${ProtocolName}://install"
Write-Output "Command: $cmd"
