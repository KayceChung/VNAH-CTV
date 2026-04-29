import { exec, ExecOptions } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { appUrl, appName } = await request.json();

    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing appUrl parameter" },
        { status: 400 }
      );
    }

    // PowerShell script to create desktop shortcut
    const psScript = `
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = "$DesktopPath\\${appName || "AppSheet"}.lnk"

$Shell = New-Object -ComObject WScript.Shell
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "${appUrl}"
$Shortcut.Description = "Ứng dụng VNAH QLNKT"
$Shortcut.Save()

Write-Output "Shortcut created successfully at $ShortcutPath"
`;

    // Execute PowerShell command
    const execOptions: ExecOptions = {
      shell: "/bin/bash",
    };
    const { stdout, stderr } = await (execAsync as any)(
      `powershell -Command "${psScript.replace(/"/g, '\\"')}"`,
      execOptions
    );

    if (stderr && !stderr.includes("Security warning")) {
      throw new Error(stderr);
    }

    return NextResponse.json({
      success: true,
      message: "Desktop shortcut created successfully",
      stdout: stdout.trim(),
    });
  } catch (error) {
    console.error("Error creating shortcut:", error);
    return NextResponse.json(
      {
        error: "Failed to create shortcut",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
