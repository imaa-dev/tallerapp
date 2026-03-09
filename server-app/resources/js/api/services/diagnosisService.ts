import api from '@/api/AxiosIntance';
import { DiagnosisData } from '@/types';

const createDiagnosis = async (data: DiagnosisData, selectedReasons: [], notificate: boolean):
    Promise <{ success: boolean, code: number, message: string }> => {
    try {

        const response = await api.post('create/diagnosis',
            {
                selected_resons: selectedReasons,
                notificate: notificate,
                servi_id: data.servi_id,
                diagnosis: data.diagnosis,
                repair_time: data.repairTime,
                cost: data.cost
            }, {
            withCredentials: true,
        })
        return response.data
    } catch (e) {
        console.log(e, 'AXIOS ERROR')
        return {
            success: false,
            code: 500,
            message: "ERROR"
        }
    }
}

const toAproveSpareParts = async (id: number): Promise<{ success: boolean, code: number, message: string }> => {
    try {
        const response = await api.post('to-aprove-spare-part/service', {id: id});
        return response.data;
    } catch (e) {
        console.log(e, 'AXIOS ERROR');
        return {
            success: false,
            code: 500,
            message: "ERROR"
        }
    }
}

export { createDiagnosis, toAproveSpareParts }
