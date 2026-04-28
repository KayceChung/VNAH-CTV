@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "PS_SCRIPT=%ROOT_DIR%scripts\install_vnah_protocol.ps1"

if not exist "%PS_SCRIPT%" (
  echo ERROR: Missing script: "%PS_SCRIPT%"
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
if errorlevel 1 (
  echo ERROR: Failed to install custom protocol.
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT_DIR%scripts\ensure_vnah_shortcut.ps1"
if errorlevel 1 (
  echo ERROR: Failed to create shortcut.
  exit /b 1
)

echo One-click desktop protocol installed successfully.
echo You can now trigger shortcut creation from browser by opening vnahshortcut://install
exit /b 0
