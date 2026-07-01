import api from '@/api/AxiosIntance';
import { Technician } from '@/types';
import { errorHandler } from '@/utils/errorHandler';

type TechnicianResponse = {
    code: number | string;
    message: string;
    success: boolean;
    errors?: object;
    data?: Technician;
}

const sendVerifyCodeEmail = async (): Promise<{ code: number; message: string; success: boolean; }> => {
    const response = await api.post('send-code-verificate-email/user');
    return response.data;
}

const resendVerifyCodeEmail = async (): Promise<{ code: number; message: string; success: boolean }> => {
    const response = await api.post('resend-code-verificate-email/user');
    return response.data;
}
const createTechnician = async (data: Technician): Promise<TechnicianResponse> => {
    const response = await api.post('/create/user-technician', data , {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export { sendVerifyCodeEmail, resendVerifyCodeEmail, createTechnician }
