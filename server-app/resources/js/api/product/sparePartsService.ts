import { ListSparePartsData, ProductData, SparePartsData } from '@/types';
import { errorHandler } from '@/utils/errorHandler';
import api from '@/api/AxiosIntance';

type CreateSparePartsResponse = {
    code: number | string;
    message: string | Record<keyof ProductData, string>;
    success: boolean;
    data?: ListSparePartsData
}
const createSparePart = async (data: SparePartsData): Promise <CreateSparePartsResponse> => {
    try {
        const response = await api.post('create/spare-parts', data)
        return response.data
    } catch (error: unknown) {
        console.log(error)
        return errorHandler(error);
    }
}

export { createSparePart }
