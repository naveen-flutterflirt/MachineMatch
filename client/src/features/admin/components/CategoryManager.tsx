'use client';

import React from 'react';
import { Layers } from 'lucide-react';

export function CategoryManager() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Layers className="w-6 h-6 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">Category Taxonomy Management</h3>
      </div>
      <p className="text-sm text-slate-600">
        Manage machinery categories (Excavators, Backhoe Loaders, Wheel Loaders) and attribute template mappings.
      </p>
    </div>
  );
}
