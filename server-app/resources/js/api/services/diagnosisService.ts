import axios, { AxiosError } from "axios";
import api from '@/api/AxiosIntance';
import { DiagnosisData } from '@/types';
import { errorHandler } from "@/utils/errorHandler";

type ApiResponse = {
    success: boolean;
    code: number;
    message: string;
    errors?: Record<string, string[]>;
};

const createDiagnosis = async (data: DiagnosisData, selectedReasons: [], notificateClient: boolean, notificateTechnician: boolean):
    Promise <ApiResponse> => {
    try {

        const response = await api.post('create/diagnosis',
            {
                selected_resons: selectedReasons,
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
    } catch (e) {
        return errorHandler(e)
    }
}

const toAproveSpareParts = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await api.post('to-aprove-spare-part/service', {id: id});
        return response.data;
    } catch (e) {
        return errorHandler(e)
    }
}

export { createDiagnosis, toAproveSpareParts }
