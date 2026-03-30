import api from '@/api/AxiosIntance';
import { ProductData } from '@/types';
import { errorHandler } from '@/utils/errorHandler';

const deleteProduct = async (id: number): Promise <{ code: number; message: string; success: boolean }> => {
    try {
        const response = await api.delete(`/delete/product/${id}`)
        return response.data
    } catch (error) {
        console.log(error, 'AXIOS ERROR')
        return {
            code: 500,
            message: 'Error desconocido',
            success: false
        }
    }
}

type CreateProductSuccess = {
    code: number | string;
    message: string | Record<keyof ProductData, string>;
    success: boolean;
    data?: ProductData;
};

const createProduct = async (data: ProductData): Promise <CreateProductSuccess> => {
    try {
        const response = await api.post("/create/product", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error : unknown) {
        return errorHandler(error);
    }
}
export { deleteProduct, createProduct }
