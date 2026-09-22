# SC-LogiX Startup Script
# Run this to start both frontend and backend servers

Write-Host "🚀 Starting SC-LogiX - Intelligent Supply Chain Control Hub" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "✓ Dependencies ready" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Starting Backend Server (Port 3001)..." -ForegroundColor Cyan

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host '🚀 SC-LogiX Backend Server' -ForegroundColor Cyan; node server.js"

# Wait for backend to start
Start-Sleep -Seconds 3

Write-Host "🎨 Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host '🎨 SC-LogiX Frontend Server' -ForegroundColor Cyan; npm run dev"

# Wait for frontend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ SC-LogiX is running!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 Backend API available at: http://localhost:3001/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 See DEMO_GUIDE.md for the recommended demo flow" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to open the application in your browser..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "🎉 Happy demoing!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the servers, close the PowerShell windows that opened." -ForegroundColor Yellow
