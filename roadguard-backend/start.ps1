# RoadGuard AI - Backend Auto-Start Script
# Run this script to start the backend server automatically

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  RoadGuard AI - Backend Server   " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Step 1: Create venv if missing
if (-Not (Test-Path ".\venv\Scripts\python.exe")) {
    Write-Host "[1/3] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
} else {
    Write-Host "[1/3] Virtual environment found." -ForegroundColor Green
}

# Step 2: Install/update dependencies
Write-Host "[2/3] Installing Python dependencies..." -ForegroundColor Yellow
.\venv\Scripts\python.exe -m pip install -r requirements.txt -q

Write-Host "[3/3] Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "      Visit http://localhost:8000/docs for the API documentation" -ForegroundColor Gray
Write-Host "      Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host ""

# Step 3: Start uvicorn using the venv's executable with auto-reload
.\venv\Scripts\uvicorn.exe main:app --reload --port 8000 --host 0.0.0.0
