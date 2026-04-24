'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

type FieldName = keyof RegisterFormData;
type FieldErrors = Partial<Record<FieldName | 'passwordConfirm', string>>;

type ProvinceItem = {
  code: number;
  name: string;
};

const AGENCY_TYPES = [
  'Bệnh viện',
  'Trung tâm y tế',
  'Trạm y tế',
  'Sở y tế',
  'Phòng khám',
  'Khác',
];

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showOptionalContact, setShowOptionalContact] = useState(false);
  const [showImportantNotes, setShowImportantNotes] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [districts, setDistricts] = useState<ProvinceItem[]>([]);
  const [wards, setWards] = useState<ProvinceItem[]>([]);
  const [locationLoading, setLocationLoading] = useState({
    province: false,
    district: false,
    ward: false,
  });
  const firstInvalidFieldRef = useRef<string | null>(null);

  const [form, setForm] = useState<RegisterFormData>({
    id_employees: '',
    password: '',
    passwordConfirm: '',
    name: '',
    dob: '',
    sex: '',
    agency_type: '',
    province: '',
    district: '',
    ward: '',
    address_detail: '',
    phone: '',
    zalo: '',
    email: '',
    working_at: '',
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

    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  useEffect(() => {
    async function loadProvinces() {
      setLocationLoading((prev) => ({ ...prev, province: true }));

      try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch {
        pushToast('Không thể tải danh sách Tỉnh/Thành phố.', 'error');
      } finally {
        setLocationLoading((prev) => ({ ...prev, province: false }));
      }
    }

    loadProvinces();
  }, [pushToast]);

  useEffect(() => {
    async function loadDistricts() {
      if (!form.province) {
        setDistricts([]);
        setWards([]);
        return;
      }

      setLocationLoading((prev) => ({ ...prev, district: true }));

      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${form.province}?depth=2`);
        const data = await response.json();
        const items = Array.isArray(data?.districts) ? data.districts : [];
        setDistricts(items);
        setWards([]);
      } catch {
        pushToast('Không thể tải danh sách Huyện/Quận.', 'error');
      } finally {
        setLocationLoading((prev) => ({ ...prev, district: false }));
      }
    }

    loadDistricts();
  }, [form.province, pushToast]);

  useEffect(() => {
    async function loadWards() {
      if (!form.district) {
        setWards([]);
        return;
      }

      setLocationLoading((prev) => ({ ...prev, ward: true }));

      try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${form.district}?depth=2`);
        const data = await response.json();
        const items = Array.isArray(data?.wards) ? data.wards : [];
        setWards(items);
      } catch {
        pushToast('Không thể tải danh sách Xã/Phường.', 'error');
      } finally {
        setLocationLoading((prev) => ({ ...prev, ward: false }));
      }
    }

    loadWards();
  }, [form.district, pushToast]);

  function selectLocation(
    key: 'province' | 'district' | 'ward',
    value: string
  ) {
    setForm((prev) => {
      if (key === 'province') {
        return {
          ...prev,
          province: value,
          district: '',
          ward: '',
        };
      }

      if (key === 'district') {
        return {
          ...prev,
          district: value,
          ward: '',
        };
      }

      return {
        ...prev,
        ward: value,
      };
    });

    if (key === 'province') {
      setErrors((prev) => ({
        ...prev,
        province: undefined,
        district: undefined,
        ward: undefined,
      }));
      return;
    }

    if (key === 'district') {
      setErrors((prev) => ({
        ...prev,
        district: undefined,
        ward: undefined,
      }));
      return;
    }

    if (errors.ward) {
      setErrors((prev) => ({ ...prev, ward: undefined }));
    }
  }

  function getNameByCode(items: ProvinceItem[], code: string): string {
    const found = items.find((item) => String(item.code) === code);
    return found?.name || '';
  }

  const validateForm = (): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!form.id_employees.trim()) {
      nextErrors.id_employees = 'Gợi ý: Bạn chưa nhập tên đăng nhập';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.id_employees.trim())) {
      nextErrors.id_employees = 'Tên đăng nhập phải 3-20 ký tự, chỉ gồm chữ, số, dấu gạch dưới';
    }

    if (!form.password) {
      nextErrors.password = 'Mật khẩu không được để trống';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(form.password)) {
      nextErrors.password = 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    }

    if (!form.passwordConfirm) {
      nextErrors.passwordConfirm = 'Vui lòng xác nhận mật khẩu';
    } else if (form.password !== form.passwordConfirm) {
      nextErrors.passwordConfirm = 'Mật khẩu xác nhận không khớp';
    }

    if (!form.name.trim()) {
      nextErrors.name = 'Họ tên không được để trống';
    } else if (!/^[\p{L}\s]+$/u.test(form.name.trim())) {
      nextErrors.name = 'Họ tên không được chứa ký tự đặc biệt';
    }

    if (!form.dob) {
      nextErrors.dob = 'Ngày sinh không được để trống';
    }

    if (!form.sex) {
      nextErrors.sex = 'Vui lòng chọn giới tính';
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^0\d{9}$/.test(form.phone.replace(/\s|-/g, ''))) {
      nextErrors.phone = 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số';
    }

    if (form.zalo && !/^0\d{9}$/.test(form.zalo.replace(/\s|-/g, ''))) {
      nextErrors.zalo = 'Số Zalo phải bắt đầu bằng 0 và có đúng 10 chữ số';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Email không đúng định dạng';
    }

    if (!form.agency_type) {
      nextErrors.agency_type = 'Vui lòng chọn loại cơ quan';
    }

    if (!form.province) {
      nextErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
    }

    if (!form.district) {
      nextErrors.district = 'Vui lòng chọn Huyện/Quận';
    }

    if (!form.ward) {
      nextErrors.ward = 'Vui lòng chọn Xã/Phường';
    }

    if (!form.working_at.trim()) {
      nextErrors.working_at = 'Nơi làm việc không được để trống';
    }

    if (!form.address_detail.trim()) {
      nextErrors.address_detail = 'Địa chỉ chi tiết không được để trống';
    }

    return nextErrors;
  };

  function focusFirstInvalidField(nextErrors: FieldErrors) {
    const firstField = Object.keys(nextErrors)[0];
    if (!firstField) {
      return;
    }

    firstInvalidFieldRef.current = firstField;

    setTimeout(() => {
      const el = document.querySelector(`[name="${firstInvalidFieldRef.current}"]`) as HTMLElement | null;
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }

  function fieldClass(field: keyof FieldErrors) {
    const hasError = Boolean(errors[field]);
    return `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition ${
      hasError ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-blue-500'
    }`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      pushToast('Vui lòng kiểm tra các trường đang báo lỗi.', 'error');
      focusFirstInvalidField(nextErrors);
      return;
    }

    setLoading(true);

    const provinceName = getNameByCode(provinces, form.province);
    const districtName = getNameByCode(districts, form.district);
    const wardName = getNameByCode(wards, form.ward);

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
          agency_type: form.agency_type,
          province: provinceName,
          district: districtName,
          ward: wardName,
          address_detail: form.address_detail,
          phone: form.phone,
          zalo: form.zalo,
          email: form.email,
          working_at: form.working_at,
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
        if (result.field && typeof result.field === 'string') {
          setErrors((prev) => ({ ...prev, [result.field]: result.message || 'Giá trị không hợp lệ' }));
          focusFirstInvalidField({ [result.field]: result.message || 'Giá trị không hợp lệ' });
        }
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

  const passwordChecks = [
    { key: 'length', label: 'Ít nhất 8 ký tự', valid: form.password.length >= 8 },
    { key: 'upper', label: 'Có ít nhất 1 chữ hoa', valid: /[A-Z]/.test(form.password) },
    { key: 'lower', label: 'Có ít nhất 1 chữ thường', valid: /[a-z]/.test(form.password) },
    { key: 'number', label: 'Có ít nhất 1 chữ số', valid: /\d/.test(form.password) },
    { key: 'special', label: 'Có ít nhất 1 ký tự đặc biệt', valid: /[^A-Za-z\d]/.test(form.password) },
  ];

  const showPasswordConfirm = Boolean(form.password || form.passwordConfirm || errors.passwordConfirm);
  const showZaloField = Boolean(showOptionalContact || form.zalo || errors.zalo);

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
            {/* Row 1: Username & Password */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên đăng nhập *
                </label>
                <input
                  type="text"
                  name="id_employees"
                  value={form.id_employees}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: khang1306"
                  className={fieldClass('id_employees')}
                  disabled={loading}
                />
                {errors.id_employees ? (
                  <p className="text-xs text-red-600 mt-1">{errors.id_employees}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">3-20 ký tự (chữ, số, gạch dưới)</p>
                )}
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
                  placeholder="Tối thiểu 8 ký tự"
                  className={fieldClass('password')}
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
                    <div className="mt-2 space-y-1">
                      {passwordChecks.map((item) => (
                        <p
                          key={item.key}
                          className={`text-xs ${item.valid ? 'text-green-700' : 'text-slate-500'}`}
                        >
                          {item.valid ? '✓' : '•'} {item.label}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                {errors.password ? <p className="text-xs text-red-600 mt-1">{errors.password}</p> : null}
              </div>
            </div>

            {/* Row 2: Password Confirm */}
            {showPasswordConfirm ? (
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
                  className={fieldClass('passwordConfirm')}
                  disabled={loading}
                />
                {errors.passwordConfirm ? <p className="text-xs text-red-600 mt-1">{errors.passwordConfirm}</p> : null}
                {form.password && form.passwordConfirm && form.password !== form.passwordConfirm && (
                  <p className="text-xs text-red-600 mt-1">❌ Mật khẩu không khớp</p>
                )}
                {form.password && form.passwordConfirm && form.password === form.passwordConfirm && (
                  <p className="text-xs text-green-600 mt-1">✓ Mật khẩu khớp</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500 -mt-2">Nhập mật khẩu để hiển thị ô xác nhận mật khẩu.</p>
            )}

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
                  className={fieldClass('name')}
                  disabled={loading}
                />
                {errors.name ? <p className="text-xs text-red-600 mt-1">{errors.name}</p> : null}
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
                  className={fieldClass('dob')}
                  disabled={loading}
                />
                {errors.dob ? <p className="text-xs text-red-600 mt-1">{errors.dob}</p> : null}
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
                  className={fieldClass('sex')}
                  disabled={loading}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Không xác định">Không xác định</option>
                </select>
                {errors.sex ? <p className="text-xs text-red-600 mt-1">{errors.sex}</p> : null}
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
                  className={fieldClass('phone')}
                  disabled={loading}
                />
                {errors.phone ? <p className="text-xs text-red-600 mt-1">{errors.phone}</p> : null}
              </div>
            </div>

            {/* Row 5: Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Thông tin liên hệ</p>
                <button
                  type="button"
                  onClick={() => setShowOptionalContact((prev) => !prev)}
                  className="text-xs font-medium text-blue-700 hover:text-blue-900"
                >
                  {showZaloField ? 'Ẩn số Zalo (tuỳ chọn)' : 'Thêm số Zalo (tuỳ chọn)'}
                </button>
              </div>

              <div className={`grid grid-cols-1 ${showZaloField ? 'lg:grid-cols-2' : ''} gap-6`}>
                {showZaloField ? (
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
                      className={fieldClass('zalo')}
                      disabled={loading}
                    />
                    {errors.zalo ? <p className="text-xs text-red-600 mt-1">{errors.zalo}</p> : null}
                  </div>
                ) : null}

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
                    className={fieldClass('email')}
                    disabled={loading}
                  />
                  {errors.email ? <p className="text-xs text-red-600 mt-1">{errors.email}</p> : null}
                </div>
              </div>
            </div>

            {/* Row 6: Agency Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại cơ quan *
              </label>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 rounded-lg border p-3 ${errors.agency_type ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                {AGENCY_TYPES.map((agencyType) => (
                  <label key={agencyType} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="agency_type"
                      value={agencyType}
                      checked={form.agency_type === agencyType}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="h-4 w-4"
                    />
                    <span>{agencyType}</span>
                  </label>
                ))}
              </div>
              {errors.agency_type ? <p className="text-xs text-red-600 mt-1">{errors.agency_type}</p> : null}
            </div>

            {/* Row 7: Province/District/Ward */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tỉnh/Thành phố *
                </label>
                <select
                  name="province"
                  value={form.province}
                  onChange={(event) => selectLocation('province', event.target.value)}
                  className={fieldClass('province')}
                  disabled={loading || locationLoading.province}
                >
                  <option value="">-- Chọn Tỉnh/Thành phố --</option>
                  {provinces.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.province ? <p className="text-xs text-red-600 mt-1">{errors.province}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Huyện/Quận *
                </label>
                <select
                  name="district"
                  value={form.district}
                  onChange={(event) => selectLocation('district', event.target.value)}
                  className={fieldClass('district')}
                  disabled={loading || !form.province || locationLoading.district}
                >
                  <option value="">-- Chọn Huyện/Quận --</option>
                  {districts.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.district ? <p className="text-xs text-red-600 mt-1">{errors.district}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xã/Phường *
                </label>
                <select
                  name="ward"
                  value={form.ward}
                  onChange={(event) => selectLocation('ward', event.target.value)}
                  className={fieldClass('ward')}
                  disabled={loading || !form.district || locationLoading.ward}
                >
                  <option value="">-- Chọn Xã/Phường --</option>
                  {wards.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.ward ? <p className="text-xs text-red-600 mt-1">{errors.ward}</p> : null}
              </div>
            </div>

            {/* Row 8: Working_at & Address Detail */}
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
                  className={fieldClass('working_at')}
                  disabled={loading}
                />
                {errors.working_at ? <p className="text-xs text-red-600 mt-1">{errors.working_at}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ chi tiết *
                </label>
                <input
                  type="text"
                  name="address_detail"
                  value={form.address_detail}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Số 12, đường Lý Thường Kiệt"
                  className={fieldClass('address_detail')}
                  disabled={loading}
                />
                {errors.address_detail ? <p className="text-xs text-red-600 mt-1">{errors.address_detail}</p> : null}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <LoadingSpinner label="Đang kiểm tra dữ liệu..." />
              ) : (
                '✅ Đăng Ký Tài Khoản'
              )}
            </button>

            {/* Info Box */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-gray-700">
              <button
                type="button"
                onClick={() => setShowImportantNotes((prev) => !prev)}
                className="w-full text-left font-semibold text-blue-800"
              >
                ℹ️ Lưu ý quan trọng {showImportantNotes ? '▲' : '▼'}
              </button>
              {showImportantNotes ? (
                <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                  <li>Tài khoản mới sẽ có trạng thái <span className="font-semibold text-red-600">❌ DEACTIVATE</span> sau khi đăng ký</li>
                  <li>Chỉ Admin mới có quyền phê duyệt và kích hoạt tài khoản</li>
                  <li>Dữ liệu được chuyển đến API đăng ký để xử lý và lưu trữ</li>
                  <li>Kiểm tra email để xác nhận sau khi đăng ký</li>
                </ul>
              ) : null}
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
