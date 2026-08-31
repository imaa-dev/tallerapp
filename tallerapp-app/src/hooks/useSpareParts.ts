import { useQuery } from "@tanstack/react-query";
import { getSparePartsRequest } from "@/services/spare-part/spare-part.service";
import { SparePartListResponse } from "@/types/spare-part/spare-part.type";

export const useSpareParts = (params?: {
  search?: string;
  brand?: string;
  model?: string;
  page?: number;
  per_page?: number;
}) => {
  return useQuery<SparePartListResponse>({
    queryKey: ["spareParts", params],
    queryFn: async () => {
      const { data } = await getSparePartsRequest(params);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
