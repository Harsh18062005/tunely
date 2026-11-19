@echo off
title Tunely Music Player Launcher
color 0A

echo ===================================================
echo               TUNELY MUSIC PLAYER
echo ===================================================
echo.
echo [INFO] Initializing Tunely...
echo.

cd /d "%~dp0"

:: Check if node_modules exists, install if missing
if not exist "node_modules" (
    echo [INFO] First-time setup: Installing dependencies...
    call npm install
)

:: Check if database exists, initialize if missing
if not exist "prisma\dev.db" (
    echo [INFO] Setting up local SQLite database...
    call npx prisma db push
)

echo [INFO] Starting local music server at http://localhost:3000
echo [INFO] Opening default browser in 3 seconds...
echo.

:: Automatically open default browser after short delay for server startup
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Start development server
call npm run dev

pause
