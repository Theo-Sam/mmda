# PowerShell script to activate Python virtual environment
Write-Host "Activating Python virtual environment..." -ForegroundColor Green

# Check if .venv exists
if (Test-Path ".venv\Scripts\Activate.ps1") {
    & .venv\Scripts\Activate.ps1
    Write-Host "✅ Virtual environment activated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run your Python scripts:" -ForegroundColor Cyan
    Write-Host "  python create_test_users.py" -ForegroundColor White
    Write-Host "  python run_migrations.py" -ForegroundColor White
    Write-Host ""
    Write-Host "To deactivate, type: deactivate" -ForegroundColor Yellow
} else {
    Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
    Write-Host "Please run: python -m venv .venv" -ForegroundColor Yellow
}
