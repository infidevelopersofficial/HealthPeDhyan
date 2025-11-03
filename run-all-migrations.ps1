# Comprehensive migration script - runs all pending migrations
# Usage: .\run-all-migrations.ps1

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "HealthPeDhyan Migration Tool" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$migration001 = "prisma\migrations\001_add_video_fields.sql"
$migration002 = "prisma\migrations\002_add_user_features.sql"

Write-Host "Checking migration files..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $migration001)) {
    Write-Host "ERROR: Migration file not found: $migration001" -ForegroundColor Red
    Write-Host "Please run 'git pull' first to get the latest changes." -ForegroundColor Yellow
    pause
    exit 1
}

if (-not (Test-Path $migration002)) {
    Write-Host "ERROR: Migration file not found: $migration002" -ForegroundColor Red
    Write-Host "Please run 'git pull' first to get the latest changes." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Found all migration files!" -ForegroundColor Green
Write-Host ""
Write-Host "This will run the following migrations:" -ForegroundColor Yellow
Write-Host "1. Add video fields to articles table" -ForegroundColor White
Write-Host "2. Add user authentication and profile tables" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue or Ctrl+C to cancel..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Running Migration 1: Video Fields" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
psql -U postgres -d healthpedhyan -f $migration001

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Migration 1 failed!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Running Migration 2: User Features" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
psql -U postgres -d healthpedhyan -f $migration002

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Migration 2 failed!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "All migrations completed successfully!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. npx prisma generate" -ForegroundColor White
Write-Host "2. pnpm dev" -ForegroundColor White
Write-Host ""
pause
