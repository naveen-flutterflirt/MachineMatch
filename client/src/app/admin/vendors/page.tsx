'use client';

import React from 'react';
import { withRole } from '@/hoc/withRole';
import { AdminLayout, useGetAllVendors } from '@/features/admin';
import { Card, Badge } from '@/common/components';
import { Building2, Globe, Mail, Phone, ShieldCheck } from 'lucide-react';
import { IVendor } from '@/types';

function AdminVendorsPage() {
  const { data: vendorsData, isLoading } = useGetAllVendors();
  const vendors: IVendor[] = Array.isArray(vendorsData) ? vendorsData : vendorsData?.data || [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-7 h-7 text-emerald-600" /> Vendors Master Record ERP
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View supplier master profiles, registered machinery OEMs, and verification badges.
          </p>
        </div>
      </div>

      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading vendor records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100/80 text-slate-800 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Vendor Company Name</th>
                  <th className="p-4">Contact Email</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No vendor master records found.
                    </td>
                  </tr>
                ) : (
                  vendors.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {v.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{v.name}</div>
                            <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                              {v.website || 'Verified OEM Manufacturer'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{v.contactEmail || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{v.contactPhone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{v.country || 'India'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={v.isVerified ? 'success' : 'secondary'}
                          icon={<ShieldCheck className="w-3 h-3" />}
                        >
                          {v.isVerified ? 'VERIFIED OEM' : 'STANDARD'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}

export default withRole(AdminVendorsPage, ['admin']);
