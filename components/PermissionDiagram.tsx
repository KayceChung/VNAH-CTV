"use client";

import React, { useState } from 'react';

const LEVELS = [
  {
    level: 1,
    title: 'Nhân viên cơ sở',
    subtitle: 'CTV, Y sĩ, Điều dưỡng, KTV...',
    badge: 'CẤP 1 - NHÂN VIÊN CƠ SỞ',
    positions: ['CTV', 'Y sĩ', 'Điều dưỡng', 'KTV', 'Khác'],
    permissions: [
      {
        group: '🔑 TRUY CẬP HỆ THỐNG',
        items: [
          'Đăng nhập hệ thống VNHA-QLNKT',
          'Xem dữ liệu trong phạm vi được phép',
        ],
      },
      {
        group: '➕ THÊM & CẬP NHẬT',
        items: [
          'Ghi nhận check in/out',
          'Ghi nhận hỗ trợ theo dõi CSTN',
          'Ghi nhận hỗ trợ theo dõi PHCN',
        ],
      },
      {
        group: '⚙️ TÀI KHOẢN CÁ NHÂN',
        items: [
          'Cập nhật thông tin cá nhân & liên hệ',
          'Thay đổi mật khẩu cá nhân',
        ],
      },
    ],
  },
  {
    level: 2,
    title: 'Nhân viên & Bác sĩ',
    subtitle: 'Mở & Quản lý chi tiết hồ sơ bệnh án',
    badge: 'CẤP 2 - NHÂN VIÊN & BÁC SĨ',
    positions: ['Nhân viên VNAH', 'Bác sĩ'],
    permissions: [
      {
        group: '📋 QUYỀN ĐỘC QUYỀN: THÊM & CẬP NHẬT HỒ SƠ CHI TIẾT (CSTN & PHCN)',
        items: [
          'Mở hồ sơ CSTN cho NKT',
          'Ghi nhận biểu mẫu KLS, VietPOST',
          'Ghi nhận biểu tái khám, theo dõi',
          'Ghi nhận biểu kiểm tra đánh giá',
          'Ghi nhận biểu mẫu kết thúc quản lý CSTN',
          'Chuyển tiếp hồ sơ & Ghi nhận hỗ trợ dụng cụ',
          'Mở hồ sơ PHCN cho NKT',
          'Ghi nhận biểu mẫu KLS (PHCN)',
          'Ghi nhận biểu mẫu WHODAS (Người lớn / Trẻ em)',
          'Ghi nhận biểu tái khám & theo dõi (PHCN)',
          'Ghi nhận biểu mẫu kết thúc quản lý PHCN',
        ],
      },
    ],
    inherit: {
      from: 'CẤP 1',
      items: [
        'Truy cập VNHA-QLNKT',
        'Ghi nhận Check in/out',
        'Ghi nhận theo dõi cơ bản',
        'Quản lý thông tin cá nhân',
      ],
    },
  },
  {
    level: 3,
    title: 'Quản lý khu vực',
    subtitle: 'Phê duyệt khu vực, quản lý tài khoản nhân viên',
    badge: 'CẤP 3 - QUẢN LÝ KHU VỰC',
    positions: ['Quản lý khu vực'],
    permissions: [
      {
        group: '🔐 THÊM, CẬP NHẬT & XÓA KHU VỰC',
        items: [
          'Phê duyệt dụng cụ cấp khu vực',
          'Xem toàn bộ bệnh nhân & giấy tờ trong phạm vi quản lý',
          'Xóa dữ liệu (Trong phạm vi khu vực được phân công)',
          'Quản lý & cấp tài khoản cho nhân viên cấp dưới trong khu vực',
        ],
      },
    ],
    inherit: {
      from: 'CẤP 1 & CẤP 2',
      items: [
        'Mở hồ sơ CSTN/PHCN',
        'Lên biểu mẫu KLS, WHODAS, VietPOST',
        'Chuyển tiếp hồ sơ',
        'Ghi nhận check in/out cơ sở',
      ],
    },
  },
  {
    level: 4,
    title: 'Giám đốc dự án',
    subtitle: 'Toàn quyền hệ thống, phê duyệt tối cao',
    badge: 'CẤP 4 - GIÁM ĐỐC DỰ ÁN (TỐI CAO)',
    positions: ['Giám đốc dự án'],
    permissions: [
      {
        group: '⭐ QUẢN TRỊ TOÀN HỆ THỐNG',
        items: [
          'Phê duyệt dụng cụ cấp Giám đốc',
          'Phê duyệt hồ sơ kết thúc & Quyết định đóng ca',
          'Xem toàn bộ dữ liệu bệnh nhân & giấy tờ trên toàn hệ thống',
          'Xuất báo cáo tổng hợp toàn hệ thống',
        ],
      },
      {
        group: '🛠️ KIỂM SOÁT TẤC CẢ TÀI KHOẢN & DỮ LIỆU',
        items: [
          'Xóa hoặc Khôi phục dữ liệu đã xóa',
          'Quản lý và cấp quyền tài khoản cho tất cả nhân sự (bao gồm QLKV)',
        ],
      },
    ],
    inherit: {
      from: 'CẤP 1 + 2 + 3',
      items: [
        'Bao gồm đầy đủ các quyền thao tác cơ sở, quyền chuyên môn của Bác sĩ và quyền kiểm soát của Quản lý khu vực.',
      ],
    },
  },
];

