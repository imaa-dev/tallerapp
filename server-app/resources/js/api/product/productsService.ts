import api from '@/api/AxiosIntance';
import { CreateProductData, ProductData, ProductFilters } from '@/types';

const deleteProduct = async (id: number): Promise <{ code: number; message: string; success: boolean }> => {
    const response = await api.delete(`/delete/product/${id}`)
    return response.data
}

type CreateProductSuccess = {
    message: string | Record<keyof ProductData, string>;
    success: boolean;
    product?: ProductData;
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

const getProducts = async (
    filters: ProductFilters
) => {

    const response = await api.get(
        "/product/filter",
        {
            params: filters
        }
    );

    return response.data;

};
export { deleteProduct, createProduct, getProducts }
