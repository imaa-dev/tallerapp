import { axiosInstance } from "../api/axiosInstance";

export const getSparePartsRequest = async (params?: {
  search?: string;
  brand?: string;
  model?: string;
  page?: number;
  per_page?: number;
}) => {
  const response = await axiosInstance.get("/spare-parts", { params });
  return response.data;
};

export const createSparePartRequest = async (data: {
  model: string;
  brand: string;
  price: number;
  note?: string;
}) => {
  const response = await axiosInstance.post("/spare-parts", data);
  return response.data;
};

export const deleteSparePartRequest = async (id: number) => {
  const response = await axiosInstance.delete(`/spare-parts/${id}`);
  return response.data;
};
