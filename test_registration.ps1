$gasUrl = "https://script.google.com/macros/s/AKfycbwSUSTtfPuD-Hzd9gJfTfmzxh13TXMP4EKawkOOEJ5WptasXFfDU-L2bKMtZl_y-HvepA/exec"

Write-Host "Testing Registration..." -ForegroundColor Cyan
Write-Host ""

# Test if new employee exists in Sheets
$payload = @{ 
    action = "verifyIdentity"
    full_name = "Test Employee"
    phone = "0987654321"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $gasUrl -Method Post -ContentType "application/json" -Body $payload -UseBasicParsing -TimeoutSec 30
    $content = $response.Content
    $data = $content | ConvertFrom-Json
    
    if ($data.found) {
        Write-Host "✅ Employee Record Found!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Employee Details:" -ForegroundColor Yellow
        Write-Host "  ID: $($data.employee.ID_Employees)"
        Write-Host "  Name: $($data.employee.Name)"
        Write-Host "  Email: $($data.employee.Email)"
        Write-Host "  Phone: $($data.employee.Phone)"
        Write-Host "  DoB: $($data.employee.DoB)"
        Write-Host "  Sex: $($data.employee.Sex)"
        Write-Host "  Zalo: $($data.employee.Zalo)"
        Write-Host "  Working_at: $($data.employee.Working_at)"
        Write-Host "  Ward: $($data.employee.Ward)"
        Write-Host "  Status: $($data.employee.Status)" -ForegroundColor $(if ($data.employee.Status -like "*DEACTIVATE*") { "Red" } else { "Green" })
        Write-Host ""
        
        if ($data.employee.Status -like "*DEACTIVATE*") {
            Write-Host "✅ SECURITY CHECK PASSED!" -ForegroundColor Green
            Write-Host "   → Status is correctly set to: $($data.employee.Status)"
            Write-Host "   → Account requires Admin approval before activation"
        } else {
            Write-Host "❌ SECURITY ERROR: Status should be DEACTIVATE!" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Employee not found: $($data.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API Error: $_" -ForegroundColor Red
}
