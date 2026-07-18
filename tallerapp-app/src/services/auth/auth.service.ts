import { axiosInstance } from "../api/axiosInstance";

type LoginPayload = {
  email: string;
  password: string;
};

export const loginRequest = async (data: LoginPayload) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const completeLoginRequest = async (loginId: string | undefined, organizationId: number) => {
  const response = await axiosInstance.post("/auth/complete-login", {
    login_id: loginId,
    organization_id: organizationId,
  });
  return response.data;
}

export const logoutRequest = async () => {
  return await axiosInstance.post("/auth/logout");
};

export const getUserRequest = async () => {
  const response = await axiosInstance.get("/user");
  return response.data;
};