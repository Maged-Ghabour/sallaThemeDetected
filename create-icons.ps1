Add-Type -AssemblyName System.Drawing

function New-ExtensionIcon {
    param([int]$Size, [string]$OutputPath)

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # Background - dark
    $bgColor = [System.Drawing.Color]::FromArgb(255, 13, 15, 20)
    $g.Clear($bgColor)

    # Gradient overlay (purple to blue)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(60, 124, 58, 237),
        [System.Drawing.Color]::FromArgb(60, 14, 165, 233),
        [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
    )
    $g.FillRectangle($gradBrush, $rect)
    $gradBrush.Dispose()

    # Magnifying glass circle
    $cx   = [int]($Size * 0.42)
    $cy   = [int]($Size * 0.41)
    $r    = [int]($Size * 0.24)
    $lw   = [Math]::Max(1, [int]($Size * 0.10))

    $circlePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 168, 85, 247), $lw)
    $circlePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $g.DrawEllipse($circlePen, ($cx - $r), ($cy - $r), ($r * 2), ($r * 2))
    $circlePen.Dispose()

    # Handle line
    $angle = [Math]::PI * 0.75
    $hx1 = [int]($cx + ($r + $lw * 0.2) * [Math]::Cos($angle))
    $hy1 = [int]($cy + ($r + $lw * 0.2) * [Math]::Sin($angle))
    $hx2 = [int]($cx + ($r + $Size * 0.26) * [Math]::Cos($angle))
    $hy2 = [int]($cy + ($r + $Size * 0.26) * [Math]::Sin($angle))

    $handlePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 14, 165, 233), $lw)
    $handlePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $handlePen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawLine($handlePen, $hx1, $hy1, $hx2, $hy2)
    $handlePen.Dispose()

    $g.Dispose()
    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    Write-Host "  [OK] icon${Size}.png -> $OutputPath"
}

$iconDir = Join-Path $PSScriptRoot "icons"
if (-not (Test-Path $iconDir)) {
    New-Item -ItemType Directory -Path $iconDir | Out-Null
}

Write-Host ""
Write-Host "Generating extension icons..." -ForegroundColor Cyan

foreach ($size in 16, 32, 48, 128) {
    $outPath = Join-Path $iconDir "icon${size}.png"
    New-ExtensionIcon -Size $size -OutputPath $outPath
}

Write-Host ""
Write-Host "Done! All icons saved to: $iconDir" -ForegroundColor Green
Write-Host ""
