'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { useGetMe } from '@/features/auth/hooks/useAuthApi';
import Cookies from 'js-cookie';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const token = typeof window !== 'undefined' ? Cookies.get('token') || localStorage.getItem('token') : null;

  const { data: meUser, error, isSuccess } = useGetMe();

  useEffect(() => {
    if (token && isSuccess && meUser) {
      dispatch(setCredentials({ user: meUser, token }));
    } else if (token && error) {
      console.warn('Authentication token expired or invalid. Logging out.');
      dispatch(logout());
    }
  }, [isSuccess, meUser, error, token, dispatch]);

  return <>{children}</>;
}
