import { ListSparePartsData, ProductData, SparePartsData } from '@/types';
import { errorHandler } from '@/utils/errorHandler';
import api from '@/api/AxiosIntance';

type CreateSparePartsResponse = {
    message: string;
    success: boolean;
    spare_part?: ListSparePartsData
}
const createSparePart = async (data: SparePartsData): Promise <CreateSparePartsResponse> => {
    const response = await api.post('create/spare-parts', data)
    return response.data
}

export { createSparePart }
