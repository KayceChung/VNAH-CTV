@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "PS_SCRIPT=%ROOT_DIR%scripts\ensure_vnah_shortcut.ps1"

if not exist "%PS_SCRIPT%" (
  echo ERROR: Missing script: "%PS_SCRIPT%"
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
exit /b %errorlevel%
