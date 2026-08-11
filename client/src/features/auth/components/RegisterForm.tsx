'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useRegister } from '../hooks/useAuthApi';
import { Button, Input } from '@/common/components';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const registerMutation = useRegister();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match! Please verify your password.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    try {
      const res = await registerMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
        phone,
        userType: 'user',
      });

      const user = res.data || res.user;
      const token = res.token;

      if (!user || !token) {
        throw new Error('Registration failed. Missing server payload.');
      }

      Cookies.set('token', token, { expires: 7 });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      dispatch(setCredentials({ user, token }));
      toast.success(`Account registered successfully! Welcome, ${user.firstName || 'User'}!`);
      
      router.push('/user');
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check inputs.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
        />
        <Input
          label="Last Name"
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Doe"
        />
      </div>

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

      <Input
        label="Confirm Password"
        type="password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={registerMutation.isPending}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="w-full mt-3"
      >
        Create Account
      </Button>
    </form>
  );
}
