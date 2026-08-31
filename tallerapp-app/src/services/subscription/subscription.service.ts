import { axiosInstance } from "../api/axiosInstance";

export const getSubscriptionRequest = async () => {
  const response = await axiosInstance.get("/subscription");
  return response.data;
};

export const getPlansRequest = async () => {
  const response = await axiosInstance.get("/subscription/plans");
  return response.data;
};
