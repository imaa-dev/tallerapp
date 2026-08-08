import React, { useState } from 'react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { useLoading } from '@/context/LoadingContext';
import { router } from '@inertiajs/react';
import { toCostApproval } from '@/api/services/serviService';

export function ToCostApprovalTransitionForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [processing, setProcessing] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) {
            return;
        }
        setProcessing(true);
        showLoading();
        try {
            const response = await toCostApproval(serviceId);
            success(response.message);
            closeModal();
            router.visit('/service');
        } catch (err: any) {
            if (!err.response) {
                error('No fue posible conectar con el servidor.');
                return;
            }
            error(err.response.data?.message ?? 'Ha ocurrido un error.');
        } finally {
            setProcessing(false);
            hideLoading();
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={submit} className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800">
                <SidebarGroupLabel> Enviar a aprobación de costos </SidebarGroupLabel>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    El servicio pasará a la sección de aprobación de costos. Ahí podrás solicitar la aprobación del cliente por correo, whatsapp o verbalmente.
                </p>
                <Button type="submit" className="mt-4 w-full" disabled={processing}>
                    Enviar a aprobación de costos
                </Button>
            </form>
        </React.Fragment>
    );
}
