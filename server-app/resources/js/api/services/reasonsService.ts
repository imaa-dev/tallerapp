import axios from 'axios';
import { ReasonResponse } from '@/types';
const appUrl = import.meta.env.VITE_APP_URL;

const uploadReasons = async (reason: string, id: number): Promise<ReasonResponse> => {
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('service_id', id.toString());
    
    const response = await axios.post(`${appUrl}/store-reason-service`, formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data;

}
const deleteReason = async (id: number): Promise<{ code: number; message: string; success: boolean }> => {
    const response = await axios.delete(`${appUrl}/delete-reason-service/${id}`, {
        withCredentials: true
    })
    return response.data
}
export { uploadReasons, deleteReason }
