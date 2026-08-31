import { useQuery } from "@tanstack/react-query";
import { getDocumentsRequest } from "@/services/document/document.service";
import { DocumentListResponse } from "@/types/document/document.type";

export const useDocuments = (params?: {
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}) => {
  return useQuery<DocumentListResponse>({
    queryKey: ["documents", params],
    queryFn: async () => {
      const { data } = await getDocumentsRequest(params);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
