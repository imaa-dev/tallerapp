import { errorHandler } from "@/utils/errorHandler"
import api from "../AxiosIntance"

interface UserOrganization {
    userId: number,
    organizationId: number
}

 const storeOrganizationUser = async (data: UserOrganization): Promise<{code: number, message:string, success: boolean, data:UserOrganization }> => {
    try {
        const response = await api.post("store/user-technician-organization", data)
        return response.data
    } catch (error: unknown) {
        return errorHandler(error)
    }
 }
 export default storeOrganizationUser