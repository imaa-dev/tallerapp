import api from '@/api/AxiosIntance';

const deleteService = async (id: number): Promise<{ code: number; message: string; success: boolean }> => {
    const response = await api.delete(`/delete/service/${id}`);
    return response.data;
};

const toGoBackService = async (service_id: number, status_service_id: number): Promise<{ code: number; message: string; success: boolean }> => {
    const response = await api.post('/to-go-back/service', {
        service_id,
        status_service_id,
    });
    return response.data;
};

const toCostApproval = async (serviceId: number): Promise<{ success: boolean; message: string; whatsapp_url?: string | null }> => {
    const response = await api.post('/to-cost-approval/service', {
        service_id: serviceId,
    });
    return response.data;
};

const sendCostApproval = async (
    serviceId: number,
    approvalMethod: 'email' | 'whatsapp' | 'verbal',
): Promise<{ success: boolean; message: string; whatsapp_url?: string | null }> => {
    const response = await api.post('/send-cost-approval/service', {
        service_id: serviceId,
        approval_method: approvalMethod,
    });
    return response.data;
};

const sendToDiagnosis = async (
    serviceId: number,
    approvalMethod: 'email' | 'whatsapp' | 'verbal',
): Promise<{ success: boolean; message: string; whatsapp_url?: string | null }> => {
    const response = await api.post('/to-diagnosis/service', {
        service_id: serviceId,
        approval_method: approvalMethod,
    });
    return response.data;
};

const finalRepairLink = async (
    serviceId: number,
    notificateWhatsapp: boolean,
): Promise<{ success: boolean; message: string; link?: string | null; whatsapp_url?: string | null }> => {
    const response = await api.post('/final-repair-link/service', {
        service_id: serviceId,
        notificate_whatsapp: notificateWhatsapp,
    });
    return response.data;
};

const saveRepairData = async (serviceId: number, repairPrice: number, finalNote: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/repair/service', {
        service_id: serviceId,
        repair_price: repairPrice,
        final_note: finalNote,
    });
    return response.data;
};

const sendFinalRepair = async (
    serviceId: number,
    approvalMethod: 'email' | 'whatsapp' | 'verbal',
    repairPrice: number,
    finalNote: string,
): Promise<{ success: boolean; message: string; whatsapp_url?: string | null }> => {
    const response = await api.post('/send-final-repair/service', {
        service_id: serviceId,
        approval_method: approvalMethod,
        repair_price: repairPrice,
        final_note: finalNote,
    });
    return response.data;
};

export { deleteService, finalRepairLink, saveRepairData, sendCostApproval, sendFinalRepair, sendToDiagnosis, toCostApproval, toGoBackService };
