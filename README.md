# VNAH QLDL CTV

Ung dung Next.js deploy tren Vercel, ket noi Google Apps Script Web App va Google Sheets de xac thuc bang ho ten va so dien thoai, sau do cho phep nguoi dung chinh sua thong tin, ten dang nhap va mat khau.

## Moi truong

Tao file `.env.local`:

```env
NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/AKfycbxF6nTaxsLEuv7nzPrJJ2YzBT3uS5GNotywcipYgZ306wKtSBynmFWSbRlYq92CKmugZg/exec
```

Apps Script hien tai:

- Web App URL: `https://script.google.com/macros/s/AKfycbxF6nTaxsLEuv7nzPrJJ2YzBT3uS5GNotywcipYgZ306wKtSBynmFWSbRlYq92CKmugZg/exec`
- Deployment ID: `AKfycbxF6nTaxsLEuv7nzPrJJ2YzBT3uS5GNotywcipYgZ306wKtSBynmFWSbRlYq92CKmugZg`

## Chay local

```bash
npm install
npm run dev
```

## Google Apps Script

- Copy ma trong `gas/Code.gs` vao Apps Script project gan voi Google Sheet.
- Deploy Web App voi `Execute as = Me` va `Who has access = Anyone`.
- Dat ten sheet la `Employees` hoac sua `SHEET_NAME` cho phu hop.
- Apps Script xac thuc theo cap `Name + Phone`.
- Apps Script cap nhat truc tiep cac cot `Name`, `ID Employess`, `Pass_word`, `Email`, `Address`, `Zalo`.
- He thong tu dong cap nhat `LAST_CHANGE_BY`, `LAST_CHANGE_AT`, `COUNT`, `UPDATE_AT` sau moi lan luu.

## Kiem thu nhanh Apps Script

```bash
curl -X POST "https://script.google.com/macros/s/AKfycbxF6nTaxsLEuv7nzPrJJ2YzBT3uS5GNotywcipYgZ306wKtSBynmFWSbRlYq92CKmugZg/exec" -d '{"action":"verifyIdentity","full_name":"Nguyen Van A","phone":"0901234567"}'
```