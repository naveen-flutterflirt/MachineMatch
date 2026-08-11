import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { ICategory, IMachine } from '@/types';

export const useGetCategoryTree = () => {
  return useQuery({
    queryKey: ['categories-tree'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.CATEGORIES.TREE);
      return res.data.data as ICategory[];
    },
  });
};

export const useSearchMachines = (searchTerm: string, categoryId: string) => {
  return useQuery({
    queryKey: ['machines-search', searchTerm, categoryId],
    queryFn: async () => {
      const params: any = { page: 1, limit: 12 };
      if (searchTerm) params.q = searchTerm;
      if (categoryId) params.categoryId = categoryId;

      const res = await apiClient.get(API_ENDPOINTS.MACHINES.SEARCH, { params });
      return res.data.data;
    },
  });
};
