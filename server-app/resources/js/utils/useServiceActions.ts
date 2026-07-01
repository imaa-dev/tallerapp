import { deleteService } from '@/api/services/serviService';
import { useLoading } from '@/context/LoadingContext';
import { useToast } from '@/context/ToastContext';
import React, { useCallback } from 'react';
import { ServiData } from '@/types';

export const useServiceActions = (
    setServiceShow: React.Dispatch<React.SetStateAction<ServiData[]>>
) => {
    const { showLoading, hideLoading } = useLoading();
    const { success, error } = useToast();
    const removeService = useCallback(
        async (id: number) => {
        try {
            showLoading();

            const response = await deleteService(id);

            success(response.message);

            setServiceShow(prev => prev.filter(ser => ser.id !== id));

        } catch (err: any) {
            const status = err.response?.status;
            console.log(status)

            if (status === 404) {
                error('Servicio no encontrado');
            } 
            if(status === 409){
                error(err.response.data.message)
            }
        } finally {
            hideLoading();
        }
        }, [showLoading, hideLoading, setServiceShow, success, error]
    )
    return { removeService }
}
