'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { PdfDropzone, UploadBatchStatus, useUploadBrochure } from '@/features/upload';
import { Button, Card, Badge } from '@/common/components';
import { toast } from 'sonner';
import { Sparkles, FileText, ArrowRight, Layers, Lock, LogIn, UserPlus } from 'lucide-react';
import { IUploadRecord } from '@/types';

export default function UserUploadPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<IUploadRecord[]>([]);

  const uploadMutation = useUploadBrochure();

  // If NOT LOGGED IN -> Show Authentication Lock Card
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Card hoverEffect={false} className="p-12 max-w-xl mx-auto border-slate-200/80 bg-white shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <Badge variant="primary" className="mb-3">Authentication Required</Badge>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Login to Upload OEM PDF Brochures</h1>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Automated PDF spec extraction and database auto-seeding are enabled exclusively for authenticated users. Please login or register to upload PDF brochures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="primary" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
                Login to Account
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="md" leftIcon={<UserPlus className="w-4 h-4" />}>
                Create Free Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleUpload = async () => {
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
      const res = await uploadMutation.mutateAsync({ formData, isBatch });
      const records = Array.isArray(res.data) ? res.data : [res.data];
      setUploadResults(records);
      toast.success(`Successfully uploaded ${records.length} PDF brochure(s)! Automated specs extracted.`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed. Please check file format.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <Badge variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />} className="mb-4">
          Automated Vision Spec Extraction Engine
        </Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Upload OEM PDF Brochures</h1>
        <p className="text-slate-600 text-sm mt-2 max-w-2xl mx-auto">
          Upload 1 to 10 OEM machinery PDF brochures simultaneously. Our vision engine reads specs, extracts Operating Weight & Power, and populates PostgreSQL DB automatically.
        </p>
      </div>

      <PdfDropzone onFileSelect={handleFileSelect} />

      {selectedFiles.length > 0 && (
        <Card hoverEffect={false} className="mt-4 p-4 border-slate-200 bg-white">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Selected Files ({selectedFiles.length})
          </h4>
          <ul className="space-y-2">
            {selectedFiles.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-800">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{file.name}</span>
                <span className="text-xs text-slate-500 font-mono">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {uploadResults.length === 0 ? (
        <Button
          variant="primary"
          size="lg"
          onClick={handleUpload}
          isLoading={uploadMutation.isPending}
          disabled={selectedFiles.length === 0}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-6 py-4 text-base shadow-md"
        >
          Start Automated PDF Spec Extraction
        </Button>
      ) : (
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link href="/user/compare" className="w-full">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Layers className="w-5 h-5 text-white" />}
              className="w-full py-4 text-base shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              ⚡ Compare Uploaded PDF Brochures Side-by-Side
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setSelectedFiles([]);
              setUploadResults([]);
            }}
            className="py-4 whitespace-nowrap"
          >
            Upload More PDFs
          </Button>
        </div>
      )}

      <UploadBatchStatus uploadResults={uploadResults} />
    </div>
  );
}
