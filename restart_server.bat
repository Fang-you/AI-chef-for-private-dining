@echo off
echo Stopping old server processes...
taskkill /F /IM python.exe 2>/dev/null
timeout /t 2 /nobreak >/dev/null

echo Starting FastAPI server...
cd /d "%~dp0"
python -m app.main
