# Convert PNG to ICO format
param(
    [string]$PngPath = "public\logo.png",
    [string]$IcoPath = "public\logo.ico"
)

$scriptRoot = Split-Path -Parent $PSScriptRoot
$fullPngPath = Join-Path $scriptRoot $PngPath
$fullIcoPath = Join-Path $scriptRoot $IcoPath

if (-not (Test-Path -LiteralPath $fullPngPath)) {
    Write-Error "PNG file not found: $fullPngPath"
    exit 1
}

# Use ImageMagick/Magick if available, otherwise use System.Drawing
try {
    # Try using .NET Framework's System.Drawing
    Add-Type -AssemblyName System.Drawing
    
    $img = [System.Drawing.Image]::FromFile($fullPngPath)
    
    # Create icon from image
    $bitmap = New-Object System.Drawing.Bitmap($img)
    
    # Resize to 256x256 for better icon quality (Windows supports larger icons now)
    $resized = New-Object System.Drawing.Bitmap($bitmap, 256, 256)
    
    # Save as ICO
    $icon = [System.Drawing.Icon]::FromHandle($resized.GetHicon())
    $fileStream = New-Object System.IO.FileStream($fullIcoPath, [System.IO.FileMode]::Create)
    $icon.Save($fileStream)
    $fileStream.Close()
    
    Write-Host "Successfully converted PNG to ICO"
    Write-Host "Input: $fullPngPath"
    Write-Host "Output: $fullIcoPath"
    
    $img.Dispose()
    $bitmap.Dispose()
    $resized.Dispose()
    $icon.Dispose()
} catch {
    Write-Error "Conversion failed: $_"
    exit 1
}
