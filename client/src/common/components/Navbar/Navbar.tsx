'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useLogout } from '@/features/auth/hooks/useAuthApi';
import Cookies from 'js-cookie';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { Cpu, LogOut, ShieldCheck, User as UserIcon, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const logoutMutation = useLogout();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.warn('Backend logout call notice:', err);
    }

    Cookies.remove('token', { path: '/' });
    Cookies.remove('token');

    if (typeof window !== 'undefined') {
      localStorage.clear();
    }

    dispatch(logout());
    window.location.href = '/';
  };

  const showAuthControls = isMounted && isAuthenticated;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href={showAuthControls ? (user?.userType === 'admin' ? '/admin' : '/user') : '/'}
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-emerald-700 group"
        >
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 group-hover:border-emerald-400 transition">
            <Cpu className="w-5 h-5 text-emerald-600" />
          </div>
          <span>Machine<span className="text-slate-900">Match</span></span>
        </Link>

        {/* Navigation Links - ONLY show when LOGGED IN & MOUNTED */}
        {showAuthControls && (
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            {user?.userType === 'admin' ? (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  pathname?.startsWith('/admin') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                Admin Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/user"
                  className={`px-3 py-1.5 rounded-lg transition ${
                    pathname === '/user' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100/60'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/user/compare"
                  className={`px-3 py-1.5 rounded-lg transition ${
                    pathname === '/user/compare' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100/60'
                  }`}
                >
                  Side-by-Side Compare
                </Link>
                <Link
                  href="/user/upload"
                  className={`px-3 py-1.5 rounded-lg transition ${
                    pathname === '/user/upload' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100/60'
                  }`}
                >
                  Upload PDF Brochure
                </Link>
              </>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {showAuthControls && user ? (
            <div className="flex items-center gap-3">
              <Badge variant={user.userType === 'admin' ? 'warning' : 'primary'} icon={<ShieldCheck className="w-3 h-3" />}>
                {user.userType}
              </Badge>
              <span className="text-sm font-medium text-slate-700 hidden sm:flex items-center gap-1.5" suppressHydrationWarning>
                <UserIcon className="w-4 h-4 text-emerald-600" />
                {user.firstName || user.email?.split('@')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
