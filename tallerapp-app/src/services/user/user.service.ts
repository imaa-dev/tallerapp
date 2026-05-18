import { axiosInstance } from "../api/axiosInstance"

export const createClient = async (data: any) => {
    const response = await axiosInstance.post('/create-client', data);
    return response
}