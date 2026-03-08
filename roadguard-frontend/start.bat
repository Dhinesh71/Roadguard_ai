@echo off
REM RoadGuard AI - Frontend Auto-Start (double-click to run)
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0start.ps1"
pause
