import { axiosInstance } from "../api/axiosInstance";
import { RegisterPayload } from "@/types/auth/auth.type";

type LoginPayload = {
  email: string;
  password: string;
};

export const loginRequest = async (data: LoginPayload) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const registerRequest = async (data: RegisterPayload) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const completeLoginRequest = async (loginId: string | undefined, organizationId: number) => {
  const response = await axiosInstance.post("/auth/complete-login", {
    login_id: loginId,
    organization_id: organizationId,
  });
  return response.data;
};

export const logoutRequest = async () => {
  return await axiosInstance.post("/auth/logout");
};

export const getUserRequest = async () => {
  const response = await axiosInstance.get("/user");
  return response.data;
};

export const getWorkshopTypesRequest = async () => {
  const response = await axiosInstance.get("/workshop-types");
  return response.data;
};