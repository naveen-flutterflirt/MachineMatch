'use client';

import React from 'react';
import { withRole } from '@/hoc/withRole';
import { AdminLayout, useGetAllUploads } from '@/features/admin';
import { Card, Badge, Button } from '@/common/components';
import { FileText, ExternalLink, UserCheck, Clock } from 'lucide-react';
import { IUploadRecord } from '@/types';

function AdminUploadsPage() {
  const { data: uploadsData, isLoading } = useGetAllUploads();
  const uploads: IUploadRecord[] = Array.isArray(uploadsData) ? uploadsData : uploadsData?.data || [];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <FileText className="w-7 h-7 text-emerald-600" /> PDF Uploads & Gemini OCR Logs ERP
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            System-wide OEM PDF brochure upload history and Gemini Vision OCR extraction logs.
          </p>
        </div>
      </div>

      <Card hoverEffect={false} className="border-slate-200/80 bg-white shadow-sm overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 font-medium">Loading upload history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100/80 text-slate-800 uppercase text-xs tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Original File Name</th>
                  <th className="p-4">Uploader / User</th>
                  <th className="p-4">File Size</th>
                  <th className="p-4">OCR Status</th>
                  <th className="p-4">Upload Timestamp</th>
                  <th className="p-4 text-right">Document Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uploads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No brochure upload records found.
                    </td>
                  </tr>
                ) : (
                  uploads.map((u: any) => {
                    const uploaderName = u.uploader
                      ? u.uploader.firstName
                        ? `${u.uploader.firstName} ${u.uploader.lastName || ''}`.trim()
                        : u.uploader.email
                      : 'Guest User';

                    const formattedDateTime = u.createdAt
                      ? new Date(u.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : 'N/A';

                    const fileHref = u.fileUrl?.startsWith('http')
                      ? u.fileUrl
                      : `http://localhost:5000${u.fileUrl?.startsWith('/') ? '' : '/'}${u.fileUrl}`;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="block font-bold text-slate-900">{u.originalName}</span>
                            {u.ocrExtractedData?.modelName && (
                              <span className="text-[11px] text-slate-500 font-normal block mt-0.5">
                                Model: {u.ocrExtractedData.modelName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{uploaderName}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-700">
                          {u.fileSize ? `${(u.fileSize / (1024 * 1024)).toFixed(2)} MB` : '0.04 MB'}
                        </td>
                        <td className="p-4">
                          <Badge variant={u.status === 'processed' ? 'success' : 'warning'}>
                            {u.status === 'processed' ? 'PROCESSED (VISION AI)' : u.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-500" suppressHydrationWarning>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{formattedDateTime}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <a href={fileHref} target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="outline"
                              size="sm"
                              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                            >
                              View PDF
                            </Button>
                          </a>
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

export default withRole(AdminUploadsPage, ['admin']);
