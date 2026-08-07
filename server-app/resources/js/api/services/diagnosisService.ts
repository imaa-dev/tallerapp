import api from '@/api/AxiosIntance';
import { DiagnosisData, ServiceIssue } from '@/types';

type ApiResponse = {
    success: boolean;
    code: number;
    message: string;
    data?: ServiceIssue[];
    errors?: Record<string, string[]>;
};

const createDiagnosis = async (data: DiagnosisData, selectedIssues: Array<{ value: number | string }>, notificateClient: boolean, notificateTechnician: boolean):
    Promise <ApiResponse> => {
    const response = await api.post('create/diagnosis',
            {
                selected_issues: selectedIssues,
                notificate_client: notificateClient,
                notificate_technician: notificateTechnician,
                servi_id: data.servi_id,
                diagnosis: data.diagnosis,
                repair_time: data.repair_time,
                cost: data.cost
            }, {
            withCredentials: true,
        })
        return response.data
    
}

const toAproveSpareParts = async (id: number, notificateClient: boolean, notificateTechnician: boolean): Promise<ApiResponse> => {
    const response = await api.post('to-aprove-spare-part/service', {
        id: id,
        notificate_client: notificateClient,
        notificate_technician: notificateTechnician,
    });
    return response.data;
}

export { createDiagnosis, toAproveSpareParts }
