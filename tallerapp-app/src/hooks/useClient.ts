import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/services/api/axiosInstance";
import {User} from "@/types/user/user.type";

export const useClient = () => {
    return useQuery<User[]>({
        queryKey: ['clients'],
        queryFn: async () => {
            const { data } = await axiosInstance.post('/get-clients')
            return data.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 2
    })
}