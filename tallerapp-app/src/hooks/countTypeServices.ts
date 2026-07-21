import {useQuery} from "@tanstack/react-query";
import {ServiceType} from "@/types/servi/servi.type";
import {axiosInstance} from "@/services/api/axiosInstance";

export const useCountTypeServices = () => {
    return useQuery<ServiceType[]>({
        queryKey: ['countTypeServices'],
        queryFn: async () => {
            const { data } = await axiosInstance.post('/get-list-count-services');
            return data.data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    })
}