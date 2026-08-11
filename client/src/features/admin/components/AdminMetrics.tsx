'use client';

import React from 'react';
import { Card, Badge } from '@/common/components';
import { Users, Cpu, FileText, Building2 } from 'lucide-react';

interface AdminMetricsProps {
  summaryData?: any;
}

export function AdminMetrics({ summaryData }: AdminMetricsProps) {
  const totalUsers = summaryData?.totalUsers !== undefined ? summaryData.totalUsers : 1;
  const totalMachines = summaryData?.totalMachines !== undefined ? summaryData.totalMachines : 0;
  const totalUploads = summaryData?.totalUploads !== undefined ? summaryData.totalUploads : 0;
  const totalVendors = summaryData?.totalVendors !== undefined ? summaryData.totalVendors : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Platform Users</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">{totalUsers}</div>
        <Badge variant="success" size="sm" className="mt-2">
          Registered Accounts
        </Badge>
      </Card>

      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Machinery</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">{totalMachines}</div>
        <Badge variant="primary" size="sm" className="mt-2">
          Active Models
        </Badge>
      </Card>

      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">PDF Brochures</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">{totalUploads}</div>
        <Badge variant="warning" size="sm" className="mt-2">
          Brochures Processed
        </Badge>
      </Card>

      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Vendors</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-emerald-700">{totalVendors}</div>
        <Badge variant="emeraldBest" size="sm" className="mt-2">
          OEM Vendors Active
        </Badge>
      </Card>
    </div>
  );
}
