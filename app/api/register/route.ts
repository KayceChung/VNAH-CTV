import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;

interface RegisterPayload {
  id_employees: string;
  password: string;
  name: string;
  dob: string;
  sex: string;
  agency_type: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  phone: string;
  zalo: string;
  email: string;
  working_at: string;
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
    'agency_type',
    'province',
    'district',
    'ward',
    'address_detail',
    'phone',
    'email',
    'working_at',
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
      agency_type,
      province,
      district,
      ward,
      address_detail,
      phone,
      zalo,
      email,
      working_at,
    } = body as RegisterPayload;

    // Step 2: Validate username format (3-20 chars, letters/numbers/underscore only)
    const id = id_employees.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tên đăng nhập phải 3-20 ký tự, chỉ gồm chữ, số, dấu gạch dưới',
          field: 'id_employees',
        },
        { status: 400 }
      );
    }

    // Step 3: Validate password strength
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
          field: 'password',
        },
        { status: 400 }
      );
    }

    // Step 4: Validate name does not contain special characters
    if (!/^[\p{L}\s]+$/u.test(name.trim())) {
      return NextResponse.json(
        { success: false, message: 'Họ tên không được chứa ký tự đặc biệt', field: 'name' },
        { status: 400 }
      );
    }

    // Step 5: Validate email format
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Email không đúng định dạng', field: 'email' },
        { status: 400 }
      );
    }

    // Step 6: Validate phone format (10 digits and starts with 0)
    const normalizedPhone = normalizePhone(phone);
    if (!/^0\d{9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số', field: 'phone' },
        { status: 400 }
      );
    }

    // Step 7: Validate Zalo (if provided)
    const normalizedZalo = normalizePhone(zalo);
    if (zalo && !/^0\d{9}$/.test(normalizedZalo)) {
      return NextResponse.json(
        { success: false, message: 'Số Zalo phải bắt đầu bằng 0 và có đúng 10 chữ số', field: 'zalo' },
        { status: 400 }
      );
    }

    const fullAddress = `${address_detail.trim()}, ${ward.trim()}, ${district.trim()}, ${province.trim()}`;

    // Step 8: Generate UUID for ID_number (unique employee system identifier)
    const idNumber = generateUUID();

    // Step 9: Prepare GAS payload
    const gasPayload = {
      action: 'registerEmployee',
      id_number: idNumber, // UUID for column A
      id_employees: id_employees.trim(),
      password: password,
      name: name.trim(),
      dob: dob.trim(),
      sex: sex.trim(),
      agency_type: agency_type.trim(),
      province: province.trim(),
      district: district.trim(),
      address: fullAddress,
      phone: normalizedPhone,
      zalo: normalizedZalo,
      email: email.trim().toLowerCase(),
      working_at: working_at.trim(),
      ward: ward.trim(),
    };

    // Step 10: Call Google Apps Script to register
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

    // Step 11: Return success response
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
