import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/services/api/axiosInstance';
import { Product } from '@/types/product/product.type';

export const useProducts = (filters: Record<string, string> = {}) => {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await axiosInstance.post('/get-product', filters);
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};