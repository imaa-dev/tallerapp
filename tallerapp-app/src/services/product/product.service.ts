import { Product } from "@/types/product/product.type";
import { axiosInstance } from "../api/axiosInstance";
import {ApiResponse} from "@/types/response/response.type";

export const createProduct = async (data: any) => {
    return await axiosInstance.post<ApiResponse<Product>>('/create-product', data)
}