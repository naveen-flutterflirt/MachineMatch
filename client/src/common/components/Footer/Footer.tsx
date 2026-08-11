'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-emerald-700">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <span>Machine<span className="text-slate-900">Match</span></span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enterprise Machinery Comparison & Specification Extraction Platform.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/user/compare" className="hover:text-emerald-600 transition">Side-by-Side Matrix</Link></li>
              <li><Link href="/user/upload" className="hover:text-emerald-600 transition">Upload PDF Brochure</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Vision Spec Extraction</li>
              <li>MCDA 0-100% Fit Match Scoring</li>
              <li>PostgreSQL Vector Database</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Security & Compliance</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Role-Based Access Control (RBAC)</li>
              <li>JWT Authentication</li>
              <li>AWS S3 Production Storage</li>
            </ul>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Enterprise Security Certified
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MachineMatch Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
