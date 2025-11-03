@echo off
REM Fixed migration script
REM Usage: fix-migration.bat

echo ====================================
echo Running FIXED User Features Migration
echo ====================================
echo.

set MIGRATION_FILE=prisma\migrations\002_add_user_features_fixed.sql

if not exist "%MIGRATION_FILE%" (
    echo ERROR: Migration file not found: %MIGRATION_FILE%
    echo Please run 'git pull' first.
    pause
    exit /b 1
)

echo This will fix the users table and add all user-related tables.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Running fixed migration...
echo.

psql -U postgres -d healthpedhyan -f %MIGRATION_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo Migration completed successfully!
    echo ====================================
    echo.
    echo Next steps:
    echo 1. npx prisma generate
    echo 2. pnpm dev
    echo.
) else (
    echo.
    echo ERROR: Migration failed!
    echo.
)

pause
