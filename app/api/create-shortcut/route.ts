import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { appUrl, appName } = await request.json();

    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing appUrl parameter" },
        { status: 400 }
      );
    }

    // Create a batch script that creates the shortcut
    const batScript = `@echo off
setlocal enabledelayedexpansion

REM Get Desktop path
set "DesktopPath=%USERPROFILE%\\Desktop"

REM Create shortcut using VBScript embedded in batch
set "ShortcutName=${appName || "VNAH QLNKT"}.lnk"

REM Create VBScript to make the shortcut
set "VBSFile=%temp%\\CreateShortcut.vbs"

(
    echo Set oWS = WScript.CreateObject("WScript.Shell"^)
    echo sLinkFile = "%DesktopPath%\\" + "${appName || "VNAH QLNKT"}.lnk"
    echo Set oLink = oWS.CreateShortcut(sLinkFile^)
    echo oLink.TargetPath = "${appUrl}"
    echo oLink.Description = "Ứng dụng VNAH QLNKT"
    echo oLink.Save
    echo MsgBox "✓ Shortcut đã được tạo thành công trên Desktop!", 64, "Hoàn thành"
) > "%VBSFile%"

REM Execute the VBScript
cscript.exe "%VBSFile%"

REM Clean up
del "%VBSFile%"

pause`;

    // Return the script as a file download
    const encoder = new TextEncoder();
    const encodedScript = encoder.encode(batScript);

    return new NextResponse(encodedScript, {
      status: 200,
      headers: {
        "Content-Type": "application/x-msdownload",
        "Content-Disposition": 'attachment; filename="create-appsheet-shortcut.bat"',
        "Content-Length": String(encodedScript.length),
      },
    });
  } catch (error) {
    console.error("Error creating shortcut script:", error);
    return NextResponse.json(
      {
        error: "Failed to generate shortcut script",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
