import { useQuery } from "@tanstack/react-query";
import { getUsersRequest } from "@/services/user/users.service";
import { UserListResponse } from "@/types/user/user-list.type";

export const useUsers = (params?: {
  search?: string;
  rol?: string;
  page?: number;
  per_page?: number;
}) => {
  return useQuery<UserListResponse>({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await getUsersRequest(params);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
