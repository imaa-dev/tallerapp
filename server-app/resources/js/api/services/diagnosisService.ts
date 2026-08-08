import api from '@/api/AxiosIntance';
import { DiagnosisData, ServiceIssue } from '@/types';

type ApiResponse = {
    success: boolean;
    code: number;
    message: string;
    data?: ServiceIssue[];
    errors?: Record<string, string[]>;
};

const createDiagnosis = async (data: DiagnosisData, selectedIssues: Array<{ value: number | string }>):
    Promise <ApiResponse> => {
    const response = await api.post('create/diagnosis',
            {
                selected_issues: selectedIssues,
                servi_id: data.servi_id,
                diagnosis: data.diagnosis,
                repair_time: data.repair_time,
                cost: data.cost
            }, {
            withCredentials: true,
        })
        return response.data
    
}

const toAproveSpareParts = async (id: number): Promise<ApiResponse> => {
    const response = await api.post('to-aprove-spare-part/service', {
        id: id,
    });
    return response.data;
}

export { createDiagnosis, toAproveSpareParts }
