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
    try {
        const response = await api.post('send-code-verificate-email/user');
        return response.data;
    } catch (error){
        console.log(error, 'AXIOS ERROR')
        return {
            code: 500,
            message: 'Error desconocido',
            success: false
        }
    }
}

const resendVerifyCodeEmail = async (): Promise<{ code: number; message: string; success: boolean }> => {
    try {
        const response = await api.post('resend-code-verificate-email/user');
        return response.data;
    } catch (error) {
        console.log(error, 'AXOIS ERROR')
        return {
            code: 500,
            message: 'Error desconocido',
            success: false
        }
    }
}
const createTechnician = async (data: Technician): Promise<TechnicianResponse> => {
    try {
        const response = await api.post('/create/user-technician', data , {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error: unknown) {
        return errorHandler(error)
    }
}

export { sendVerifyCodeEmail, resendVerifyCodeEmail, createTechnician }
