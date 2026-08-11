'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { RegisterForm } from '@/features/auth';
import { Card } from '@/common/components';
import { Cpu } from 'lucide-react';
import Cookies from 'js-cookie';

export default function RegisterPage() {
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
      } else {
        router.push('/user');
      }
    }
  }, [isMounted, isAuthenticated, user, router]);

  if (isMounted && (isAuthenticated || (typeof window !== 'undefined' && localStorage.getItem('token')))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-medium">
        Redirecting to portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Card className="max-w-md w-full p-8 shadow-lg border-slate-200/80 bg-white">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create MachineMatch Account</h2>
          <p className="mt-1 text-xs text-slate-500">Join the AI Machinery Comparison Marketplace</p>
        </div>

        <RegisterForm />

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
