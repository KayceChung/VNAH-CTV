; VNAH QLDL CTV - Windows Installer
; Created with NSIS (Nullsoft Scriptable Install System)

!include "MUI2.nsh"
!include "x64.nsh"

; Basic Settings
Name "VNAH - Quản lý Nhân Kỹ Thuật"
OutFile "VNAH_Installer.exe"
InstallDir "$PROGRAMFILES\VNAH"

; MUI Settings
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "Vietnamese"

; Installer Version
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "VNAH - Quản lý Nhân Kỹ Thuật"
VIAddVersionKey "FileVersion" "1.0.0"
VIAddVersionKey "ProductVersion" "1.0.0"
VIAddVersionKey "LegalCopyright" "VNAH"
VIAddVersionKey "FileDescription" "VNAH Application Installer"

; RequestExecutionLevel admin

Section "Install"
  SetOutPath "$INSTDIR"
  
  ; Copy shortcut creator script
  File "scripts\ensure_vnah_shortcut.ps1"
  File "scripts\convert_png_to_ico.ps1"
  File "public\logo.ico"
  File "public\logo.png"
  
  ; Create Start Menu Shortcuts
  CreateDirectory "$SMPROGRAMS\VNAH"
  CreateShortCut "$SMPROGRAMS\VNAH\VNAH QLDL CTV.lnk" "$INSTDIR\open_vnah.bat" "" "$INSTDIR\logo.ico" 0
  CreateShortCut "$SMPROGRAMS\VNAH\Uninstall.lnk" "$INSTDIR\uninstall.exe"
  
  ; Create Desktop Shortcut
  CreateShortCut "$DESKTOP\VNAH_QLNKT_VER30_PUBLIC.lnk" "$INSTDIR\open_vnah.bat" "" "$INSTDIR\logo.ico" 0
  
  ; Create batch file to open app
  FileOpen $0 "$INSTDIR\open_vnah.bat" w
  FileWrite $0 "@echo off`r`nstart `"`" `"https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank`"`r`n"
  FileClose $0
  
  ; Create Uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  ; Register in Programs and Features
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\VNAH" "DisplayName" "VNAH - Quản lý Nhân Kỹ Thuật"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\VNAH" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\VNAH" "DisplayIcon" "$INSTDIR\logo.ico"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\VNAH" "URLInfoAbout" "https://www.vnah-hev.org"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\VNAH" "DisplayVersion" "1.0.0"
  
  MessageBox MB_OK "VNAH đã được cài đặt thành công!$\r$\nShortcut đã được tạo trên Desktop và Start Menu."
SectionEnd

Section "Uninstall"
  ; Remove shortcuts
  RMDir /r "$SMPROGRAMS\VNAH"
  Delete "$DESKTOP\VNAH_QLNKT_VER30_PUBLIC.lnk"
  
  ; Remove files
  Delete "$INSTDIR\ensure_vnah_shortcut.ps1"
  Delete "$INSTDIR\convert_png_to_ico.ps1"
  Delete "$INSTDIR\logo.ico"
  Delete "$INSTDIR\logo.png"
  Delete "$INSTDIR\open_vnah.bat"
  Delete "$INSTDIR\uninstall.exe"
  
  ; Remove directory
  RMDir "$INSTDIR"
  
  ; Remove registry entry
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\VNAH"
  
  MessageBox MB_OK "VNAH đã được gỡ bỏ thành công."
SectionEnd
