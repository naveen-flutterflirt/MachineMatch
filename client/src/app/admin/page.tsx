'use client';

import React from 'react';
import Link from 'next/link';
import { withRole } from '@/hoc/withRole';
import {
  AdminLayout,
  AdminMetrics,
  useGetSearchSummary,
  useGetAllUploads,
  useGetAllAdminComparisons,
} from '@/features/admin';
import { Card, Badge, Button } from '@/common/components';
import { ShieldCheck, FileText, Scale, ArrowRight, UserCheck } from 'lucide-react';

function AdminDashboardPage() {
  const { data: summaryData } = useGetSearchSummary();
  const { data: uploadsData } = useGetAllUploads();
  const { data: comparisonsData } = useGetAllAdminComparisons();

  const recentUploads = (Array.isArray(uploadsData) ? uploadsData : uploadsData?.data || []).slice(0, 5);
  const recentComparisons = (Array.isArray(comparisonsData) ? comparisonsData : comparisonsData?.data || []).slice(0, 5);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> System Administrator Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin ERP Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time platform metrics, brochure spec extraction pipeline, and recent activity telemetry.
          </p>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <AdminMetrics summaryData={summaryData} />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent PDF Uploads Feed */}
        <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Recent PDF Uploads</h3>
            </div>
            <Link href="/admin/uploads">
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="space-y-3">
            {recentUploads.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No recent PDF uploads logged.</p>
            ) : (
              recentUploads.map((u: any) => {
                const uploaderName = u.uploader
                  ? u.uploader.firstName
                    ? `${u.uploader.firstName} ${u.uploader.lastName || ''}`.trim()
                    : u.uploader.email
                  : 'Guest User';

                const formattedTime = u.createdAt
                  ? new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div
                    key={u.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block line-clamp-1">{u.originalName}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <UserCheck className="w-3 h-3 text-emerald-600" /> {uploaderName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="success" size="sm">
                        VISION AI
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono block mt-1" suppressHydrationWarning>
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Recent Machinery Comparisons Feed */}
        <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Recent Comparison Sessions</h3>
            </div>
            <Link href="/admin/comparisons">
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline">
                View History <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="space-y-3">
            {recentComparisons.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No recent comparison sessions logged.</p>
            ) : (
              recentComparisons.map((c: any) => {
                const creatorName = c.user
                  ? c.user.firstName
                    ? `${c.user.firstName} ${c.user.lastName || ''}`.trim()
                    : c.user.email
                  : 'Guest User';

                const formattedTime = c.createdAt
                  ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div
                    key={c.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                          {c.title || 'Side-by-Side Spec Matrix'}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <UserCheck className="w-3 h-3 text-emerald-600" /> {creatorName} • {c.items?.length || 0} Models
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Link href={`/user/compare?id=${c.id}`}>
                        <Button variant="outline" size="sm" className="text-[11px] py-1 px-2.5 h-auto">
                          Matrix
                        </Button>
                      </Link>
                      <span className="text-[10px] text-slate-400 font-mono block mt-1" suppressHydrationWarning>
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default withRole(AdminDashboardPage, ['admin']);
