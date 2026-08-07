import axios from 'axios';
import { ServiceIssue } from '@/types';
const appUrl = import.meta.env.VITE_APP_URL;

type IssuesResponse = {
    code: number;
    message: string;
    data: ServiceIssue[];
};

type StoreIssueResponse = {
    code: number;
    message: string;
    data: ServiceIssue;
};

const getServiceIssues = async (serviId: number): Promise<IssuesResponse> => {
    const response = await axios.get(`${appUrl}/get-service-issues/${serviId}`, {
        withCredentials: true
    })
    return response.data;
}

const uploadIssue = async (issue: string, id: number): Promise<StoreIssueResponse> => {
    const formData = new FormData();
    formData.append('issue', issue);
    formData.append('service_id', id.toString());

    const response = await axios.post(`${appUrl}/store-service-issue`, formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data;

}

const deleteIssue = async (id: number): Promise<{ code: number; message: string; success: boolean }> => {
    const response = await axios.delete(`${appUrl}/delete-service-issue/${id}`, {
        withCredentials: true
    })
    return response.data
}
export { getServiceIssues, uploadIssue, deleteIssue }