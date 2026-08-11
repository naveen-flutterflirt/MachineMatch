import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';

export const useGetSearchSummary = () => {
  return useQuery({
    queryKey: ['admin-search-summary'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ANALYTICS.SUMMARY);
      return res.data.data;
    },
  });
};

export const useGetPopularSearchTerms = () => {
  return useQuery({
    queryKey: ['admin-popular-searches'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ANALYTICS.POPULAR);
      return res.data.data;
    },
  });
};
