@echo off
title Tunel Ngrok - Paginas Ventas
echo ===================================================
echo   Iniciando tunel de ngrok...
echo   Dominio: https://grueling-unplanted-late.ngrok-free.dev
echo   Puerto local: http://localhost:3000
echo ===================================================
echo.
call npx ngrok http 3000 --url=https://grueling-unplanted-late.ngrok-free.dev
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Hubo un problema al iniciar ngrok.
  pause
)
