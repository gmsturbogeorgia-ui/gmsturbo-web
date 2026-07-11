# Run this ONCE from the project root before `npm install` / `npm run dev`.
#
# Why: Payload's admin panel needs its own root layout (its own <html>/<body>),
# living in src/app/(payload)/. Next.js only allows multiple independent root
# layouts via route groups if there is NO layout.tsx directly inside src/app.
# So the existing site (currently directly in src/app) needs to move into a
# sibling src/app/(frontend)/ group. This is a pure file move — no content
# changes, and every import in these files uses the "@/..." alias so nothing
# breaks by relocating them together.
#
# Usage (PowerShell, from the project root C:\Users\Luka\turbocharged-project):
#   .\migrate-to-payload-routes.ps1

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\src\app"

New-Item -ItemType Directory -Force -Path "(frontend)" | Out-Null

$items = @(
  "page.tsx",
  "layout.tsx",
  "globals.css",
  "not-found.tsx",
  "error.tsx",
  "sitemap.ts",
  "HomeClient.tsx",
  "catalog",
  "showroom",
  "contact"
)

foreach ($item in $items) {
  if (Test-Path $item) {
    Move-Item -Path $item -Destination "(frontend)\$item" -Force
    Write-Host "Moved $item -> (frontend)\$item"
  } else {
    Write-Host "Skipped $item (not found — already moved?)"
  }
}

Write-Host ""
Write-Host "Done. src/app now contains only (frontend)/ and (payload)/."
Write-Host "You can delete this script after running it."
