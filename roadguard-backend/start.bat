@echo off
REM RoadGuard AI - Backend Auto-Start (double-click to run)
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0start.ps1"
pause
