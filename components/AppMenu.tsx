"use client";

import { useState } from "react";

interface MenuItem {
  label: string;
  icon: string;
  action?: () => void;
}

interface AppMenuProps {
  items?: MenuItem[];
}

export function AppMenu({ items }: AppMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultItems: MenuItem[] = [
    { label: "Truyền", icon: "📤" },
    { label: "Lưu", icon: "💾" },
    { label: "Chia sẻ", icon: "📤" },
    { label: "Dịch", icon: "🌐" },
  ];

  const menuItems = items || defaultItems;

  const handleMenuClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition"
        aria-label="Menu"
        title="Menu"
      >
        <svg
          className="w-6 h-6 text-slate-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <p className="text-sm font-semibold text-slate-700">Lựa chọn</p>
          </div>

          {/* Menu Items */}
          <div>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 active:bg-slate-200 transition flex items-center gap-3 border-b border-slate-100 last:border-b-0"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-slate-900">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-2 bg-slate-50"></div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Overlay to close menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
