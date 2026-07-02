@echo off
REM Windows Deploy Script for Algorithm Blog
REM Usage: scripts\deploy.bat <server-ip> [user]
REM Example: scripts\deploy.bat 123.45.67.89 root

set SERVER=%1
set USER=%2

if "%SERVER%"=="" (
    echo Usage: deploy.bat ^<server-ip^> [user]
    echo Example: deploy.bat 123.45.67.89 root
    exit /b 1
)

if "%USER%"=="" set USER=root

echo [1/3] Building site...
cd /d D:\ac
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Aborting.
    exit /b 1
)

echo [2/3] Copying to server...
scp -r D:\ac\dist\* %USER%@%SERVER%:/var/www/algoblog/
if %ERRORLEVEL% NEQ 0 (
    echo SCP transfer failed! Aborting.
    exit /b 1
)

echo [3/3] Deployment complete!
echo Site deployed to http://%SERVER%
