# smjk.photos - Automatische Motiv-Erkennung fuer den Bildausschnitt
# Analysiert jedes Session-Foto und findet die vertikale Lage des Hauptmotivs
# (Bereiche mit viel Detail/Kontrast = Person/Action gegenueber ruhigem Hintergrund).
# Schreibt das Ergebnis in crop-data.js -> die Webseite setzt den Ausschnitt automatisch.

Add-Type -AssemblyName System.Drawing

$repo      = $PSScriptRoot   # Ordner neben diesem Skript
$bilder    = Join-Path $repo "bilder"
$ordner    = @("sessions")   # welche Unterordner analysiert werden

Write-Host ""
Write-Host "  smjk.photos - Motiv-Erkennung" -ForegroundColor Cyan
Write-Host "  =============================" -ForegroundColor Cyan
Write-Host ""

function Get-FocalPercent([string]$path) {
    try { $orig = [System.Drawing.Image]::FromFile($path) } catch { return $null }

    # Auf kleine Analysegroesse herunterrechnen (schnell)
    $targetH = 80
    if ($orig.Height -lt 1) { $orig.Dispose(); return 50 }
    $ratio   = $orig.Width / $orig.Height
    $targetW = [int][Math]::Round($targetH * $ratio)
    if ($targetW -lt 1)   { $targetW = 1 }
    if ($targetW -gt 160) { $targetW = 160 }

    $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBilinear
    $g.DrawImage($orig, 0, 0, $targetW, $targetH)
    $g.Dispose()
    $orig.Dispose()

    $rect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $stride = $data.Stride
    $bytes  = New-Object byte[] ($stride * $targetH)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
    $bmp.UnlockBits($data)
    $bmp.Dispose()

    # Detail-Energie (Kanten) pro Zeile - rollende Luminanz-Zeilen
    $prev  = New-Object double[] $targetW
    $cur   = New-Object double[] $targetW
    $score = New-Object double[] $targetH
    $total = 0.0

    for ($y = 0; $y -lt $targetH; $y++) {
        $row = $y * $stride
        for ($x = 0; $x -lt $targetW; $x++) {
            $i = $row + $x * 3
            $cur[$x] = 0.114 * $bytes[$i] + 0.587 * $bytes[$i+1] + 0.299 * $bytes[$i+2]
        }
        if ($y -gt 0) {
            $s = 0.0
            for ($x = 1; $x -lt $targetW; $x++) {
                $dx = $cur[$x] - $cur[$x-1]; if ($dx -lt 0) { $dx = -$dx }
                $dy = $cur[$x] - $prev[$x];  if ($dy -lt 0) { $dy = -$dy }
                $s += $dx + $dy
            }
            $score[$y] = $s
            $total += $s
        }
        $tmp = $prev; $prev = $cur; $cur = $tmp
    }

    if ($total -le 0) { return 50 }

    # Gewichteter vertikaler Schwerpunkt der Detail-Energie
    $weighted = 0.0
    for ($y = 0; $y -lt $targetH; $y++) { $weighted += $y * $score[$y] }
    $pct = ($weighted / $total / $targetH) * 100

    # Auf sinnvollen Bereich begrenzen (nie zu extrem schneiden)
    if ($pct -lt 12) { $pct = 12 }
    if ($pct -gt 75) { $pct = 75 }
    return [int][Math]::Round($pct)
}

$result = New-Object System.Collections.Specialized.OrderedDictionary
$anzahl = 0

foreach ($sub in $ordner) {
    $dir = Join-Path $bilder $sub
    if (!(Test-Path $dir)) { continue }
    Get-ChildItem -Path $dir -Recurse -File |
        Where-Object { $_.Extension -imatch '\.(jpg|jpeg|png)$' } |
        ForEach-Object {
            $pct = Get-FocalPercent $_.FullName
            if ($null -ne $pct) {
                $result[$_.Name] = "$pct%"
                $anzahl++
                Write-Host ("  {0,-40} -> center {1}%" -f $_.Name, $pct) -ForegroundColor Green
            }
        }
}

# crop-data.js erzeugen
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("// Automatisch erzeugt von bildausschnitt-erkennen.bat - nicht von Hand bearbeiten.")
[void]$sb.AppendLine("window.CROP_DATA = {")
foreach ($k in $result.Keys) {
    $key = ([string]$k).Replace('\','\\').Replace('"','\"')
    [void]$sb.AppendLine(("  ""{0}"": ""{1}""," -f $key, $result[$k]))
}
[void]$sb.AppendLine("};")
$content = $sb.ToString()

$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $repo "crop-data.js"), $content, $utf8)

Write-Host ""
Write-Host "  =============================" -ForegroundColor Cyan
Write-Host "  Fertig! $anzahl Fotos analysiert." -ForegroundColor Cyan
Write-Host "  crop-data.js wurde aktualisiert." -ForegroundColor Cyan
Write-Host ""
Read-Host "  Enter druecken zum Beenden"
