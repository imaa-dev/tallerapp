import api from '@/api/AxiosIntance';
import { errorHandler } from '@/utils/errorHandler';

const deleteService = async (id: number): Promise<{ code: number; message: string; success: boolean;  }> => {
    const response = await api.delete(`/delete/service/${id}`)
    return response.data
}

const toGoBackService = async (service_id: number, status_service_id: number):
     Promise<{ code: number; message: string; success: boolean;  }> => {
    const response = await api.post('/to-go-back/service', {
        service_id,
        status_service_id
    });
    return response.data;
}
export {deleteService, toGoBackService}
