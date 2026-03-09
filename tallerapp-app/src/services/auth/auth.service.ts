import { axiosInstance } from "../api/axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
};

export const loginRequest = async (data: LoginPayload) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const logoutRequest = async () => {
  return await axiosInstance.post("/auth/logout");
};

export const getUserRequest = async () => {
  const response = await axiosInstance.get("/user");
  return response.data;
};