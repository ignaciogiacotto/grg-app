@echo off
echo Starting servers...

REM Start the database (mongod)
echo Starting MongoDB server...
start "Database" mongod

REM Wait for the database to initialize
echo Waiting 10 seconds for database to start...
timeout /t 10 /nobreak >nul

REM --- Run Database Backup ---
echo Running database backup script...
call backupdb.bat
set BACKUP_ERROR=%ERRORLEVEL%
if %BACKUP_ERROR% neq 0 (
    echo.
    echo !!!!! WARNING !!!!!
    echo El backup de la base de datos ha fallado. Codigo de error: %BACKUP_ERROR%
    echo Revisa el script backupdb.bat para mas detalles.
    echo.
    pause
) else (
    echo Backup finalizado correctamente.
)

echo Backup process finished.

REM Start the backend server
start "Backend" cmd /c "cd user-app-backend && npm run dev"

REM Start the frontend server
start "Frontend" cmd /c "cd user-app-react && npm run dev"

echo All servers have been launched in separate windows.

echo Waiting 10 seconds for close console...
timeout /t 10 /nobreak >nul

