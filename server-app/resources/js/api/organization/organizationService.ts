import api from '@/api/AxiosIntance';
import { errorHandler } from '@/utils/errorHandler';
import { OrganizationData } from '@/types';

type OrganizationResponse = {
    code: number | string;
    message: string | Record<keyof OrganizationData, string>;
    success: boolean;
};
const deleteOrganization = async (id: number): Promise<OrganizationResponse> => {
    const response = await api.delete(`/organization/delete/${id}`)
    return response.data
}
const selectOrganization = async (id: number): Promise<OrganizationResponse> => {
    const response = await api.post('set-organization', 
        {'organization_id':  id}
    )
    return response.data;
}
export { deleteOrganization, selectOrganization }
