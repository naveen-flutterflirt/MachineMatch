'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { withRole } from '@/hoc/withRole';
import { AdminLayout, useGetAllAdminComparisons } from '@/features/admin';
import { Card, Badge, Button } from '@/common/components';
import { Scale, ArrowRight, UserCheck } from 'lucide-react';

function AdminComparisonsPage() {
  const router = useRouter();
  const { data: comparisonsData, isLoading } = useGetAllAdminComparisons();
  const comparisons: any[] = Array.isArray(comparisonsData) ? comparisonsData : comparisonsData?.data || [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Scale className="w-7 h-7 text-emerald-600" /> Saved Comparisons History ERP
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            System-wide buyer machinery side-by-side comparison sessions and MCDA fit score logs.
          </p>
        </div>
      </div>

      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading comparison records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100/80 text-slate-800 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Comparison Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Machines Count</th>
                  <th className="p-4">User / Creator</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No comparison session records found.
                    </td>
                  </tr>
                ) : (
                  comparisons.map((c) => {
                    const userName = c.user
                      ? c.user.firstName
                        ? `${c.user.firstName} ${c.user.lastName || ''}`.trim()
                        : c.user.email
                      : 'Guest User';

                    const formattedDate = c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A';

                    const machineNames = c.items
                      ? c.items.map((i: any) => i.machine?.modelName).filter(Boolean)
                      : [];

                    const machineCategoryName = c.items && c.items[0]?.machine?.category?.name
                      ? c.items[0].machine.category.name
                      : c.category?.name || 'Heavy Machinery';

                    const displayTitle = c.title && !c.title.includes('Side-by-Side Comparison') && c.title !== 'Machinery Comparison'
                      ? c.title
                      : (machineNames.length > 1 ? machineNames.join(' vs ') : (machineNames[0] || 'Machinery Spec Comparison'));

                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-50 transition cursor-pointer group"
                        onClick={() => router.push(`/user/compare?id=${c.id}`)}
                      >
                        <td className="p-4 font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {displayTitle}
                        </td>
                        <td className="p-4">
                          <Badge variant="primary">{machineCategoryName}</Badge>
                        </td>
                        <td className="p-4 font-mono text-xs font-bold text-emerald-700">
                          {c.items?.length || 0} Machine(s)
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-2">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{userName}</span>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-500" suppressHydrationWarning>
                          {formattedDate}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="primary"
                            size="sm"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/user/compare?id=${c.id}`);
                            }}
                          >
                            Open Matrix
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}

export default withRole(AdminComparisonsPage, ['admin']);
