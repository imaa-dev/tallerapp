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
                showLoading()
                const response = await deleteService(id);
                
                if(response.code === 200){
                    success(response.message)
                    setServiceShow(prev => prev.filter(ser => ser.id !== id))
                }
                if(response.code === 500){
                    error(response.message);
                }
            } catch(err) {
                console.log(err)
                error('Error eliminando servicio')
            } finally {
                hideLoading();
            }
        }, [showLoading, hideLoading, setServiceShow, success, error]
    )
    return { removeService }
}
