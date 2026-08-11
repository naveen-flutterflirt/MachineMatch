'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useLogin } from '../hooks/useAuthApi';
import { Button, Input } from '@/common/components';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage(null);

    try {
      const res = await loginMutation.mutateAsync({ email, password });
      const user = res.data || res.user;
      const token = res.token;

      if (!user || !token) {
        throw new Error('Invalid authentication response from server.');
      }

      Cookies.set('token', token, { expires: 7 });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      dispatch(setCredentials({ user, token }));
      toast.success(`Welcome back, ${user.firstName || 'User'}!`);

      const destination = user.userType === 'admin' ? '/admin' : '/user';
      router.push(destination);
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify your email and password.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
        leftIcon={<Mail className="w-4 h-4" />}
      />

      <Input
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={loginMutation.isPending}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="w-full mt-2"
      >
        Sign In to Platform
      </Button>
    </form>
  );
}
