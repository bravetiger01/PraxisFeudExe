@echo off
echo Starting Feud.Exe Game Server...
echo.
echo Starting WebSocket Server on port 8080...
start "WebSocket Server" cmd /k "npm run ws-server"
timeout /t 3 /nobreak > nul
echo.
echo Starting Next.js Development Server on port 3000...
start "Next.js Server" cmd /k "npm run dev"
echo.
echo Both servers are starting...
echo.
echo Access the game at: http://localhost:3000
echo WebSocket Server: ws://localhost:8080
echo.
echo Press any key to exit...
pause > nul