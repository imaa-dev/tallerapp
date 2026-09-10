import { axiosInstance } from "../api/axiosInstance";
import { ImagePickerAsset } from "expo-image-picker";
import { appendImagesToFormData } from "@/utils/appendImagesToFormData";

export const getServiceDetailRequest = async (id: number) => {
  const response = await axiosInstance.get(`/services/${id}`);
  return response.data;
};

export const advanceServiceStatusRequest = async (id: number, status: number) => {
  const response = await axiosInstance.post(`/services/${id}/advance`, { status });
  return response.data;
};

export const toDiagnosisRequest = async (id: number, method: string) => {
  const response = await axiosInstance.post(`/services/${id}/to-diagnosis`, { method });
  return response.data;
};

export const goBackServiceRequest = async (id: number, statusId: number) => {
  const response = await axiosInstance.post(`/services/${id}/go-back`, { status_id: statusId });
  return response.data;
};

export const addDiagnosisRequest = async (
  id: number,
  data: { issue_id: number; diagnosis: string; repair_time: string; cost: number }
) => {
  const response = await axiosInstance.post(`/services/${id}/diagnosis-issue`, data);
  return response.data;
};

export const toSparePartsRequest = async (id: number) => {
  const response = await axiosInstance.post(`/services/${id}/to-spare-parts`);
  return response.data;
};

export const toCostApprovalRequest = async (id: number) => {
  const response = await axiosInstance.post(`/services/${id}/to-cost-approval`);
  return response.data;
};

export const uploadServiceImagesRequest = async (id: number, images: ImagePickerAsset[]) => {
  const formData = new FormData();
  appendImagesToFormData(formData, images);
  const response = await axiosInstance.post(`/services/${id}/upload-images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteServiceImageRequest = async (serviceId: number, fileId: number) => {
  const response = await axiosInstance.delete(`/services/${serviceId}/images/${fileId}`);
  return response.data;
};

export const updateDiagnosisRequest = async (
  id: number,
  issues: { issue: string; cost: number }[]
) => {
  const response = await axiosInstance.post(`/services/${id}/diagnosis`, { issues });
  return response.data;
};

export const assignSparePartsRequest = async (id: number, spareParts: number[]) => {
  const response = await axiosInstance.post(`/services/${id}/assign-spare-parts`, { spare_parts: spareParts });
  return response.data;
};

export const removeSparePartRequest = async (id: number, sparePartId: number) => {
  const response = await axiosInstance.post(`/services/${id}/remove-spare-part`, {
    spare_part_id: sparePartId,
  });
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
