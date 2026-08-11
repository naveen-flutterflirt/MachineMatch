'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Cookies from 'js-cookie';

export default function AdminLayoutGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (!isAuthenticated && !token) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user && user.userType !== 'admin') {
      router.push('/user');
    }
  }, [isMounted, isAuthenticated, user, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-medium">
        Verifying administrator credentials...
      </div>
    );
  }

  const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (!isAuthenticated && !token) {
    return null;
  }

  if (isAuthenticated && user?.userType !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
