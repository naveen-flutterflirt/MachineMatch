'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserType } from '@/types';

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserType[] = ['admin']
) {
  return function RoleGuardedComponent(props: P) {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (isAuthenticated && user && !allowedRoles.includes(user.userType)) {
        router.push('/');
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || !user || !allowedRoles.includes(user.userType)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
          Verifying authorization privileges...
        </div>
      );
    }

    return <Component {...props} />;
  };
}
