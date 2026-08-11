import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await apiClient.get('/users');
      return res.data.data;
    },
  });
};

export const useGetAllVendors = () => {
  return useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const res = await apiClient.get('/vendors');
      return res.data.data;
    },
  });
};

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data.data;
    },
  });
};

export const useGetAllAttributes = () => {
  return useQuery({
    queryKey: ['admin-attributes'],
    queryFn: async () => {
      const res = await apiClient.get('/attributes');
      return res.data.data;
    },
  });
};

export const useGetAllAdminMachines = () => {
  return useQuery({
    queryKey: ['admin-machines'],
    queryFn: async () => {
      const res = await apiClient.get('/machines');
      return res.data.data;
    },
  });
};

export const useGetAllUploads = () => {
  return useQuery({
    queryKey: ['admin-uploads'],
    queryFn: async () => {
      const res = await apiClient.get('/uploads');
      return res.data.data;
    },
  });
};

export const useGetAllAdminComparisons = () => {
  return useQuery({
    queryKey: ['admin-comparisons'],
    queryFn: async () => {
      const res = await apiClient.get('/comparisons');
      return res.data.data;
    },
  });
};
