import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../services/api/axiosInstance';
import { Product } from '@/types/product/product.type';

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axiosInstance.post('/get-product');
      return data.product.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
