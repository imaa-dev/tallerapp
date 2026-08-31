import { axiosInstance } from "../api/axiosInstance";

export const getServiceDetailRequest = async (id: number) => {
  const response = await axiosInstance.get(`/services/${id}`);
  return response.data;
};

export const advanceServiceStatusRequest = async (id: number, status: number) => {
  const response = await axiosInstance.post(`/services/${id}/advance`, { status });
  return response.data;
};

export const updateDiagnosisRequest = async (
  id: number,
  issues: { issue: string; cost: number }[]
) => {
  const response = await axiosInstance.post(`/services/${id}/diagnosis`, { issues });
  return response.data;
};

export const approveSparePartsRequest = async (id: number) => {
  const response = await axiosInstance.post(`/services/${id}/approve-spare-parts`);
  return response.data;
};

export const approveCostRequest = async (id: number, method: string) => {
  const response = await axiosInstance.post(`/services/${id}/approve-cost`, { method });
  return response.data;
};

export const startRepairRequest = async (id: number) => {
  const response = await axiosInstance.post(`/services/${id}/start-repair`);
  return response.data;
};

export const completeRepairRequest = async (
  id: number,
  data: { repair_price: number; final_note: string }
) => {
  const response = await axiosInstance.post(`/services/${id}/complete-repair`, data);
  return response.data;
};

export const deliverServiceRequest = async (id: number) => {
  const response = await axiosInstance.post(`/services/${id}/deliver`);
  return response.data;
};
