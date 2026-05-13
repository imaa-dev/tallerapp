import { Product } from "@/types/product/product.type";
import { axiosInstance } from "../api/axiosInstance";

export const createProduct = async (data: any) => {
    const response = await axiosInstance.post('/create-product', data)
    return response;
}