import { axiosInstance } from "../api/axiosInstance"

export const getTypeService = async (organization_id: number) => {
    const response = await axiosInstance.post('/get-list-count-services', {organization_id: organization_id});
    return response.data
}
