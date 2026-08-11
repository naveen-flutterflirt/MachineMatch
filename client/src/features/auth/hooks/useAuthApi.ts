import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { IUser } from '@/types';
import Cookies from 'js-cookie';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return res.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return res.data;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      return res.data;
    },
  });
};

export const useGetMe = () => {
  const token = typeof window !== 'undefined' ? Cookies.get('token') || localStorage.getItem('token') : null;

  return useQuery({
    queryKey: ['auth-me', token],
    queryFn: async () => {
      if (!token) return null;
      const res = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      return res.data.data as IUser;
    },
    enabled: Boolean(token),
    retry: false,
  });
};
