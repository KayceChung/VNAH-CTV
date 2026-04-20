import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;

interface RegisterPayload {
  id_employees: string;
  password: string;
  name: string;
  dob: string;
  sex: string;
  address: string;
  phone: string;
  zalo: string;
  email: string;
  working_at: string;
  ward: string;
}

/**
 * Validate email format (RFC 5322 simplified)
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnamese format: 10-11 digits)
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+84|0)[1-9]\d{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Normalize phone to remove spaces/dashes
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\s|-/g, '');
}

/**
 * Generate UUID v4 for unique employee ID
 */
function generateUUID(): string {
  return uuidv4();
}

/**
 * Validate all required fields
 */
function validateRequired(data: Partial<RegisterPayload>): { valid: boolean; error?: string } {
  const requiredFields = [
    'id_employees',
    'password',
    'name',
    'dob',
    'sex',
    'address',
    'phone',
    'email',
    'working_at',
    'ward'
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof RegisterPayload] || String(data[field as keyof RegisterPayload]).trim() === '') {
      return { valid: false, error: `Trường "${field}" không được để trống` };
    }
  }

  return { valid: true };
}

/**
 * Call Google Apps Script backend to register employee
 */
async function callGAS(payload: any): Promise<any> {
  try {
    const response = await fetch(GAS_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`GAS returned status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling GAS:', error);
    throw error;
  }
}

/**
 * POST /api/register
 * Register a new employee account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Step 1: Validate all required fields exist and not empty
    const requiredValidation = validateRequired(body);
    if (!requiredValidation.valid) {
      return NextResponse.json(
        { success: false, message: requiredValidation.error },
        { status: 400 }
      );
    }

    const {
      id_employees,
      password,
      name,
      dob,
      sex,
      address,
      phone,
      zalo,
      email,
      working_at,
      ward
    } = body as RegisterPayload;

    // Step 2: Validate ID_Employees format (should be alphanumeric, 3-20 chars)
    const idRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!idRegex.test(id_employees.trim())) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'ID_Employees phải chứa 3-20 ký tự (chữ, số, gạch dưới), không được có khoảng trắng hoặc ký tự đặc biệt' 
        },
        { status: 400 }
      );
    }

    // Step 3: Validate password strength (min 6 chars)
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có tối thiểu 6 ký tự' },
        { status: 400 }
      );
    }

    // Step 4: Validate email format
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Email không đúng định dạng' },
        { status: 400 }
      );
    }

    // Step 5: Validate phone format
    const normalizedPhone = normalizePhone(phone);
    if (!isValidPhone(normalizedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Số điện thoại không hợp lệ (phải là số VN: 09xxxxxxxx hoặc +84xxxxxxxxx)' },
        { status: 400 }
      );
    }

    // Step 6: Validate Zalo (if provided, should be valid phone format)
    const normalizedZalo = normalizePhone(zalo);
    if (zalo && !isValidPhone(normalizedZalo)) {
      return NextResponse.json(
        { success: false, message: 'Số Zalo không hợp lệ (phải là số VN: 09xxxxxxxx hoặc +84xxxxxxxxx)' },
        { status: 400 }
      );
    }

    // Step 7: Generate UUID for ID_number (unique employee system identifier)
    const idNumber = generateUUID();

    // Step 8: Prepare GAS payload (with PLAIN TEXT password - will be saved as-is in Sheet)
    const gasPayload = {
      action: 'registerEmployee',
      id_number: idNumber, // UUID for column A
      id_employees: id_employees.trim(),
      password: password, // ← PLAIN TEXT (saved directly to Sheet)
      name: name.trim(),
      dob: dob.trim(),
      sex: sex.trim(),
      address: address.trim(),
      phone: normalizedPhone,
      zalo: normalizedZalo,
      email: email.trim().toLowerCase(),
      working_at: working_at.trim(),
      ward: ward.trim(),
      // Status will be set by GAS to "❌ DEACTIVATE" - NOT set here to prevent tampering
    };

    // Step 9: Call Google Apps Script to register
    // GAS will:
    // - Check if ID_Employees already exists (prevent duplicates)
    // - Check if Email already exists (prevent duplicates)
    // - Save plain text password directly to Sheet
    // - Store UUID in ID_number column (column A)
    // - Add Status = "❌ DEACTIVATE" automatically
    // - Add LAST_CHANGE_BY, LAST_CHANGE_AT, COUNT, UPDATE_AT
    const gasResult = await callGAS(gasPayload);

    if (!gasResult.success) {
      return NextResponse.json(
        { success: false, message: gasResult.message || 'Đăng ký thất bại' },
        { status: 400 }
      );
    }

    // Step 10: Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký tài khoản thành công! Chờ Admin phê duyệt để kích hoạt.',
        employee: {
          id_employees: gasResult.employee?.ID_Employees,
          name: gasResult.employee?.Name,
          status: gasResult.employee?.Status // Should be "❌ DEACTIVATE"
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Lỗi máy chủ không xác định'
      },
      { status: 500 }
    );
  }
}
