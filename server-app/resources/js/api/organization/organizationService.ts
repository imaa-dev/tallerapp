import api from '@/api/AxiosIntance';
import { errorHandler } from '@/utils/errorHandler';
import { OrganizationData } from '@/types';

type OrganizationResponse = {
    code: number | string;
    message: string | Record<keyof OrganizationData, string>;
    success: boolean;
    
};
const deleteOrganization = async (id: number): Promise<OrganizationResponse> => {
    try{
        const response = await api.delete(`/organization/delete/${id}`)
        return response.data
    }catch(error: unknown){
        return errorHandler(error);
    }
}
export { deleteOrganization }
