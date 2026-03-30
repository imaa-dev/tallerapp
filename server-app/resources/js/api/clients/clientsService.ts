import api from '@/api/AxiosIntance';
import { Client, Technician } from '@/types';
import { errorHandler } from '@/utils/errorHandler';

type ClientResponse = {
    code: number | string;
    message: string;
    success: boolean;
    errors?: object;
    data?: Client;
};

const deleteClient = async (id: number): Promise<ClientResponse> => {
    try {
        const response = await api.delete(`/delete-client/${id}`)
        return response.data
    } catch (error: unknown){
        return errorHandler(error);
    }
}

const createClient = async (data: Client): Promise<ClientResponse> => {
    try {
        const response = await api.post(`/create/user-client`, data)
        return response.data;
    } catch (error: unknown) {
        return errorHandler(error)
    }
}


export { deleteClient, createClient };