const badgeColors = [
  'bg-cyan-50 text-cyan-700 border-cyan-300',
  'bg-green-50 text-green-700 border-green-300',
  'bg-yellow-50 text-yellow-700 border-yellow-300',
  'bg-red-50 text-red-700 border-red-300',
];

const PermissionDiagram: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">📊 Sơ đồ phân quyền theo cấp độ</h1>
      <div className="text-sm text-slate-500 mb-8">Hệ thống VNHA-QLNKT • Chọn một cấp độ dưới đây để xem chi tiết các quyền độc quyền và quyền kế thừa.</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {LEVELS.map((lv, idx) => (
          <button
            key={lv.level}
            className={`rounded-xl border-2 p-5 text-left transition-all duration-200 ${active === idx ? 'shadow-lg scale-105 border-cyan-500 bg-cyan-50' : 'border-slate-200 bg-white hover:-translate-y-1 hover:shadow'} `}
            onClick={() => setActive(idx)}
          >
            <div className="uppercase font-bold text-xs mb-1">CẤP {lv.level}</div>
            <div className="font-semibold text-base mb-2">{lv.title}</div>
            <div className="text-xs text-slate-500">{lv.subtitle}</div>
          </button>
        ))}
      </div>
      <div>
        {LEVELS.map((lv, idx) => (
          <div key={lv.level} className={active === idx ? 'block animate-fadeIn' : 'hidden'}>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <span className={`font-bold text-sm px-4 py-2 rounded-full border ${badgeColors[idx]}`}>{lv.badge}</span>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Chức danh áp dụng:</div>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {lv.positions.map((p) => (
                      <span key={p} className="bg-slate-50 border border-slate-200 rounded px-3 py-1 text-xs font-medium">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-2">
                {lv.permissions.map((group, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <div className="font-semibold text-slate-700 mb-3 flex items-center gap-2">{group.group}</div>
                    <ul className="list-none space-y-2">
                      {group.items.map((item, j) => (
                        <li key={j} className="text-sm flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> <span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {lv.inherit && (
                <div className="mt-8 p-5 rounded-xl bg-slate-50 border-l-4 border-slate-400">
                  <div className="font-semibold text-slate-700 mb-2 flex items-center gap-2">🔄 Quyền kế thừa từ {lv.inherit.from}:</div>
                  <div className="flex flex-wrap gap-2 opacity-80">
                    {lv.inherit.items.map((item, i) => (
                      <span key={i} className="bg-white border border-slate-200 rounded px-3 py-1 text-xs font-medium">{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionDiagram;
