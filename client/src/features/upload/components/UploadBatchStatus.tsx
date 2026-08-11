'use client';

import React from 'react';
import { Card, Badge } from '@/common/components';
import { IUploadRecord } from '@/types';
import { FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface UploadBatchStatusProps {
  uploadResults: IUploadRecord[];
}

export function UploadBatchStatus({ uploadResults }: UploadBatchStatusProps) {
  if (!uploadResults || uploadResults.length === 0) return null;

  return (
    <Card className="mt-8 border-slate-200/80 bg-white">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Upload Batch Pipeline Status
      </h3>
      <div className="space-y-3">
        {uploadResults.map((rec) => {
          const statusVariant =
            rec.status === 'processed'
              ? 'success'
              : rec.status === 'failed'
              ? 'error'
              : 'warning';

          return (
            <div
              key={rec.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between hover:border-emerald-300 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rec.originalName}</h4>
                  <span className="text-xs text-slate-500 font-mono block">{rec.fileUrl}</span>
                </div>
              </div>
              <Badge variant={statusVariant}>{rec.status}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
