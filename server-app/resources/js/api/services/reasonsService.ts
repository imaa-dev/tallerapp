import axios from 'axios';
import { ReasonResponse } from '@/types';
const appUrl = import.meta.env.VITE_APP_URL;

const uploadReasons = async (reason: string, id: number): Promise<ReasonResponse> => {
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('service_id', id.toString());
    try {
        const response = await axios.post(`${appUrl}/store-reason-service`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)){
            return {
                code: error?.response?.status || 500,
                message: error?.response?.data?.message || 'Error inesperado al subir imagen',
                success: error?.response?.data?.success || false,
                reasons: []
            }
        }
        return {
            code: 500,
            message: 'Error',
            success: false,
            reasons: []
        }
    }
}
const deleteReason = async (id: number): Promise<{ code: number; message: string; success: boolean }> => {
    try{
        const response = await axios.delete(`${appUrl}/delete-reason-service/${id}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        if(axios.isAxiosError(error)){
            return {
                code: error?.response?.status || 500,
                message: error?.response?.data?.message || 'Error inesperado al subir imagen',
                success: error?.response?.data?.success || false,
            }
        }
        return {
            code: 500,
            message: 'Error',
            success: false,
        }

    }
}
export { uploadReasons, deleteReason }
