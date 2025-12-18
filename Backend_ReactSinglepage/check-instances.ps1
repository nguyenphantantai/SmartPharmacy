# PowerShell script để kiểm tra multiple instances
# Chạy: .\check-instances.ps1

Write-Host "🔍 Checking for multiple Node.js instances..." -ForegroundColor Cyan
Write-Host ""

# Tìm tất cả Node.js processes
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProcesses.Count -eq 0) {
    Write-Host "❌ No Node.js processes found" -ForegroundColor Red
    exit
}

Write-Host "📊 Found $($nodeProcesses.Count) Node.js process(es):" -ForegroundColor Yellow
Write-Host ""

foreach ($proc in $nodeProcesses) {
    Write-Host "  Process ID: $($proc.Id)" -ForegroundColor Green
    Write-Host "  Name: $($proc.ProcessName)" -ForegroundColor Gray
    Write-Host "  Start Time: $($proc.StartTime)" -ForegroundColor Gray
    Write-Host "  Memory: $([math]::Round($proc.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor Gray
    Write-Host ""
}

# Kiểm tra port 5000 (hoặc port bạn đang dùng)
Write-Host "🔌 Checking port 5000..." -ForegroundColor Cyan
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "  ✅ Port 5000 is in use by PID: $($port5000.OwningProcess)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Port 5000 is not in use" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check each instance's API usage: http://localhost:5000/api/gemini-usage" -ForegroundColor White
Write-Host "  2. Compare instanceId and apiKeyHash from each instance" -ForegroundColor White
Write-Host "  3. If apiKeyHash is the same but instanceId is different → Multiple instances sharing API key" -ForegroundColor White

