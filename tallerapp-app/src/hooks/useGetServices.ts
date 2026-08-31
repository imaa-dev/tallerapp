import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "@/services/api/axiosInstance";
import { ServiceRecord } from "@/types/servi/servi.type";

export const useGetServices = (statusId?: number) => {
    return useQuery<ServiceRecord[]>({
        queryKey: ['services', statusId],
        queryFn: async () => {
           const { data } = await axiosInstance.post('/get-services', {
               status: statusId ?? 1,
           });
           return data.data;
        },
        staleTime: 1000 * 60 * 2,
        retry: 2,
    })
}
