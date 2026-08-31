import { axiosInstance } from "../api/axiosInstance";

export const getUsersRequest = async (params?: {
  search?: string;
  rol?: string;
  page?: number;
  per_page?: number;
}) => {
  const response = await axiosInstance.get("/users", { params });
  return response.data;
};

export const createClientRequest = async (data: {
  name: string;
  email: string;
  phone?: string;
}) => {
  const response = await axiosInstance.post("/users/client", data);
  return response.data;
};

export const createTechnicianRequest = async (data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await axiosInstance.post("/users/technician", data);
  return response.data;
};

export const updateUserRequest = async (data: {
  id: number;
  name: string;
  email: string;
  phone?: string;
}) => {
  const response = await axiosInstance.put("/users", data);
  return response.data;
};

export const deleteUserRequest = async (id: number) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
