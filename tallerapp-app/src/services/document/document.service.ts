import { axiosInstance } from "../api/axiosInstance";

export const getDocumentsRequest = async (params?: {
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}) => {
  const response = await axiosInstance.get("/documents", { params });
  return response.data;
};
