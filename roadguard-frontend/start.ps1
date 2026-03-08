# RoadGuard AI - Frontend Auto-Start Script
# Run this script to start the frontend dev server automatically

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "==================================" -ForegroundColor Cyan
Write-Host " RoadGuard AI - Frontend Server   " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Step 1: Install node_modules if missing
if (-Not (Test-Path ".\node_modules")) {
    Write-Host "[1/2] Installing Node.js dependencies (first time only)..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}
else {
    Write-Host "[1/2] Node modules found." -ForegroundColor Green
}

Write-Host "[2/2] Starting Vite dev server on http://localhost:3000" -ForegroundColor Green
Write-Host "      Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host ""

# Step 2: Start the dev server
npm run dev -- --port 3000
