import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import { IUploadRecord } from '@/types';

export const useUploadBrochure = () => {
  return useMutation({
    mutationFn: async ({ formData, isBatch }: { formData: FormData; isBatch: boolean }) => {
      const endpoint = isBatch ? API_ENDPOINTS.UPLOADS.BATCH : API_ENDPOINTS.UPLOADS.SINGLE;
      const res = await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  });
};

export const useGetMyUploads = () => {
  return useQuery({
    queryKey: ['my-uploads'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.UPLOADS.MY_UPLOADS);
      return res.data.data as IUploadRecord[];
    },
  });
};
