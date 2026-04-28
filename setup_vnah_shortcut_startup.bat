@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "PS_SCRIPT=%ROOT_DIR%scripts\ensure_vnah_shortcut.ps1"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "STARTUP_CMD=%STARTUP_DIR%\VNAH_EnsureShortcut.cmd"

if not exist "%PS_SCRIPT%" (
  echo ERROR: Missing script: "%PS_SCRIPT%"
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
if errorlevel 1 (
  echo ERROR: Failed running shortcut checker.
  exit /b 1
)

(
  echo @echo off
  echo powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
) > "%STARTUP_CMD%"

echo Startup auto-check installed: "%STARTUP_CMD%"
echo It will run on each Windows sign-in for this user.
exit /b 0
