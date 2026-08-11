import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { IComparisonData } from '@/types';

export const useGetSideBySideTable = (comparisonId: string) => {
  return useQuery({
    queryKey: ['side-by-side-table', comparisonId],
    queryFn: async () => {
      if (!comparisonId) return null;
      const res = await apiClient.get(API_ENDPOINTS.COMPARISONS.TABLE(comparisonId));
      return res.data.data as IComparisonData;
    },
    enabled: Boolean(comparisonId),
  });
};

export const useGetMyComparisons = () => {
  return useQuery({
    queryKey: ['my-comparisons'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.COMPARISONS.MY_COMPARISONS);
      return res.data.data;
    },
  });
};

export const useCreateComparison = () => {
  return useMutation({
    mutationFn: async (payload: { categoryId: string; machineIds: string[]; title?: string }) => {
      const res = await apiClient.post(API_ENDPOINTS.COMPARISONS.CREATE, payload);
      return res.data.data;
    },
  });
};
