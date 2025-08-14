@echo off
echo Setting up WhatsApp Web Clone...
echo.

echo Creating environment files...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo Created backend/.env - Please configure your MongoDB URI
)

if not exist "frontend\.env" (
    echo REACT_APP_API_URL=http://localhost:5000/api> frontend\.env
    echo REACT_APP_SOCKET_URL=http://localhost:5000>> frontend\.env
    echo Created frontend/.env
)

echo.
echo Installing backend dependencies...
cd backend
call npm install

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Configure your MongoDB URI in backend/.env
echo 2. Run 'cd backend && npm run dev' to start the backend
echo 3. Run 'cd frontend && npm start' to start the frontend
echo 4. Run 'cd backend && npm run seed' to populate sample data
echo.
pause
