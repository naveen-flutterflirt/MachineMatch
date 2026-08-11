'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useUploadBrochure } from '@/features/upload';
import { useGetMyComparisons } from '@/features/comparison';
import { Button, Card, Badge } from '@/common/components';
import { toast } from 'sonner';
import { Sparkles, Layers, FileText, UploadCloud, ArrowRight, Clock, Scale, UserCheck } from 'lucide-react';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uploadMutation = useUploadBrochure();
  const { data: myComparisons, isLoading: isLoadingComparisons } = useGetMyComparisons();

  const comparisonsList = Array.isArray(myComparisons) ? myComparisons : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDirectPdfUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one PDF brochure to upload.');
      return;
    }

    const formData = new FormData();
    const isBatch = selectedFiles.length > 1;

    if (isBatch) {
      selectedFiles.forEach((file) => formData.append('files', file));
    } else {
      formData.append('file', selectedFiles[0]);
    }

    try {
      await uploadMutation.mutateAsync({ formData, isBatch });
      toast.success('PDF Brochure uploaded! Spec extraction completed.');
      router.push('/user/compare');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed. Please check file format.');
    }
  };

  const displayName = isMounted && user ? (user.firstName || user.email?.split('@')[0] || 'Member') : 'Member';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* User Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <UserCheck className="w-4 h-4" /> Authenticated User Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" suppressHydrationWarning>
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Access your saved machinery comparison sessions, upload new OEM PDF brochures, and review spec matrices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/user/upload">
            <Button variant="primary" size="sm" leftIcon={<UploadCloud className="w-4 h-4" />}>
              Upload PDF Brochure
            </Button>
          </Link>
          <Link href="/user/compare">
            <Button variant="outline" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
              + New Matrix
            </Button>
          </Link>
        </div>
      </div>

      {/* Saved Comparisons History Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-emerald-600" /> Your Saved Machinery Comparisons
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select any comparison session to load its side-by-side spec alignment matrix.
            </p>
          </div>
        </div>

        {isLoadingComparisons ? (
          <div className="py-12 text-center text-slate-500 font-medium">Loading your saved comparison history...</div>
        ) : comparisonsList.length === 0 ? (
          <Card hoverEffect={false} className="p-8 text-center border-slate-200 bg-white shadow-sm">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Saved Comparisons Yet</h3>
            <p className="text-slate-500 text-xs mb-4">
              Upload OEM PDF brochures or select catalog models to build your first side-by-side spec comparison.
            </p>
            <Link href="/user/compare">
              <Button variant="primary" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
                Create Spec Comparison Matrix
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonsList.map((comp: any) => {
              const machineNames = comp.items
                ? comp.items.map((i: any) => i.machine?.modelName).filter(Boolean)
                : [];

              const machineCategoryName = comp.items && comp.items[0]?.machine?.category?.name
                ? comp.items[0].machine.category.name
                : comp.category?.name || 'Heavy Machinery';

              const displayTitle = comp.title && !comp.title.includes('Side-by-Side Comparison') && comp.title !== 'Machinery Comparison'
                ? comp.title
                : (machineNames.length > 1 ? machineNames.join(' vs ') : (machineNames[0] || 'Machinery Spec Comparison'));

              const formattedDate = new Date(comp.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <Card
                  key={comp.id}
                  hoverEffect={true}
                  className="border-slate-200/80 flex flex-col justify-between p-6 bg-white hover:border-emerald-300 transition cursor-pointer group shadow-sm hover:shadow-md"
                  onClick={() => router.push(`/user/compare?id=${comp.id}`)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="primary" size="sm">
                        {machineCategoryName}
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1" suppressHydrationWarning>
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {formattedDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition mb-3 line-clamp-1">
                      {displayTitle}
                    </h3>

                    {machineNames.length > 0 && (
                      <div className="space-y-1.5 mb-4">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Compared Models ({machineNames.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {machineNames.map((name: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Comparison Matrix <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Instant PDF Upload Section */}
      <section>
        <Card hoverEffect={false} className="p-8 border-slate-200/80 text-center shadow-md bg-white">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Upload OEM PDF Brochure
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-6">
            Upload OEM machinery brochures directly. Spec extraction engine reads specifications and populates side-by-side comparison matrices automatically.
          </p>

          <div className="bg-emerald-50/30 border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-2xl p-6 transition mb-6 max-w-2xl mx-auto">
            <input
              type="file"
              id="user-dashboard-pdf-input"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="user-dashboard-pdf-input"
              className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 text-sm font-semibold px-5 py-2.5 rounded-xl border border-emerald-300 shadow-xs transition"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              {selectedFiles.length > 0 ? `${selectedFiles.length} File(s) Selected` : 'Select PDF Brochure'}
            </label>
            {selectedFiles.length > 0 && (
              <p className="text-xs text-slate-500 mt-2 font-mono">{selectedFiles[0].name}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDirectPdfUpload}
              isLoading={uploadMutation.isPending}
              disabled={selectedFiles.length === 0}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Extract Specs & Compare PDF
            </Button>
            <Link href="/user/compare">
              <Button variant="outline" size="lg" leftIcon={<Layers className="w-4 h-4" />}>
                Go to Side-by-Side Matrix
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
