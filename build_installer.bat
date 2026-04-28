@echo off
REM Build NSIS Installer for VNAH
REM Requires NSIS to be installed: https://nsis.sourceforge.io

setlocal

echo Checking if NSIS is installed...

REM Try to find NSIS in common locations
if exist "%ProgramFiles%\NSIS\makensis.exe" (
    set "NSIS_PATH=%ProgramFiles%\NSIS"
    goto FOUND_NSIS
)

if exist "%ProgramFiles(x86)%\NSIS\makensis.exe" (
    set "NSIS_PATH=%ProgramFiles(x86)%\NSIS"
    goto FOUND_NSIS
)

echo ERROR: NSIS not found!
echo Please install NSIS from: https://nsis.sourceforge.io
echo After installation, run this script again.
exit /b 1

:FOUND_NSIS
echo Found NSIS at: %NSIS_PATH%
echo Building installer...

"%NSIS_PATH%\makensis.exe" "installer.nsi"

if errorlevel 1 (
    echo ERROR: Failed to build installer!
    exit /b 1
)

echo.
echo Installer created successfully: VNAH_Installer.exe
echo You can now distribute this file to users.
pause
