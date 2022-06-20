@echo off
setlocal
cd /d %~dp0
@REM consolestate.exe /hide
electron %~dp0run.js
@REM consolestate.exe /show
pause