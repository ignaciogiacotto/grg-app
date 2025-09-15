@echo off
echo Starting servers...

REM Start the database (mongod)
start "Database" mongod

REM Start the backend server
start "Backend" cmd /c "cd user-app-backend && npm run dev"

REM Start the frontend server
start "Frontend" cmd /c "cd user-app-react && npm run dev"

echo All servers have been launched in separate windows.
