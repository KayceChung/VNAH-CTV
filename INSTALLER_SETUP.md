# Windows Installer Setup

## Prerequisites

To build the Windows installer, you need to install NSIS (Nullsoft Scriptable Install System):

1. **Download NSIS**: https://nsis.sourceforge.io/Download
2. **Install NSIS** (default location: `C:\Program Files\NSIS`)
3. **Run the build script**:
   ```batch
   build_installer.bat
   ```

## What the Installer Does

✅ Creates professional Windows installer (`.exe`)
✅ Installs to `Program Files\VNAH`
✅ Creates Desktop shortcut with **VNAH logo icon**
✅ Creates Start Menu folder with shortcuts
✅ Registers in "Programs and Features" (Add/Remove Programs)
✅ Includes proper uninstaller
✅ Opens AppSheet with default browser when launched

## Installation Flow for Users

1. **Download** `VNAH_Installer.exe`
2. **Double-click** to run installer
3. **Click Install** → Files copied + shortcuts created
4. **Desktop shortcut** appears with VNAH icon
5. **Click shortcut** → Opens AppSheet in default browser

## Distribution

After building, distribute `VNAH_Installer.exe` to users:
- Upload to website
- Send via email
- Include in documentation

Users simply run the `.exe` file - no need for PowerShell or scripts!

## Customization

Edit `installer.nsi` to modify:
- Installation directory
- Start Menu folder name
- Application name and version
- Icons and branding
- Registry entries

## Uninstallation

Users can uninstall via:
- "Programs and Features" (Control Panel)
- Start Menu → VNAH → Uninstall
- Add/Remove Programs

---

**Note**: This is a professional Windows installer following best practices. It's equivalent to how major applications (AppSheet, Chrome, etc.) install on Windows.
