# VNAH - Cài đặt ứng dụng
# Script này mở ứng dụng AppSheet VNAH

# AppSheet URL
$appSheetUrl = "https://www.appsheet.com/start/44edd09d-1417-4503-a9aa-26111dd58fce?platform=desktop#appName=VNAH_QLNKT_VER30_PUBLIC-282194574&vss=H4sIAAAAAAAAA6WOMQ7CMBAE_7K1X-AWUSAEDYgGUzjxRbLi2FHsAJHlv3MJIOqI8uY0u5txt_Q4JV23kNf8u_Y0QSIrnKeeFKTCJvg0BKcgFI66e8PKad8qFJSb-MqJImRe4co_egWsIZ9sY2mYg2aNAz4Sv2eFwSKgCHRj0pWjZScLpTBrQj1GMhcesbY87vz22WtvDsFwXqNdpPICmI4eoVYBAAA=&view=blank"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VNAH QLNKT - Cai dat ung dung" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dang mo trinh duyet de cai dat ung dung..." -ForegroundColor Green
Write-Host ""

# Mo AppSheet URL
Start-Process $appSheetUrl

Write-Host "OK - Trinh duyet da duoc mo!" -ForegroundColor Green
Write-Host ""
Write-Host "Huong dan:" -ForegroundColor Cyan
Write-Host "1. Click nut 'Cai dat' de cai ung dung" -ForegroundColor White
Write-Host "2. Ung dung se duoc cai tren desktop" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 3

