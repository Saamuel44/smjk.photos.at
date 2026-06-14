# smjk.photos - Foto-Komprimierung
# Alle Fotos in bilder/ auf max. 1920px verkleinern und JPEG-Qualitat optimieren
Add-Type -AssemblyName System.Drawing

$bilderPfad = Join-Path $PSScriptRoot "bilder"  # bilder-Ordner neben diesem Skript
$maxGroesse  = 1920   # maximale Breite/Hoehe in Pixeln
$qualitaet   = 82     # JPEG-Qualitaet (0-100)
$skipUnter   = 2MB    # Dateien kleiner als dies werden uebersprungen (schon komprimiert)

Write-Host ""
Write-Host "  smjk.photos - Foto-Komprimierung" -ForegroundColor Cyan
Write-Host "  ===================================" -ForegroundColor Cyan
Write-Host ""

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]$qualitaet
)

$bilder = Get-ChildItem -Path $bilderPfad -Recurse |
    Where-Object { $_.Extension -imatch "\.(jpg|jpeg)$" -and !$_.PSIsContainer }

if ($bilder.Count -eq 0) {
    Write-Host "  Keine Fotos gefunden in: $bilderPfad" -ForegroundColor Yellow
    Read-Host "  Enter druecken zum Beenden"
    exit
}

Write-Host "  $($bilder.Count) Fotos gefunden. Starte Komprimierung..." -ForegroundColor White
Write-Host ""

$zaehler       = 0
$uebersprungen = 0
$gesamtVorher  = 0
$gesamtNachher = 0

foreach ($bild in $bilder) {
    $zaehler++
    $vorher = $bild.Length
    $gesamtVorher += $vorher

    Write-Host "  [$zaehler/$($bilder.Count)] $($bild.Name)..." -NoNewline

    # Bereits kleine Dateien ueberspringen
    if ($vorher -lt $skipUnter) {
        Write-Host " Uebersprungen (schon komprimiert)" -ForegroundColor Gray
        $gesamtNachher += $vorher
        $uebersprungen++
        continue
    }

    try {
        # Datei in Arbeitsspeicher laden (verhindert Dateisperren)
        $bytes = [System.IO.File]::ReadAllBytes($bild.FullName)
        $ms    = New-Object System.IO.MemoryStream($bytes, $false)
        $img   = [System.Drawing.Image]::FromStream($ms)

        $breite = $img.Width
        $hoehe  = $img.Height

        # Groesse berechnen
        if ($breite -gt $maxGroesse -or $hoehe -gt $maxGroesse) {
            $faktor     = [Math]::Min($maxGroesse / $breite, $maxGroesse / $hoehe)
            $neueBreite = [int]($breite * $faktor)
            $neueHoehe  = [int]($hoehe  * $faktor)

            $bitmap = New-Object System.Drawing.Bitmap($neueBreite, $neueHoehe)
            $g = [System.Drawing.Graphics]::FromImage($bitmap)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.DrawImage($img, 0, 0, $neueBreite, $neueHoehe)
            $g.Dispose()
            $img.Dispose()
            $ms.Dispose()

            $temp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.IO.Path]::GetRandomFileName())
            $bitmap.Save($temp, $jpegCodec, $encoderParams)
            $bitmap.Dispose()
        } else {
            $temp = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), [System.IO.Path]::GetRandomFileName())
            $img.Save($temp, $jpegCodec, $encoderParams)
            $img.Dispose()
            $ms.Dispose()
        }

        # Originaldatei ersetzen
        [System.IO.File]::Delete($bild.FullName)
        [System.IO.File]::Move($temp, $bild.FullName)

        $nachher = (Get-Item $bild.FullName).Length
        $gesamtNachher += $nachher
        $ersparnis = [Math]::Round((1 - $nachher / $vorher) * 100)

        Write-Host " $([Math]::Round($vorher / 1MB, 1))MB -> $([Math]::Round($nachher / 1MB, 1))MB (-$ersparnis%)" -ForegroundColor Green

    } catch {
        Write-Host " FEHLER: $_" -ForegroundColor Red
        $gesamtNachher += $vorher
    }
}

$gesamtErsparnis = if ($gesamtVorher -gt 0) {
    [Math]::Round((1 - $gesamtNachher / $gesamtVorher) * 100)
} else { 0 }

Write-Host ""
Write-Host "  =======================================" -ForegroundColor Cyan
Write-Host "  Fertig! $($zaehler - $uebersprungen) Fotos komprimiert, $uebersprungen uebersprungen." -ForegroundColor Cyan
Write-Host "  Gesamt: $([Math]::Round($gesamtVorher / 1MB, 1)) MB -> $([Math]::Round($gesamtNachher / 1MB, 1)) MB (-$gesamtErsparnis%)" -ForegroundColor Cyan
Write-Host ""
Read-Host "  Enter druecken zum Beenden"
