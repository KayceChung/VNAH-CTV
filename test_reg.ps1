$gasUrl = "https://script.google.com/macros/s/AKfycbwSUSTtfPuD-Hzd9gJfTfmzxh13TXMP4EKawkOOEJ5WptasXFfDU-L2bKMtZl_y-HvepA/exec"

Write-Host "Testing Registration..." -ForegroundColor Cyan

$payload = @{ 
    action = "verifyIdentity"
    full_name = "Test Employee"
    phone = "0987654321"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $gasUrl -Method Post -ContentType "application/json" -Body $payload -UseBasicParsing -TimeoutSec 30
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.found) {
        Write-Host "PASS: Employee Record Found" -ForegroundColor Green
        Write-Host ""
        Write-Host "ID: $($data.employee.ID_Employees)"
        Write-Host "Name: $($data.employee.Name)"
        Write-Host "Email: $($data.employee.Email)"
        Write-Host "Phone: $($data.employee.Phone)"
        Write-Host "DoB: $($data.employee.DoB)"
        Write-Host "Sex: $($data.employee.Sex)"
        Write-Host "Zalo: $($data.employee.Zalo)"
        Write-Host "Working_at: $($data.employee.Working_at)"
        Write-Host "Ward: $($data.employee.Ward)"
        Write-Host "Status: $($data.employee.Status)" -ForegroundColor Red
        Write-Host ""
        
        if ($data.employee.Status -like "*DEACTIVATE*") {
            Write-Host "PASS: Status is correctly DEACTIVATE" -ForegroundColor Green
        } else {
            Write-Host "FAIL: Status should be DEACTIVATE" -ForegroundColor Red
        }
    } else {
        Write-Host "FAIL: Employee not found" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
}
