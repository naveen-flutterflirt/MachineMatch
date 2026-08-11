'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';

interface PdfDropzoneProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PdfDropzone({ onFileSelect }: PdfDropzoneProps) {
  return (
    <div className="bg-emerald-50/40 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-10 text-center transition">
      <UploadCloud className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-900 mb-2">Drag & Drop PDF Brochures Here</h3>
      <p className="text-sm text-slate-500 mb-6">Supports PDF, JPG, PNG, WEBP files up to 25MB each</p>

      <input
        type="file"
        id="pdf-dropzone-input"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={onFileSelect}
        className="hidden"
      />

      <label
        htmlFor="pdf-dropzone-input"
        className="cursor-pointer bg-white hover:bg-emerald-50 text-emerald-700 font-semibold px-6 py-3 rounded-xl border border-emerald-300 shadow-xs transition inline-block mb-4 hover:border-emerald-400"
      >
        Select PDF Files
      </label>
    </div>
  );
}
