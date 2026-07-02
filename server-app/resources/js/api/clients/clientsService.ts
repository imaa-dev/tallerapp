import api from '@/api/AxiosIntance';
import { Client, CreateClientData } from '@/types';
import { errorHandler } from '@/utils/errorHandler';

type ClientResponse = {
    code: number | string;
    message: string;
    success: boolean;
    errors?: object;
    client?: Client;
};

const deleteClient = async (id: number): Promise<ClientResponse> => {
    const response = await api.delete(`/delete-client/${id}`)
    return response.data

}

const createClient = async (data: CreateClientData): Promise<ClientResponse> => {
    const response = await api.post(`/create/user-client`, data)
    return response.data;
}


export { deleteClient, createClient };
