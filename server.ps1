# Zero-Dependency PowerShell Local HTTP Web Server for CHAYA AGENCIES
$port = 8080
$prefix = "http://localhost:$port/"
$root = "C:\Users\Jaswanth Gosangi\.gemini\antigravity\scratch\chaya-agencies"
$imgDir = Join-Path $root "images"
$brainDir = "C:\Users\Jaswanth Gosangi\.gemini\antigravity\brain\718011b9-c357-4f79-a158-a7815ea4bd3d"

# Copy generated images to local images directory for self-contained hosting
if (-not (Test-Path $imgDir)) {
    New-Item -ItemType Directory -Path $imgDir -Force | Out-Null
}

if (Test-Path $brainDir) {
    Get-ChildItem -Path $brainDir -Filter "*.jpg" | ForEach-Object {
        $dest = Join-Path $imgDir $_.Name
        if (-not (Test-Path $dest)) {
            Copy-Item -Path $_.FullName -Destination $dest -Force
        }
    }
    
    $uploadedLogo = Join-Path $brainDir ".user_uploaded\media__1785603647902.jpg"
    if (Test-Path $uploadedLogo) {
        Copy-Item -Path $uploadedLogo -Destination (Join-Path $imgDir "chaya_logo_official.jpg") -Force
    }

    $uploadedHeroCamera = Join-Path $brainDir ".user_uploaded\media__1785606017086.png"
    if (Test-Path $uploadedHeroCamera) {
        Copy-Item -Path $uploadedHeroCamera -Destination (Join-Path $imgDir "hero_camera_official.png") -Force
    }

    $uploadedHeroExact = Join-Path $brainDir ".user_uploaded\media__1785606169003.png"
    if (Test-Path $uploadedHeroExact) {
        Copy-Item -Path $uploadedHeroExact -Destination (Join-Path $imgDir "hero_camera_exact.png") -Force
    }

    $uploadedMainLogo = Join-Path $brainDir ".user_uploaded\media__1785645780891.jpg"
    if (Test-Path $uploadedMainLogo) {
        Copy-Item -Path $uploadedMainLogo -Destination (Join-Path $imgDir "chaya_main_logo.jpg") -Force
    }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " CHAYA AGENCIES Web Server is running on:" -ForegroundColor Green
    Write-Host " $prefix" -ForegroundColor Yellow
    Write-Host " Press Ctrl+C in this terminal window to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relativePath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relativePath)) {
            $relativePath = "index.html"
        }

        # Route /brain/... requests or standard requests
        if ($relativePath -match "^brain/718011b9-c357-4f79-a158-a7815ea4bd3d/(.+)") {
            $fileName = $Matches[1]
            $targetPath = Join-Path $brainDir $fileName
        } else {
            $targetPath = Join-Path $root $relativePath
        }

        if (Test-Path $targetPath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($targetPath)
                $ext = [System.IO.Path]::GetExtension($targetPath).ToLower()

                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".svg"  { "image/svg+xml" }
                    ".json" { "application/json" }
                    default { "application/octet-stream" }
                }

                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
            }
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }

        $response.OutputStream.Close()
    }
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
