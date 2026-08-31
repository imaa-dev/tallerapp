import { axiosInstance } from "../api/axiosInstance";

export const getDashboardStatsRequest = async () => {
  const response = await axiosInstance.get("/dashboard/stats");
  return response.data;
};
