@echo off
REM Comprehensive migration script - runs all pending migrations
REM Usage: run-all-migrations.bat

echo ====================================
echo HealthPeDhyan Migration Tool
echo ====================================
echo.

set MIGRATION_001=prisma\migrations\001_add_video_fields.sql
set MIGRATION_002=prisma\migrations\002_add_user_features.sql

echo Checking migration files...
echo.

if not exist "%MIGRATION_001%" (
    echo ERROR: Migration file not found: %MIGRATION_001%
    echo Please run 'git pull' first to get the latest changes.
    pause
    exit /b 1
)

if not exist "%MIGRATION_002%" (
    echo ERROR: Migration file not found: %MIGRATION_002%
    echo Please run 'git pull' first to get the latest changes.
    pause
    exit /b 1
)

echo Found all migration files!
echo.
echo This will run the following migrations:
echo 1. Add video fields to articles table
echo 2. Add user authentication and profile tables
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo ====================================
echo Running Migration 1: Video Fields
echo ====================================
psql -U postgres -d healthpedhyan -f %MIGRATION_001%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Migration 1 failed!
    pause
    exit /b 1
)

echo.
echo ====================================
echo Running Migration 2: User Features
echo ====================================
psql -U postgres -d healthpedhyan -f %MIGRATION_002%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Migration 2 failed!
    pause
    exit /b 1
)

echo.
echo ====================================
echo All migrations completed successfully!
echo ====================================
echo.
echo Next steps:
echo 1. npx prisma generate
echo 2. pnpm dev
echo.
pause
