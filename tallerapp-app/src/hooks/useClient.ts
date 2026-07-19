import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";
import { ClientsResponse } from "@/types/user/client.response.type";

export const useClient = () => {
    return useQuery<ClientsResponse>({
        queryKey: ['clients'],
        queryFn: async () => {
            const { data } = await axiosInstance.post('/get-clients')
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 2
    })
}