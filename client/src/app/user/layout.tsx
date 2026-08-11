'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Cookies from 'js-cookie';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (!isAuthenticated && !token) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-medium">
        Loading user portal...
      </div>
    );
  }

  const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (!isAuthenticated && !token) {
    return null;
  }

  return <>{children}</>;
}
