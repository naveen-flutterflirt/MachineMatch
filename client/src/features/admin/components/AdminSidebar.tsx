'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Scale,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users Management', href: '/admin/users', icon: Users },
    { label: 'Vendors Master', href: '/admin/vendors', icon: Building2 },
    { label: 'PDF Uploads & Extraction', href: '/admin/uploads', icon: FileText },
    { label: 'Saved Comparisons', href: '/admin/comparisons', icon: Scale },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between p-4 sticky top-16 z-30 shrink-0">
      <div className="space-y-6">
        {/* Admin ERP Header */}
        <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Super Admin ERP</span>
            <span className="text-[10px] text-emerald-700 font-mono">System Control v1.0</span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PostgreSQL DB Connected</span>
        </div>
        <p className="text-[10px] text-slate-500">Enterprise Machinery ERP</p>
      </div>
    </aside>
  );
}
