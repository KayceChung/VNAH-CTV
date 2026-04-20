'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface RegisterFormData {
  id_employees: string;
  password: string;
  passwordConfirm: string;
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

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RegisterFormData>({
    id_employees: '',
    password: '',
    passwordConfirm: '',
    name: '',
    dob: '',
    sex: '',
    address: '',
    phone: '',
    zalo: '',
    email: '',
    working_at: '',
    ward: ''
  });

  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  /**
   * Evaluate password strength
   * weak: < 6 chars
   * medium: 6-10 chars
   * strong: > 10 chars with mix of types
   */
  const evaluatePasswordStrength = (password: string) => {
    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length <= 10) {
      setPasswordStrength('medium');
    } else if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('medium');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'password') {
      evaluatePasswordStrength(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check all required fields
    if (!form.id_employees.trim()) errors.push('ID Nhân viên không được để trống');
    if (!form.password.trim()) errors.push('Mật khẩu không được để trống');
    if (!form.passwordConfirm.trim()) errors.push('Xác nhận mật khẩu không được để trống');
    if (!form.name.trim()) errors.push('Họ tên không được để trống');
    if (!form.dob.trim()) errors.push('Ngày sinh không được để trống');
    if (!form.sex.trim()) errors.push('Giới tính không được để trống');
    if (!form.address.trim()) errors.push('Địa chỉ không được để trống');
    if (!form.phone.trim()) errors.push('Số điện thoại không được để trống');
    if (!form.email.trim()) errors.push('Email không được để trống');
    if (!form.working_at.trim()) errors.push('Nơi làm việc không được để trống');
    if (!form.ward.trim()) errors.push('Phường/Xã không được để trống');

    // Validate ID format (alphanumeric + underscore only, 3-20 chars)
    if (form.id_employees && !/^[a-zA-Z0-9_]{3,20}$/.test(form.id_employees.trim())) {
      errors.push('ID Nhân viên phải chứa 3-20 ký tự (chữ, số, gạch dưới), không khoảng trắng');
    }

    // Validate password match
    if (form.password !== form.passwordConfirm) {
      errors.push('Mật khẩu không khớp');
    }

    // Validate password strength
    if (form.password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }

    // Validate email format
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.push('Email không đúng định dạng');
    }

    // Validate phone (Vietnamese: 10-11 digits starting with 0 or +84)
    const phoneRegex = /^(\+84|0)[1-9]\d{8,9}$/;
    if (form.phone && !phoneRegex.test(form.phone.replace(/\s|-/g, ''))) {
      errors.push('Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84, tối thiểu 10 số)');
    }

    // Validate Zalo if provided
    if (form.zalo && !phoneRegex.test(form.zalo.replace(/\s|-/g, ''))) {
      errors.push('Số Zalo không hợp lệ (phải bắt đầu bằng 0 hoặc +84, tối thiểu 10 số)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateForm();
    if (!validation.valid) {
      validation.errors.forEach(error => {
        pushToast(error, 'error');
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_employees: form.id_employees,
          password: form.password,
          name: form.name,
          dob: form.dob,
          sex: form.sex,
          address: form.address,
          phone: form.phone,
          zalo: form.zalo,
          email: form.email,
          working_at: form.working_at,
          ward: form.ward
        })
      });

      const result = await response.json();

      if (result.success) {
        pushToast(result.message, 'success');

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        pushToast(result.message || 'Đăng ký thất bại', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      pushToast(error instanceof Error ? error.message : 'Lỗi không xác định', 'error');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthColor = useMemo(() => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  }, [passwordStrength]);

  const passwordStrengthText = useMemo(() => {
    switch (passwordStrength) {
      case 'weak':
        return 'Yếu';
      case 'medium':
        return 'Trung bình';
      case 'strong':
        return 'Mạnh';
      default:
        return '';
    }
  }, [passwordStrength]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Đăng Ký Tài Khoản</h1>
          <p className="text-gray-600">Tạo tài khoản mới để quản lý thông tin nhân sự</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: ID_Employees & Password */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Nhân viên *
                </label>
                <input
                  type="text"
                  name="id_employees"
                  value={form.id_employees}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: john_doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">3-20 ký tự (chữ, số, gạch dưới)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${passwordStrengthColor} transition-all`} style={{ width: `${(form.password.length / 12) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{passwordStrengthText}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Password Confirm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận mật khẩu *
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              {form.password && form.passwordConfirm && form.password !== form.passwordConfirm && (
                <p className="text-xs text-red-600 mt-1">❌ Mật khẩu không khớp</p>
              )}
              {form.password && form.passwordConfirm && form.password === form.passwordConfirm && (
                <p className="text-xs text-green-600 mt-1">✓ Mật khẩu khớp</p>
              )}
            </div>

            {/* Row 3: Name & DoB */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Row 4: Sex & Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giới tính *
                </label>
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Row 5: Zalo & Email */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Zalo (Tuỳ chọn)
                </label>
                <input
                  type="tel"
                  name="zalo"
                  value={form.zalo}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: example@mail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Row 6: Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Địa chỉ *
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder="Ví dụ: 123 Đường Quốc Lộ 1, Thành phố Hồ Chí Minh"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>

            {/* Row 7: Working_at & Ward */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nơi làm việc *
                </label>
                <input
                  type="text"
                  name="working_at"
                  value={form.working_at}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Trụ sở chính"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phường/Xã *
                </label>
                <input
                  type="text"
                  name="ward"
                  value={form.ward}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Phường 1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner label="Đang xử lý..." />
                </>
              ) : (
                '✅ Đăng Ký Tài Khoản'
              )}
            </button>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-semibold mb-2">ℹ️ Lưu ý quan trọng:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Tài khoản mới sẽ có trạng thái <span className="font-semibold text-red-600">❌ DEACTIVATE</span> sau khi đăng ký</li>
                <li>Chỉ Admin mới có quyền phê duyệt và kích hoạt tài khoản</li>
                <li>Mật khẩu sẽ được mã hóa bảo mật trước khi lưu trữ</li>
                <li>Kiểm tra email để xác nhận sau khi đăng ký</li>
              </ul>
            </div>
          </form>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
