import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";
import { ClientsResponse } from "@/types/user/client.response.type";

export const useClient = (organizationId: number | null) => {
    return useQuery<ClientsResponse>({
        queryKey: ['clients'],
        queryFn: async () => {
            const { data } = await axiosInstance.post(
                '/get-clients', 
                {
                organization_id: organizationId
            })
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 2
    })
}