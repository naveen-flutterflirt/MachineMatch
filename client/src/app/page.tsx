'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button, Card, Badge } from '@/common/components';
import { Sparkles, Layers, FileText, LogIn, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (isAuthenticated || token) {
      if (user?.userType === 'admin') {
        router.push('/admin');
      } else if (user?.userType === 'user') {
        router.push('/user');
      }
    }
  }, [isMounted, isAuthenticated, user, router]);

  const showAuthDashboardLink = isMounted && isAuthenticated;

  if (isMounted && (isAuthenticated || (typeof window !== 'undefined' && localStorage.getItem('token')))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-medium">
        Redirecting to portal...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/70 via-slate-50 to-slate-50 overflow-hidden border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge variant="primary" icon={<Sparkles className="w-4 h-4" />} className="mb-6">
            Automated Machinery Comparison & Spec Extraction Platform
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Compare Heavy Machinery Across Brands with{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              High Precision
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Upload OEM PDF brochures directly, automatically extract specifications, and compare 2-4 machines side-by-side with Multi-Criteria Decision Analysis (MCDA) fit match scores.
          </p>

          {!showAuthDashboardLink ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/login">
                <Button variant="primary" size="lg" leftIcon={<LogIn className="w-5 h-5" />} className="px-8 py-4 text-base shadow-md">
                  Sign In to Platform
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" leftIcon={<UserPlus className="w-5 h-5" />} className="px-8 py-4 text-base">
                  Create Free Account
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center pt-2">
              <Link href={user?.userType === 'admin' ? '/admin' : '/user'}>
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />} className="px-8 py-4 text-base shadow-md">
                  Go to Your Dashboard Portal
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3">Enterprise Core Capabilities</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Built for Heavy Machinery Procurement</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverEffect={true} className="border-slate-200/80 p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-200">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Automated PDF Brochure Parsing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drag and drop any OEM PDF brochure. Automated vision engine extracts Operating Weight, Engine Power, Bucket Capacity, and Price Tiers automatically.
            </p>
          </Card>

          <Card hoverEffect={true} className="border-slate-200/80 p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-200">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Side-by-Side Spec Grid Matrix</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Align 2-4 excavators or loaders on shared category attribute templates. Green highlights automatically flag the best-in-row specifications.
            </p>
          </Card>

          <Card hoverEffect={true} className="border-slate-200/80 p-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-200">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">0-100% Weighted Fit Score</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Set custom target values and importance weights for Operating Weight or Power to compute a personalized MCDA match fit score per machine.
            </p>
          </Card>
        </div>
      </section>

      {/* Security & Compliance Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-12">
        <Card hoverEffect={false} className="p-8 border-emerald-200/80 bg-emerald-50/40 text-center shadow-sm">
          <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Authenticated & Secured Access</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mb-6">
            Sign in to upload OEM PDF brochures, save your side-by-side comparison sessions, and manage procurement leads.
          </p>
          {!showAuthDashboardLink ? (
            <div className="flex items-center justify-center gap-3">
              <Link href="/login">
                <Button variant="primary" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                  Login to Continue
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Link href="/user">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Access User Portal
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
