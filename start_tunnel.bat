@echo off
TITLE Zoopedia Permanent Tunnel
echo ==========================================
echo    ZOOPEDIA TAP-TO-PAY TUNNEL SETUP
echo ==========================================
echo.
echo 1. Make sure XAMPP (Apache) is RUNNING.
echo 2. Make sure you claimed your FREE domain at dashboard.ngrok.com
echo.
echo Edit this file to replace 'your-domain' with your actual ngrok domain.
echo.
:: Change the line below to your actual domain from ngrok
ngrok http --url=your-domain.ngrok-free.app 80
pause
