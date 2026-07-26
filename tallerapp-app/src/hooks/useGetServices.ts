import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "@/services/api/axiosInstance";
import { ServiceRecord } from "@/types/servi/servi.type";

export const useGetServices = () => {
    return useQuery<ServiceRecord[]>({
        queryKey: ['services'],
        queryFn: async () => {
           const { data } = await axiosInstance.post('/get-services')
           return data.data;
        }
    })
}