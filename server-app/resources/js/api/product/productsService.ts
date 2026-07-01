import api from '@/api/AxiosIntance';
import { CreateProductData, ProductData } from '@/types';

const deleteProduct = async (id: number): Promise <{ code: number; message: string; success: boolean }> => {
    const response = await api.delete(`/delete/product/${id}`)
    return response.data
}

type CreateProductSuccess = {
    code: number | string;
    message: string | Record<keyof ProductData, string>;
    success: boolean;
    data?: ProductData;
    errors?: Record<string, string[]>;
};

const createProduct = async (data: CreateProductData): Promise <CreateProductSuccess> => {
    const response = await api.post("/create/product", data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data

}
export { deleteProduct, createProduct }
