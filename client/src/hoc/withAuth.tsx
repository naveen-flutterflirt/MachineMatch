'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Cookies from 'js-cookie';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const token = Cookies.get('token');

    useEffect(() => {
      if (!isAuthenticated && !token) {
        router.push('/login');
      }
    }, [isAuthenticated, token, router]);

    if (!isAuthenticated && !token) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
          Checking authentication...
        </div>
      );
    }

    return <Component {...props} />;
  };
}
