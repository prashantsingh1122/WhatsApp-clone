@echo off
chcp 65001 >nul
echo 🚀 WhatsApp Clone Deployment Script
echo ==================================

:menu
echo.
echo What would you like to do?
echo 1. Setup project (install dependencies)
echo 2. Seed database with sample data
echo 3. Build frontend for production
echo 4. Start development servers
echo 5. Show deployment instructions
echo 6. Process real WhatsApp payloads
echo 7. Test real payloads
echo 8. Exit
echo.
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto seed
if "%choice%"=="3" goto build
if "%choice%"=="4" goto dev
if "%choice%"=="5" goto deploy_info
if "%choice%"=="6" goto process_real
if "%choice%"=="7" goto test_real
if "%choice%"=="8" goto exit
echo Invalid choice. Please try again.
goto menu

:setup
echo.
echo [INFO] Setting up project...
echo [INFO] Checking requirements...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v16 or higher.
    pause
    goto menu
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    goto menu
)

echo [INFO] All requirements are met!

echo [INFO] Setting up backend...
cd backend
if not exist ".env" (
    echo [WARNING] Creating .env file from template...
    copy env.example .env
    echo [WARNING] Please edit backend\.env with your configuration:
    echo [WARNING]   - MONGODB_URI: Your MongoDB Atlas connection string
    echo [WARNING]   - WEBHOOK_VERIFY_TOKEN: Your WhatsApp webhook verify token
    echo [WARNING]   - JWT_SECRET: A secure random string
)

echo [INFO] Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend setup failed!
    pause
    cd ..
    goto menu
)
echo [INFO] Backend setup completed!
cd ..

echo [INFO] Setting up frontend...
cd frontend
if not exist ".env" (
    echo [WARNING] Creating .env file from template...
    copy env.example .env
    echo [WARNING] Please edit frontend\.env with your configuration:
    echo [WARNING]   - REACT_APP_API_URL: Your backend API URL
    echo [WARNING]   - REACT_APP_SOCKET_URL: Your backend Socket.IO URL
)

echo [INFO] Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend setup failed!
    pause
    cd ..
    goto menu
)
echo [INFO] Frontend setup completed!
cd ..

echo [INFO] Project setup completed!
pause
goto menu

:seed
echo.
echo [INFO] Seeding database with sample data...
cd backend
if exist ".env" (
    echo [INFO] Running database seeder...
    call npm run seed
    if %errorlevel% equ 0 (
        echo [INFO] Database seeding completed!
    ) else (
        echo [WARNING] Database seeding failed. This might be due to missing MongoDB connection.
    )
) else (
    echo [WARNING] Skipping database seeding - .env file not found
)
cd ..
pause
goto menu

:build
echo.
echo [INFO] Building frontend for production...
cd frontend
echo [INFO] Running production build...
call npm run build
if %errorlevel% equ 0 (
    echo [INFO] Frontend build completed!
    echo [INFO] Build files are in frontend\build\
) else (
    echo [ERROR] Frontend build failed!
    pause
    cd ..
    goto menu
)
cd ..
pause
goto menu

:dev
echo.
echo [INFO] Starting development servers...
echo [INFO] Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak >nul

echo [INFO] Starting frontend server...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo [INFO] Development servers started!
echo [INFO] Backend: http://localhost:5000
echo [INFO] Frontend: http://localhost:3000
echo.
echo [WARNING] Close the server windows to stop them
pause
goto menu

:deploy_info
echo.
echo 🌐 Deployment Instructions
echo =========================
echo.
echo Backend (Render):
echo 1. Push your code to GitHub
echo 2. Go to https://render.com and create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Set environment variables in Render dashboard:
echo    - MONGODB_URI: Your MongoDB Atlas connection string
echo    - CORS_ORIGIN: Your frontend URL
echo    - WEBHOOK_VERIFY_TOKEN: Your webhook token
echo    - JWT_SECRET: A secure random string
echo 5. Deploy automatically
echo.
echo Frontend (Vercel):
echo 1. Push your code to GitHub
echo 2. Go to https://vercel.com and import your repository
echo 3. Set environment variables:
echo    - REACT_APP_API_URL: Your backend Render URL + /api
echo    - REACT_APP_SOCKET_URL: Your backend Render URL
echo 4. Deploy automatically
echo.
echo MongoDB Atlas:
echo 1. Create a free cluster at https://mongodb.com/atlas
echo 2. Create a database named 'whatsapp'
echo 3. Get your connection string
echo 4. Whitelist your IP addresses
echo.
pause
goto menu

:process_real
echo.
echo [INFO] Processing real WhatsApp payloads...
echo [INFO] This script is designed to process incoming WhatsApp messages.
echo [INFO] To test this, you'll need a webhook endpoint that can receive POST requests.
echo [INFO] For development, you can use ngrok or a similar service to expose your local server.
echo [INFO] Example ngrok command: ngrok http 5000
echo [INFO] Once you have a webhook endpoint, you can send a POST request to it.
echo [INFO] The script will then process the payload and save it to your MongoDB database.
echo [INFO] To stop processing, press Ctrl+C in the terminal.
echo.
echo [WARNING] This script is for demonstration purposes.
echo [WARNING] For production, you should implement proper security measures.
echo.
pause
goto menu

:test_real
echo.
echo [INFO] Testing real payloads...
echo [INFO] This script is designed to process incoming WhatsApp messages.
echo [INFO] To test this, you'll need a webhook endpoint that can receive POST requests.
echo [INFO] For development, you can use ngrok or a similar service to expose your local server.
echo [INFO] Example ngrok command: ngrok http 5000
echo [INFO] Once you have a webhook endpoint, you can send a POST request to it.
echo [INFO] The script will then process the payload and save it to your MongoDB database.
echo [INFO] To stop processing, press Ctrl+C in the terminal.
echo.
echo [WARNING] This script is for demonstration purposes.
echo [WARNING] For production, you should implement proper security measures.
echo.
pause
goto menu

:exit
echo [INFO] Goodbye!
exit /b 0
