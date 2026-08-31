import { axiosInstance } from "../api/axiosInstance";
import { OrganizationDetail } from "@/types/organization/organization.type";

export const getOrganizationRequest = async () => {
  const response = await axiosInstance.get("/organization");
  return response.data;
};

export const updateOrganizationRequest = async (
  data: Partial<OrganizationDetail>
) => {
  const response = await axiosInstance.put("/organization", data);
  return response.data;
};
