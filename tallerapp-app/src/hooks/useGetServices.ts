import {useQuery} from "@tanstack/react-query";
import {axiosInstance} from "@/services/api/axiosInstance";

export const useGetServices = () => {
    return useQuery<[]>({
        queryKey: ['services'],
        queryFn: async () => {
           const { data } = await axiosInstance.post('/get-services')
           return data.data;
        }
    })
}