import api from '@/api/AxiosIntance';
import { ListSparePartsData } from '@/types';

type SparePartsFilters = {
    search?: string;
    brand?: string;
    model?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
};

const getSpareParts = async (filters: SparePartsFilters) => {
    const response = await api.get('/spare-parts/filter', {
        params: filters,
    });
    return response.data;
};

const deleteSparePart = async (id: number): Promise<{ code: number; message: string; success: boolean }> => {
    const response = await api.delete(`/delete/spare-part/${id}`);
    return response.data;
};

export { getSpareParts, deleteSparePart };
