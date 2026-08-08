import React, { useState } from 'react';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContextForm';
import { useLoading } from '@/context/LoadingContext';
import { router } from '@inertiajs/react';
import { Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import { sendCostApproval } from '@/api/services/serviService';

type ApprovalMethod = 'email' | 'whatsapp' | 'verbal';

export function ToCostApprovalForm({ serviceId }: { serviceId: number }) {
    const { success, error } = useToast();
    const { closeModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const [processing, setProcessing] = useState(false);

    const submit = async (method: ApprovalMethod) => {
        if (processing) {
            return;
        }
        setProcessing(true);
        showLoading();
        try {
            const response = await sendCostApproval(serviceId, method);
            success(response.message);
            closeModal();
            if (response.whatsapp_url) {
                window.location.href = response.whatsapp_url;
                return;
            }
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
            <form className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white p-6 shadow-md md:p-10 dark:bg-gray-800">
                <SidebarGroupLabel> Aprobación de costos </SidebarGroupLabel>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    El servicio pasará a reparación cuando el cliente apruebe los costos del diagnóstico. ¿Cómo deseas solicitar la aprobación?
                </p>
                <div className="flex w-full flex-col gap-3">
                    <Button type="button" tabIndex={1} disabled={processing} onClick={() => submit('email')}>
                        <Mail className="h-4 w-4" />
                        Via correo
                    </Button>
                    <Button type="button" tabIndex={2} disabled={processing} onClick={() => submit('whatsapp')}>
                        <MessageCircle className="h-4 w-4" />
                        Via whatsapp
                    </Button>
                    <Button type="button" tabIndex={3} disabled={processing} onClick={() => submit('verbal')}>
                        <CheckCircle2 className="h-4 w-4" />
                        Verbalmente aprobado
                    </Button>
                </div>
            </form>
        </React.Fragment>
    );
}
