import { axiosInstance } from "../api/axiosInstance";

export const updateProfileRequest = async (name: string, email: string) => {
  const response = await axiosInstance.put("/profile", { name, email });
  return response.data;
};

export const updatePasswordRequest = async (data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await axiosInstance.put("/profile/password", data);
  return response.data;
};