@echo off
echo ========================================================
echo Starting Isolated Ollama for SovereignAI Workbench...
echo ========================================================

:: Set the models path specifically for this instance
set OLLAMA_MODELS=%~dp0ollama_models

echo Models Directory: %OLLAMA_MODELS%

:: Stop any globally running Ollama instances
taskkill /F /IM ollama.exe >nul 2>&1
taskkill /F /IM "ollama app.exe" >nul 2>&1

:: Start Ollama in the background
start /b ollama serve

echo Ollama is running using the isolated project directory.
echo You can now start the backend server.
pause
